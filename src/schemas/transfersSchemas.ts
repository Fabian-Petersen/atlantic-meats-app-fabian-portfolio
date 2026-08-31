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
  transportInvoices: z.array(z.instanceof(File)).optional().default([]),
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
  // -------------------------------------------------------------------------
  // Location validation
  // -------------------------------------------------------------------------
  (data, ctx) => {
    if (data.locationFrom === data.locationTo) {
      ctx.addIssue({
        code: "custom",
        path: ["locationTo"],
        message: "The location To must be different from the current location.",
      });
    }

    // -------------------------------------------------------------------------
    // Expected date validation
    // -------------------------------------------------------------------------

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

    // -------------------------------------------------------------------------
    // Duplicate asset validation
    // -------------------------------------------------------------------------

    const assetIDIndexes = new Map<string, number[]>();

    data.assets.forEach((asset, index) => {
      const assetID = asset.assetID?.trim();

      if (!assetID) return;

      const indexes = assetIDIndexes.get(assetID) ?? [];
      indexes.push(index);
      assetIDIndexes.set(assetID, indexes);
    });

    assetIDIndexes.forEach((indexes) => {
      if (indexes.length > 1) {
        indexes.forEach((index) => {
          ctx.addIssue({
            code: "custom",
            path: ["assets", index, "assetID"],
            message: "Please ensure assets are not duplicated",
          });
        });
      }
    });
  },
);

/* -------------------------------------------------------------------------- */
/*                         TRANSFER REQUEST PAYLOAD                           */
/* -------------------------------------------------------------------------- */

/**
 * File metadata sent to the backend.
 *
 * The actual File object is uploaded directly to S3.
 * Only the metadata is included in the API payload.
 */
export const transferFileMetadataSchema = z.object({
  filename: z.string(),
  content_type: z.string(),
});

/**
 * Individual asset payload.
 *
 * This is the API representation of an asset.
 * Unlike transferAssetSchema, `images` contains metadata
 * instead of browser File objects.
 */
export const transferAssetRequestPayloadSchema = transferAssetBaseSchema
  .omit({
    images: true,
  })
  .extend({
    images: z.array(transferFileMetadataSchema).default([]),
  });

/**
 * Transfer request payload.
 *
 * `transportInvoices` belongs to the transfer itself because
 * one invoice can cover the movement of all assets.
 */
export const transferRequestPayloadSchema = transferRequestBaseSchema
  .omit({
    transportInvoices: true,
    assets: true,
  })
  .extend({
    transportInvoices: z
      .array(transferFileMetadataSchema)
      .optional()
      .default([]),

    assets: z.array(transferAssetRequestPayloadSchema).min(1, {
      message: "Please add at least one asset to the transfer",
    }),
  });

// $ ─── Transfer Asset Response ────────────────────────────────────────────────────────

export const transferAssetResponseSchema = transferAssetBaseSchema
  .omit({
    images: true,
  })
  .extend({
    images: z.array(presignedURLSchema).default([]),
  });

export const transferRequestResponseSchema = transferRequestBaseSchema
  .omit({ assets: true })
  .extend({
    requested_by: z.string(),
    requestor_name: z.string(),
    requestor_email: z.email(),
    requestor_sub: z.string(),
    schedule_name: z.string(),
    // images: z.array(presignedURLSchema).default([]),
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
    dateTransitCreated: z.string(), // Backend-generated timestamp
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

export const transferReceiptPayloadSchema = transferReceiptBaseSchema
  .omit({
    images: true,
    deliveryNote: true,
  })
  .extend({
    images: z.array(transferFileMetadataSchema).default([]),
    deliveryNote: z.array(transferFileMetadataSchema).default([]),
  })
  .extend({
    status: z.string(),
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
  assets: z.array(transferAssetResponseSchema),
  transferCreated: z.string(),
  status: transferStatusSchema.shape.status,

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
    transferCreated: true,
    status: true,
    assets: true,
  })
  .extend(transferRequestResponseSchema.shape);

export const transitTableRowSchema = transferWorkflowResponseSchema
  .pick({
    id: true,
    assets: true,
    status: true,
  })
  .extend(transferInTransitResponseSchema.shape)
  .omit({
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

/**
 * The actual on-the-wire shape sent to the API.
 * Diverges from the form values: adds `status`, and
 * `images` is metadata (post-upload) rather than raw File[].
 */
export type TransferInTransitRequestPayload = Omit<
  TransferInTransitRequestValues,
  "images" | "transportInvoices"
> & {
  status: "in-transit";
  images: { filename: string; content_type: string }[];
  transportInvoices: { filename: string; content_type: string }[];
};

export type TransferInTransitResponse = z.infer<
  typeof transferInTransitResponseSchema
>;

/* -------------------------------------------------------------------------- */
/*                                RECEIPT TYPES                                */
/* -------------------------------------------------------------------------- */

export type TransferReceiptRequestValues = z.infer<
  typeof transferReceiptRequestSchema
>;

export type TransferReceiptResponse = z.infer<
  typeof transferReceiptResponseSchema
>;

export type TransferReceiptRequestPayload = z.infer<
  typeof transferReceiptPayloadSchema
>;

/* -------------------------------------------------------------------------- */
/*                             TABLE TYPES                                    */
/* -------------------------------------------------------------------------- */

// export type TransferTransitTableRow = z.infer<typeof transitTableRowSchema>;
export type TransferPendingTableRow = z.infer<typeof pendingTableRowSchema>;
// Grabs the array element type from the existing `assets` field,
// then narrows to just the two fields the dropdown cell needs.
export type AssetItem = Pick<
  TransferPendingTableRow["assets"][number],
  "equipment" | "assetID"
>;
export type TransferTransitTableRow = z.infer<typeof transitTableRowSchema>;

export type TransferWorkflowResponse = z.infer<
  typeof transferWorkflowResponseSchema
>;

/* -------------------------------------------------------------------------- */
/*                             REJECT FORM TYPES                              */
/* -------------------------------------------------------------------------- */

export type RejectRequestFormValues = z.infer<
  typeof transferRejectedRequestSchema
>;
