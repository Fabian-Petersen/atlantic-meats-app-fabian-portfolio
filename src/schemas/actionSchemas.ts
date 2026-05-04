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
  work_order_number: z.string().optional(),
  work_completed: z.string().min(1, { message: "Please enter work completed" }),
  status: z.string().min(1, { message: "" }), // "pending", "in progress", "complete"
  root_cause: z.enum(ROOT_CAUSES, {
    message: "please select a root cause for breakdown",
  }),
  findings: z.string().optional(),
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
 * 2. End time cannot be in the future
 *    - Prevents completion timestamps from being set ahead of the current system time.
 *
 * 3. End time must be after start time
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

    if (end > now) {
      ctx.addIssue({
        path: ["end_time"],
        code: "custom",
        message: "End time cannot be in the future",
      });
    }

    if (end < start) {
      ctx.addIssue({
        path: ["end_time"],
        code: "custom",
        message: "End time cannot be before start time",
      });
    }
  },
);

// % Schema expected from the backend
export const actionResponseSchema = defaultActionRequestSchema.extend({
  id: z.string(),
  actionCreated: z.string(),
  actioned_by: z.string(),
  request_id: z.string(),
  action_id: z.string().optional(),
  completed_at: z.string().optional(),
  location: z.string(),
  requested_by: z.string(),
  jobcardNumber: z.string(),
  presigned_urls: presignedURLResponseSchema.array().optional(),
});

// $ Type for sending the Action to the backend excluding the images (the images is not included with the initial request). Backend will send a presignURL for the images
export type ActionRequestPayload = Omit<ActionRequestFormValues, "images"> & {
  images: {
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
