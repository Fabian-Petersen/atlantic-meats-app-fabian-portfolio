import * as z from "zod";
import { assetRequestSchema } from "./assetSchemas";
import { presignedURLSchema } from "./jobSchemas";

export const transferStatusSchema = z.object({
  status: z.enum([
    "pending",
    "approved",
    "cancelled",
    "in-transit",
    "rejected",
    "completed",
  ]),
});

export type TransferStatus = z.infer<typeof transferStatusSchema.shape.status>;

// $  ─── Individual asset being transferred ──────────────────────────────────────

export const transferAssetBaseSchema = assetRequestSchema
  .pick({
    assetID: true,
    area: true,
    images: true,
    equipment: true,
  })
  .extend({
    // Asset ID is optional because an asset can follow the
    // unidentified-asset workflow.
    assetID: z.string().optional(),
    assetIssueReason: z
      .union([
        z.enum([
          "No barcode visible",
          "barcode damaged",
          "rental unit",
          "",
          "other",
        ]),
        z.literal(""),
      ])
      .optional(),
    assetIssueDetails: z.string().optional().default(""),
    transportInvoices: z.array(z.instanceof(File)).default([]),
  });

export const transferAssetSchema = transferAssetBaseSchema.superRefine(
  (data, ctx) => {
    const reason = data.assetIssueReason || undefined;

    if (reason === "other" && !data.assetIssueDetails?.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["assetIssueDetails"],
        message: "Please describe the issue with the asset ID",
      });
    }

    if (reason && (data.images?.length ?? 0) === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["images"],
        message: "Images are compulsory if no barcode is supplied",
      });
    }
  },
);

// $ ─── Transfer request ────────────────────────────────────────────────────────

export const transferRequestBaseSchema = z.object({
  locationFrom: z.string().min(1, { message: "Please select a location" }),
  locationTo: z.string().min(1, { message: "Please select a location" }),
  description: z.string().optional(),
  expectedDate: z
    .string()
    .min(1, { message: "Please enter expected date for transfer" }),
  transferReason: z.string().min(1, {
    message: "Give a brief reason for transfer request",
  }),
  // One transfer request can contain multiple assets.
  assets: z.array(transferAssetSchema).min(1, {
    message: "Please add at least one asset to the transfer",
  }),
});

export const transferRequestSchema = transferRequestBaseSchema.superRefine(
  (data, ctx) => {
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
        path: ["expectedDate"],
        message: "The expected transit date cannot be in the past.",
      });
    }
  },
);

/* -------------------------------------------------------------------------- */
/*                         TRANSFER REQUEST PAYLOAD                           */
/* -------------------------------------------------------------------------- */

/**
 * File metadata sent to the backend.
 *
 * The actual File object is never included in the API request.
 * The backend uses this metadata to generate presigned S3 URLs.
 */
export const transferFileMetadataSchema = z.object({
  filename: z.string(),
  content_type: z.string(),
});

/**
 * Asset payload sent to the backend when creating a transfer request.
 *
 * Images and transport invoices contain file metadata only.
 * The actual files are uploaded directly to S3 by the frontend
 * after receiving presigned URLs from the backend.
 */
export const transferAssetRequestPayloadSchema = transferAssetBaseSchema
  .omit({
    images: true,
    transportInvoices: true,
  })
  .extend({
    images: z.array(transferFileMetadataSchema).default([]),
    transportInvoices: z.array(transferFileMetadataSchema).default([]),
  });

/**
 * Payload sent to the backend when creating a transfer request.
 *
 * This differs from TransferRequestFormValues because the form
 * contains browser File objects while the API receives only
 * file metadata.
 */
export const transferRequestPayloadSchema = transferRequestBaseSchema.extend({
  assets: z.array(transferAssetRequestPayloadSchema),
});

// $ ─── Transfer Asset Response ────────────────────────────────────────────────────────

export const transferAssetResponseSchema = transferAssetBaseSchema
  .omit({
    images: true,
  })
  .extend({
    images: z.array(presignedURLSchema).default([]),
  });

export const transferRequestResponseSchema = transferRequestBaseSchema.extend({
  assets: z.array(transferAssetResponseSchema),
  requested_by: z.string(),
  requestor_name: z.string(),
  requestor_email: z.email(),
  requestor_sub: z.string(),
  schedule_name: z.string(),
  images: z.array(presignedURLSchema).default([]),
});

/* -------------------------------------------------------------------------- */
/*                                   APPROVAL                                 */
/* -------------------------------------------------------------------------- */

export const transferApprovalResponseSchema = z.object({
  approvalId: z.string(),
  approvedDate: z.string(),
  approvedBy: z.string(),
  approvedBySub: z.string(),
  approvalReminderCount: z.number().default(0),
});

/* -------------------------------------------------------------------------- */
/*                                   TRANSIT                                  */
/* -------------------------------------------------------------------------- */

export const transferInTransitBaseSchema = z.object({
  transportType: z.enum(["courier", "contractor", "employee", "other", ""]),
  transportName: z.string().min(1, { message: "Please enter a name" }),
  trackingNumber: z.string().optional(),
  transportDate: z
    .string()
    .min(1, { message: "Please enter a transport date" }),
  transportCost: z.coerce
    .number()
    .optional()
    .refine(
      (value) => !value || (!Number.isNaN(Number(value)) && Number(value) >= 0),
      {
        message: "Please enter a valid transport cost.",
      },
    ),
  transportNotes: z.string().optional(),
  // NEW uploads only
  images: z.array(z.instanceof(File)).default([]),
  transportInvoices: z.array(z.instanceof(File)).default([]),
});

