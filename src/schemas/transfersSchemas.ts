import * as z from "zod";
import { assetRequestSchema } from "./assetSchemas";
// import { PresignedURL } from "./assetSchemas";

// $ Schema to create a maintenance request
export const transferRequestSchema = assetRequestSchema
  .pick({
    assetID: true,
    area: true,
    images: true,
    equipment: true,
  })
  .extend({
    assetID: z.string().optional(), // override assetID to make it optional
    locationFrom: z.string().min(1, { message: "Please select a location" }),
    locationTo: z.string().min(1, { message: "Please select a location" }),
    description: z.string().optional(),
    expectedDate: z
      .string()
      .min(1, { message: "Please enter expected date for transfer" }),
    transferReason: z.string().min(1, {
      message: "Give a brief reason for transfer request",
    }),
    // hasBarcode: z.string().optional(),
    // description: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.locationFrom === data.locationTo) {
      ctx.addIssue({
        code: "custom",
        path: ["locationTo"],
        message: "The location To must be different from the current location.",
      });
    }

    const selectedDate = new Date(data.expectedDate);

    // Set today's time to midnight so only the date is compared
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      ctx.addIssue({
        code: "custom",
        path: ["transferDate"],
        message: "The transfer date cannot be in the past.",
      });
    }

    // if (data.hasBarcode === "yes" && !data.assetID?.trim()) {
    //   ctx.addIssue({
    //     code: "custom",
    //     path: ["assetID"],
    //     message: "Please enter the asset ID.",
    //   });
    // }

    // if (data.hasBarcode === "no" && !data.description?.trim()) {
    //   ctx.addIssue({
    //     code: "custom",
    //     path: ["description"],
    //     message: "Please enter a description or serial number.",
    //   });
    // }
  });

export const transferResponseSchema = transferRequestSchema
  // .omit({
  //   images: true, // Omit images from the response schema
  // })
  .extend({
    id: z.string(),
    transferCreated: z.string(),
    status: z.string(),
    requested_by: z.string(),
    requestor_name: z.string(),
    requestor_email: z.string(),
    requestor_sub: z.string(),
  });

/* -------------------------------------------------------------------------- */
/*                                   TRANSIT                                  */
/* -------------------------------------------------------------------------- */

export const transferInTransitRequestSchema = z
  .object({
    transportType: z.enum(["courier", "contractor", "employee", "other"]),
    transportName: z.string().min(1, { message: "Please enter a name" }),
    trackingNumber: z.string().optional(),
    transportDate: z.string(),
    transportCost: z
      .string()
      .optional()
      .refine(
        (value) =>
          !value || (!Number.isNaN(Number(value)) && Number(value) >= 0),
        {
          message: "Please enter a valid transport cost.",
        },
      ),
    transportNotes: z.string().optional(),
    // NEW uploads only
    images: z.array(z.instanceof(File)).default([]),
    invoices: z.array(z.instanceof(File)).default([]),
  })
  .superRefine((data, ctx) => {
    if (data.transportType === "courier" && !data.trackingNumber?.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["trackingNumber"],
        message: "Tracking number is required for courier transport.",
      });
    }

    const selectedDate = new Date(data.transportDate);

    // Set today's time to midnight so only the date is compared
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      ctx.addIssue({
        code: "custom",
        path: ["transportDate"],
        message: "The transport date cannot be in the past.",
      });
    }
  });

export const transferInTransitResponseSchema =
  transferInTransitRequestSchema.extend({
    transitId: z.string(), // backend field for when the transfer was created
    dateCreated: z.string(), // backend field for when the transfer was created
    inTransitSub: z.string(), // backend field for when the transfer was created
    invoiceUrl: z.string().optional(),
    status: z.string(),
  });

export const transitTableRowSchema = assetRequestSchema
  .pick({
    assetID: true,
    equipment: true,
  })
  .safeExtend(transferInTransitResponseSchema.shape);

/* -------------------------------------------------------------------------- */
/*                                   RECEIPT                                  */
/* -------------------------------------------------------------------------- */

export const transferReceiptRequestSchema = z
  .object({
    dateReceived: z
      .string()
      .min(1, { message: "Please enter the date received" }),
    condition: z.enum(["excellent", "good", "fair", "damaged"]),
    damageDetails: z.string(), // if condition is damaged, this field is required
    receiptNotes: z.string().optional(),
    // NEW uploads only
    receiptImages: z.array(z.instanceof(File)).default([]),
    deliveryNote: z.array(z.instanceof(File)).default([]),
  })
  .superRefine((data, ctx) => {
    if (data.condition === "damaged" && !data.damageDetails) {
      ctx.addIssue({
        code: "custom",
        path: ["damageDetails"],
        message: "Damage details are required when the condition is damaged.",
      });
    }
  });

export const transferReceiptResponseSchema =
  transferReceiptRequestSchema.extend({
    receiptId: z.string(), // backend field for when the transfer was created
    receiptCreated: z.string(), // backend field for when the transfer was created
    receivedBySub: z.string(), // backend field for when the transfer was created
    receiptImagesUrl: z.string().optional(),
    deliveryNoteUrl: z.string().optional(),
  });

export const transferWorkflowResponseSchema = z.object({
  request: transferResponseSchema,
  inTransit: transferInTransitResponseSchema,
  receipt: transferReceiptResponseSchema,
});

/* -------------------------------------------------------------------------- */
/*                                    TYPES                                   */
/* -------------------------------------------------------------------------- */

export type TransferResponseSchema = z.infer<typeof transferResponseSchema>;

export type TransferRequestFormValues = z.infer<typeof transferRequestSchema>;
export type TransferResponseValues = z.infer<typeof transferResponseSchema>;
export type TransferInTransitRequestValues = z.infer<
  typeof transferInTransitRequestSchema
>;
export type TransferInTransitResponse = z.infer<
  typeof transferInTransitResponseSchema
>;
export type TransferReceiptRequestValues = z.infer<
  typeof transferReceiptRequestSchema
>;

export type TransferReceiptResponse = z.infer<
  typeof transferReceiptResponseSchema
>;

export type TransferTransitTableRow = z.infer<typeof transitTableRowSchema>;

export type TransferWorkflowResponse = z.infer<
  typeof transferWorkflowResponseSchema
>;
