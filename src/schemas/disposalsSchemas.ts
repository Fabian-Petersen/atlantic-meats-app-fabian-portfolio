import * as z from "zod";
import { assetRequestSchema } from "./assetSchemas";
import { presignedURLSchema } from "./jobSchemas";

/** Workflow states stored by the disposal backend. */
export const disposalStatusSchema = z.enum([
  "pending",
  "approved",
  "rejected",
  "expired",
  "cancelled",
  "disposed",
]);

export type DisposalStatus = z.infer<typeof disposalStatusSchema>;

export const disposalReasons = [
  "scrap",
  "sell",
  "trade-in",
  "obsolete",
  "end-of-life",
  "beyond-economic-repair",
  "damaged",
  "surplus",
  "replacement",
  "donation",
  "return-to-supplier",
  "lost",
  "stolen",
  "other",
] as const;

export const disposalReasonSchema = z.enum(disposalReasons);

// $  ─── Individual asset being disposed ──────────────────────────────────────

export const disposalAssetBaseSchema = assetRequestSchema
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

export const disposalAssetSchema = disposalAssetBaseSchema.superRefine(
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

// $ ─── Disposal request ────────────────────────────────────────────────────────

/**
 * Create-disposal form values. A request has one lifecycle and at least one
 * selected asset; partial disposal is not modelled by this schema.
 */
export const disposalRequestBaseSchema = z.object({
  location: z.string().min(1, { message: "Please select a location" }),
  disposalReason: z.union([disposalReasonSchema, z.literal("")]),
  description: z.string().min(1, {
    message: "Please provide a disposal description",
  }),
  expectedDisposalDate: z.string().min(1, {
    message: "Please enter an expected disposal date",
  }),
  assets: z.array(disposalAssetSchema).min(1, {
    message: "Please add at least one asset to the disposal request",
  }),
});

// -------------------------------------------------------------------------
// Disposal Base Schema with Refining
// -------------------------------------------------------------------------

export const disposalRequestSchema = disposalRequestBaseSchema.superRefine(
  (data, ctx) => {
    if (!data.disposalReason) {
      ctx.addIssue({
        code: "custom",
        path: ["disposalReason"],
        message: "Please select a disposal reason",
      });
    }

    // -------------------------------------------------------------------------
    // Expected date validation
    // -------------------------------------------------------------------------
    const selectedDate = new Date(data.expectedDisposalDate);

    // Set today's time to midnight so only the date is compared
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      ctx.addIssue({
        code: "custom",
        path: ["expectedDisposalDate"],
        message: "The expected disposal date cannot be in the past.",
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
/*                         DISPOSAL REQUEST PAYLOAD                           */
/* -------------------------------------------------------------------------- */

/**
 * File metadata sent to the backend.
 *
 * The actual File object is uploaded directly to S3.
 * Only the metadata is included in the API payload.
 */
export const disposalFileMetadataSchema = z.object({
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
export const disposalAssetRequestPayloadSchema = disposalAssetBaseSchema
  .omit({
    images: true,
  })
  .extend({
    images: z.array(disposalFileMetadataSchema).default([]),
  });

/**
 * Disposal request payload.
 *
 * `transportInvoices` belongs to the transfer itself because
 * one invoice can cover the movement of all assets.
 */
export const disposalRequestPayloadSchema = disposalRequestBaseSchema
  .omit({
    assets: true,
  })
  .extend({
    assets: z.array(disposalAssetRequestPayloadSchema).min(1, {
      message: "Please add at least one asset to the transfer",
    }),
  });

// $ ─── Disposal Asset Response ────────────────────────────────────────────────────────

/**
 * Browser-form representation of an asset selected for disposal.
 *
 * `equipment`, `area`, issue information, and Files support the UI. The create
 * endpoint payload deliberately sends only `assetID` and `assetIndex`; the
 * backend retrieves authoritative asset details from `assets_table`.
 */
export const disposalAssetFormSchema = disposalAssetBaseSchema.extend({
  assetIndex: z.number().int().nonnegative(),
});

/** API representation of an asset stored on a disposal request. */
export const disposalAssetResponseSchema = disposalAssetFormSchema
  .omit({ images: true })
  .extend({
    images: z.array(presignedURLSchema).default([]),
  });

/** Form values for POST /asset-disposals/{disposalId}/approval. */
export const disposalApprovalSchema = z
  .object({
    decision: z.enum(["APPROVED", "REJECTED"]),
    rejectionReason: z.string().optional().default(""),
  })
  .superRefine((data, ctx) => {
    if (data.decision === "REJECTED" && !data.rejectionReason.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["rejectionReason"],
        message: "Please provide a rejection reason",
      });
    }
  });

/** Form values for POST /asset-disposals/{disposalId}/dispose. */
export const disposalCompletionSchema = z.object({
  disposalMethod: z.string().min(1, {
    message: "Please provide a disposal method",
  }),
  disposalLocation: z.string().nullable().optional().default(null),
  disposalCost: z.number().nonnegative().nullable().optional().default(null),
  disposalNotes: z.string().nullable().optional().default(null),
  disposalImages: z.array(z.instanceof(File)).default([]),
  disposalDocuments: z.array(z.instanceof(File)).default([]),
});

/**
 * File-free completion payload used after files have been uploaded to storage.
 * The README defines retained S3 metadata as bucket, key, and filename.
 */
export const disposalCompletionPayloadSchema = disposalCompletionSchema
  .omit({ disposalImages: true, disposalDocuments: true })
  .extend({
    disposalImages: z.array(disposalFileMetadataSchema).default([]),
    disposalDocuments: z.array(disposalFileMetadataSchema).default([]),
  });

/** Form values for POST /asset-disposals/{disposalId}/cancel. */
export const disposalCancellationSchema = z.object({
  cancelReason: z.string().min(1, {
    message: "Please provide a cancellation reason",
  }),
});

const disposalPendingSchema = z.object({
  requestedBy: z.string(),
  requestorName: z.string(),
  requestorSub: z.string(),
  disposalReason: z.string(),
  location: z.string(),
  expectedDisposalDate: z.string(),
});

const disposalApprovedSchema = z.object({
  approvalId: z.string(),
  approvedDate: z.string(),
  approvedBy: z.string(),
  approvedBySub: z.string(),
  approvalReminderCount: z.number(),
});

const disposalCancelledSchema = z.object({
  cancelledDate: z.string(),
  cancelledBy: z.string(),
  cancelledBySub: z.string(),
  cancelReason: z.string(),
});

const disposalRejectedSchema = z.object({
  rejectedDate: z.string(),
  rejectedBy: z.string(),
  rejectedBySub: z.string(),
  rejectionReason: z.string(),
});

const disposalExpiredSchema = z.object({
  expiredDate: z.string(),
  reason: z.string(),
});

/** Complete progressive disposal item returned by the list/detail endpoints. */
export const disposalWorkflowResponseSchema = disposalRequestBaseSchema
  .omit({ assets: true })
  .extend({
    assetID: z.string(),
    id: z.string(),
    disposalCreated: z.string(),
    status: disposalStatusSchema,
    requestorSub: z.string(),
    approverSub: z.string().nullable(),
    schedule_name: z.string().optional(),
    assets: z.array(disposalAssetResponseSchema).min(1),
    pending: disposalPendingSchema,
    approved: disposalApprovedSchema.nullable(),
    disposed: disposalCompletionPayloadSchema
      .extend({
        disposalId: z.string(),
        disposedDate: z.string(),
        disposedBy: z.string(),
        disposedBySub: z.string(),
      })
      .nullable(),
    cancelled: disposalCancelledSchema.nullable(),
    rejected: disposalRejectedSchema.nullable(),
    expired: disposalExpiredSchema.nullable(),
  });

/** Row shape used by the pending disposal requests table and mobile list. */
export const disposalPendingTableRowSchema = disposalWorkflowResponseSchema
  .pick({
    id: true,
    disposalCreated: true,
    status: true,
    assets: true,
    description: true,
  })
  .extend(disposalPendingSchema.shape);

export type DisposalFileMetadata = z.infer<typeof disposalFileMetadataSchema>;
export type DisposalAssetFormValues = z.infer<typeof disposalAssetFormSchema>;
export type DisposalAssetResponse = z.infer<typeof disposalAssetResponseSchema>;
export type DisposalRequestFormValues = z.infer<typeof disposalRequestSchema>;
export type DisposalRequestPayload = z.infer<
  typeof disposalRequestPayloadSchema
>;
export type DisposalApprovalFormValues = z.infer<typeof disposalApprovalSchema>;
export type DisposalCompletionFormValues = z.infer<
  typeof disposalCompletionSchema
>;
export type DisposalCompletionPayload = z.infer<
  typeof disposalCompletionPayloadSchema
>;
export type DisposalCancellationFormValues = z.infer<
  typeof disposalCancellationSchema
>;
export type DisposalWorkflowResponse = z.infer<
  typeof disposalWorkflowResponseSchema
>;
export type DisposalPendingTableRow = z.infer<
  typeof disposalPendingTableRowSchema
>;