export const transferInTransitRequestSchema =
  transferInTransitBaseSchema.superRefine((data, ctx) => {
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

export const transferInTransitResponseSchema = transferInTransitBaseSchema
  .omit({
    transportInvoices: true,
    images: true,
  })
  .extend({
    transitId: z.string(), // Backend-generated transit record ID
    dateCreated: z.string(), // Backend-generated timestamp
    inTransitSub: z.string(), // Cognito user who marked the transfer in transit
    inTransitBy: z.string(), // Cognito user name who made the transfer in transit
    images: z.array(presignedURLSchema).default([]),
    transportInvoices: z.array(presignedURLSchema).default([]),
  });

/* -------------------------------------------------------------------------- */
/*                                   RECEIPT                                  */
/* -------------------------------------------------------------------------- */

export const transferReceiptBaseSchema = z.object({
  receiptDate: z.string().min(1, { message: "Please enter the date received" }),
  condition: z.enum(["excellent", "good", "fair", "damaged"]),
  damageDetails: z.string().optional(), // if condition is damaged, this field is required
  receiptNotes: z.string().optional(),
  // NEW uploads only
  images: z.array(z.instanceof(File)).default([]),
  deliveryNote: z.array(z.instanceof(File)).default([]),
});

export const transferReceiptRequestSchema =
  transferReceiptBaseSchema.superRefine((data, ctx) => {
    if (data.condition === "damaged" && !data.damageDetails) {
      ctx.addIssue({
        code: "custom",
        path: ["damageDetails"],
        message: "Damage details are required when the condition is damaged.",
      });
    }
  });

export const transferReceiptResponseSchema = transferReceiptBaseSchema
  .omit({
    images: true,
    deliveryNote: true,
  })
  .extend({
    receiptDate: z.string(), // backend field for when the transfer was created
    receivedBySub: z.string(), // backend field for when the transfer was created
    dateReceiptCreated: z.string(),
    receiptCondition: z.string(),
    receiptBy: z.string(),
    damageDetails: z.string(),
    receiptNotes: z.string(),
    receiptImages: z.array(presignedURLSchema).default([]),
    deliveryNote: z.array(presignedURLSchema).default([]),
  });

/* -------------------------------------------------------------------------- */
/*                                   CANCEL                                   */
/* -------------------------------------------------------------------------- */

export const transferCancelledResponseSchema = z.object({
  dateCancelled: z.string(),
  cancelledBySub: z.string(),
  cancelReason: z.string(),
  cancelStatus: z.string(),
});

/* -------------------------------------------------------------------------- */
/*                                   REJECTED                                   */
/* -------------------------------------------------------------------------- */

export const transferRejectedRequestSchema = z.object({
  reason: z
    .string()
    .min(1, "Please provide a reason for rejecting this request."),
});

export const transferRejectedResponseSchema = z.object({
  dateRejected: z.string(),
  rejectedBySub: z.string(),
  rejectedReason: z.string(),
  rejectedStatus: z.string(),
  rejectedBy: z.string(),
});

export const transferWorkflowResponseSchema = z.object({
  id: z.string(),
  assetID: z.string(),
  transferCreated: z.string(),
  status: transferStatusSchema.shape.status,
  equipment: z.string(),

  pending: transferRequestResponseSchema.nullable(),
  approved: transferApprovalResponseSchema.nullable(),
  "in-transit": transferInTransitResponseSchema.nullable(),
  cancelled: transferCancelledResponseSchema.nullable(),
  rejected: transferRejectedResponseSchema,
  completed: transferReceiptResponseSchema.nullable(),
});

/* -------------------------------------------------------------------------- */
/*                                    TABLE ROWS                              */
/* -------------------------------------------------------------------------- */
/**
 * The pending and approved requests use the same row data only status differ hence keep
 * schema the same
 */
export const pendingTableRowSchema = transferWorkflowResponseSchema
  .pick({
    id: true,
    assetID: true,
    transferCreated: true,
    status: true,
    equipment: true,
  })
  .extend(transferRequestResponseSchema.shape)
  .omit({
    images: true,
  });

export const transitTableRowSchema = transferWorkflowResponseSchema
  .pick({
    id: true,
    assetID: true,
    status: true,
    equipment: true,
  })
  .extend(transferInTransitResponseSchema.shape)
  .omit({
    images: true,
    transportInvoices: true,
  });

export const completedTransferTableRowSchema = transitTableRowSchema.extend(
  transferReceiptResponseSchema.shape,
);

/* -------------------------------------------------------------------------- */
/*                                    TYPES                                   */
/* -------------------------------------------------------------------------- */

export type TransferResponseSchema = z.infer<
  typeof transferRequestResponseSchema
>;

export type TransferRequestFormValues = z.infer<typeof transferRequestSchema>;
export type TransferResponseValues = z.infer<
  typeof transferRequestResponseSchema
>;

export type TransferRequestPayload = z.infer<
  typeof transferRequestPayloadSchema
>;
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

// export type TransferTransitTableRow = z.infer<typeof transitTableRowSchema>;
export type TransferPendingTableRow = z.infer<typeof pendingTableRowSchema>;
export type TransferTransitTableRow = z.infer<typeof transitTableRowSchema>;

export type TransferWorkflowResponse = z.infer<
  typeof transferWorkflowResponseSchema
>;

export type RejectRequestFormValues = z.infer<
  typeof transferRejectedRequestSchema
>;
