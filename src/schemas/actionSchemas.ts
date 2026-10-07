import * as z from "zod";

//$ import types
import { ROOT_CAUSES } from "@/data/maintenanceAction";

export const presignedURLResponseSchema = z.object({
  filename: z.string(),
  url: z.string(),
  key: z.string(),
  content_type: z.string(),
});

export type PresignedUrlResponse = z.infer<typeof presignedURLResponseSchema>;

const actionExpenseItemSchema = z.object({
  description: z.string().trim().min(1, "Description is required"),
  cost: z
    .string()
    .trim()
    .min(1, "Cost is required")
    .refine(
      (value) => Number.isFinite(Number(value)) && Number(value) >= 0,
      "Cost must be zero or greater",
    ),
});

export const actionExpensePayloadItemSchema = z.object({
  description: z.string().trim().min(1),
  cost: z.number().nonnegative(),
});

const actionExpenseResponseItemSchema = z.object({
  description: z.string(),
  cost: z.union([z.string(), z.number()]),
});

const actionExpenseResponseSchema = z.union([
  z.string(),
  z.array(z.union([z.string(), actionExpenseResponseItemSchema])),
]);

export type ActionExpensePayloadItem = z.infer<
  typeof actionExpensePayloadItemSchema
>;
export type ActionExpenseResponseValue = z.infer<
  typeof actionExpenseResponseSchema
>;

export const defaultActionRequestSchema = z.object({
  start_time: z
    .string()
    .min(1, "Start time required")
    .refine((val) => !Number.isNaN(Date.parse(val)), "Invalid date/time"),
  end_time: z
    .string()
    .min(1, "End time required")
    .refine((val) => !Number.isNaN(Date.parse(val)), "Invalid date/time"),
  total_km: z
    .string()
    .min(1, { message: "Total km is required" })
    .refine(
      (val) => {
        const num = Number(val);
        return Number.isFinite(num) && num > 0;
      },
      { message: "Start km must be a greater than zero" },
    ),
  work_completed: z.string().min(1, { message: "Please enter work completed" }),
  status: z.string().min(1, { message: "Please select a job status" }), // "pending", "in progress", "complete"
  root_cause: z.enum(ROOT_CAUSES, {
    message: "please select a root cause for breakdown",
  }),
  findings: z.string().min(1, { message: "Please enter findings" }),
  part_items: z.array(actionExpenseItemSchema).default([]),
  sundry_items: z.array(actionExpenseItemSchema).default([]),
  sundries: z.string().optional(),
  total_cost_sundries: z.string().optional(),
  parts: z.string().optional(),
  total_cost_parts: z.string().optional(),
  contractor_enabled: z.boolean().default(false),
  contractor: z.string().optional(),
  total_cost_contractor: z.string().optional(),
  invoices: z.array(z.instanceof(File)).default([]).optional(),
  images: z.array(z.instanceof(File)).default([]).optional(),
  signature: z.string().min(1, { message: "Signature is required" }),
  signedBy: z.string().min(1, { message: "Please enter name of signatory" }),
});

/**
 * Validates logical constraints between start_time and end_time fields.
 *
 * Rules enforced:
 *
 * 1. Start time cannot be in the future
 *    - Ensures the job or action has already started or is not scheduled incorrectly.
 *
 * 2. End time must be at or after start time
 *    - Ensures chronological consistency between the two timestamps.
 *
 * Notes:
 * - Both fields are parsed using JavaScript Date constructor.
 * - Invalid or unparsable dates should already be handled in base field validation.
 * - Issues are attached to specific fields for proper form error mapping.
 */

export const actionRequestSchema = defaultActionRequestSchema.superRefine(
  (data, ctx) => {
    const now = new Date();
    const start = new Date(data.start_time);
    const end = new Date(data.end_time);

    if (start > now) {
      ctx.addIssue({
        path: ["start_time"],
        code: "custom",
        message: "Start time cannot be in the future",
      });
    }

    if (end < start) {
      ctx.addIssue({
        path: ["end_time"],
        code: "custom",
        message: "Completion time cannot be before start time",
      });
    }

    if (data.contractor_enabled) {
      if (!data.contractor?.trim()) {
        ctx.addIssue({
          path: ["contractor"],
          code: "custom",
          message: "Contractor name is required",
        });
      }

      const contractorCost = data.total_cost_contractor?.trim() ?? "";
      if (!contractorCost) {
        ctx.addIssue({
          path: ["total_cost_contractor"],
          code: "custom",
          message: "Contractor cost is required",
        });
      } else if (
        !Number.isFinite(Number(contractorCost)) ||
        Number(contractorCost) < 0
      ) {
        ctx.addIssue({
          path: ["total_cost_contractor"],
          code: "custom",
          message: "Contractor cost must be zero or greater",
        });
      }
    }
  },
);

// % Schema expected from the backend
export const actionResponseSchema = defaultActionRequestSchema
  .omit({
    part_items: true,
    sundry_items: true,
    contractor_enabled: true,
  })
  .extend({
    id: z.string(),
    assetID: z.string(),
    actionCreated: z.string(),
    actioned_by: z.string(),
    request_id: z.string(),
    action_id: z.string().optional(),
    completed_at: z.string().optional(),
    location: z.string(),
    requested_by: z.string(),
    jobcardNumber: z.string(),
    // Retained for historical completed-job records only. New action requests
    // no longer collect or submit a works order number.
    work_order_number: z.string().optional(),
    equipment: z.string().optional(),
    assets: z
      .array(
        z.object({
          equipment: z.string(),
          assetID: z.string().optional(),
        }),
      )
      .optional(),
    sundries: actionExpenseResponseSchema.optional(),
    total_cost_sundries: z.union([z.string(), z.number()]).optional(),
    parts: actionExpenseResponseSchema.optional(),
    total_cost_parts: z.union([z.string(), z.number()]).optional(),
    total_cost_contractor: z.union([z.string(), z.number()]).optional(),
    invoices: presignedURLResponseSchema.array().optional(),
    images: presignedURLResponseSchema.array().optional(),
  });

// $ Type for sending the Action to the backend excluding the images (the images is not included with the initial request). Backend will send a presignURL for the images
export type ActionRequestPayload = Omit<
  ActionRequestFormValues,
  | "images"
  | "invoices"
  | "part_items"
  | "sundry_items"
  | "contractor_enabled"
  | "parts"
  | "sundries"
  | "total_cost_parts"
  | "total_cost_sundries"
> & {
  parts: ActionExpensePayloadItem[];
  sundries: ActionExpensePayloadItem[];
  total_cost_parts: number;
  total_cost_sundries: number;
  images: {
    filename: string;
    content_type: string;
  }[];
  invoices: {
    filename: string;
    content_type: string;
  }[];
  signature?: string | null; // base64 PNG
  selectedRowId: string;
  jobCardNumber?: string; // ID of the maintenance request being actioned
};

// $ Schema for the Jobs Completed Table Menu
export const actionTableRowSchema = actionResponseSchema
  .omit({
    signature: true,
    findings: true,
    images: true,
    root_cause: true,
    work_completed: true,
  })
  .extend({
    id: z.string(),
    actioned_by: z.string(),
    actionCreated: z.string(),
    location: z.string(),
    requested_by: z.string(),
    jobcardNumber: z.string(),
  });

export type ActionTableRow = z.infer<typeof actionTableRowSchema>;
export type ActionRequestFormValues = z.infer<typeof actionRequestSchema>;
export type ActionAPIResponse = z.infer<typeof actionResponseSchema>;
