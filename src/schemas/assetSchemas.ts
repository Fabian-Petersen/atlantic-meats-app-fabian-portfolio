import * as z from "zod";
import { metricValuesSchema } from "@/schemas/dashboardSchema";

// $ Schema to create a new asset
export const assetRequestSchema = z.object({
  business_unit: z.string().min(1, { message: "Business unit required" }),
  area: z.string().min(1, { message: "Area is required" }),
  equipment: z.string().min(1, { message: "Please select a equipment" }),
  assetID: z.string().min(1, {
    message: "Please enter asset id",
  }),
  condition: z.string().min(1, { message: "Please select condition" }),
  location: z.string().min(1, { message: "Please select a location" }),
  serialNumber: z.string().optional(),
  additional_notes: z.string().optional(),

  // NEW uploads only
  images: z.array(z.instanceof(File)).default([]),
});

export type AssetRequestFormValues = z.infer<typeof assetRequestSchema>;

// $ Schema for the PresignedURL's
export const presignedURLSchema = z.object({
  bucket: z.string(),
  filename: z.string(),
  url: z.string(),
  key: z.string(),
  content_type: z.string(),
});

// $ Schema for the API Response from the database when fetching the assets with image urls
export const assetApiResponseSchema = assetRequestSchema
  .omit({ images: true })
  .extend({
    id: z.string(),
    createdAt: z.string(),
    images: z.array(presignedURLSchema).default([]), // existing images (urls/keys)
  })
  .extend({
    // asset verification fields
    verified_by: z.string(),
    last_verified_at: z.string(),
    next_verification_due: z.string(),
    verified_location: z.object({
      longitude: z.number(),
      latitude: z.number(),
    }),
    verify_status: z.enum(["verified", "overdue", "due soon", "not found"]),
  });

export type AssetAPIResponse = z.infer<typeof assetApiResponseSchema>;

// $ Type for sending the asset images to the backend excluding the images (the images is not included with the initial request)
export type CreateAssetPayload = Omit<AssetRequestFormValues, "images"> & {
  images: {
    filename: string;
    content_type: string;
  }[];
};

// $ Schema for the Asset Table Menu
export const assetTableRowSchema = assetRequestSchema
  .omit({
    business_unit: true,
    images: true,
  })
  .extend({
    id: z.string(),
    createdAt: z.string(),
  });

export const assetHistoryItemSchema = z.object({
  // from requests table
  id: z.string(),
  jobCreated: z.string().nullable(),
  description: z.string().nullable(),
  equipment: z.string().nullable(),

  // from actions table
  location: z.string(),
  assetID: z.string(),
  jobcardNumber: z.string().nullable(),
  sundries: z.array(z.unknown()).nullable(),
  total_cost_sundries: z.number().nullable(),
  parts: z.array(z.unknown()).nullable(),
  total_cost_parts: z.number().nullable(),
  contractor: z.string().nullable(),
  total_cost_contractor: z.number().nullable(),
  actioned_by: z.string().nullable(),
  completed_at: z.string().nullable(),
});

export const reliabilitySchema = z.array(
  z.object({
    name: z.enum(["MTBF", "MTTR", "Availability", "Failure Count"]),
    value: z.number(),
  }),
);

// export type Reliability = z.infer<typeof reliabilitySchema>;
export type Reliability = z.infer<typeof reliabilitySchema>[number];

export type AssetHistoryItem = z.infer<typeof assetHistoryItemSchema>;

export const assetHistoryResponseSchema = z.object({
  assetID: z.string(),
  last_completed_job: z.string(),
  metrics: {
    completedRequests: metricValuesSchema,
    inProgressRequests: metricValuesSchema,
    pendingRequests: metricValuesSchema,
    total_cost: metricValuesSchema,
  },
  reliability: reliabilitySchema,
  history: z.array(assetHistoryItemSchema),
  total_cost_by_month: z.record(
    z.string(), // year e.g. "2026"
    z.array(
      z.object({
        name: z.string(), // "Jan", "Feb", etc.
        value: z.number(), // cost
      }),
    ),
  ),
});

// $ Schema for the Asset Verification
export const assetVerificationSchema = z.object({
  assetID: z.string(),
  latitude: z.number(),
  longitude: z.number(),
});

// $ Schema for the Asset Verification History API response
export const assetAPIVerificationHistorySchema = z.object({
  id: z.string(),
  assetID: z.string(),
  verified_by: z.string(),
  verified_at: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  verification_result: z.enum(["verified", "overdue", "due soon", "not found"]),
});

export type AssetAPIVerificationHistory = z.infer<
  typeof assetAPIVerificationHistorySchema
>;

export const assetVerificationResponseSchema = z.object({
  message: z.string(),
});

export type VerifyAssetRequest = z.infer<typeof assetVerificationSchema>;

export type VerifyAssetResponse = z.infer<
  typeof assetVerificationResponseSchema
>;

export type AssetHistoryResponse = z.infer<typeof assetHistoryResponseSchema>;

export type AssetTableRow = z.infer<typeof assetTableRowSchema>;

export type PresignedURL = z.infer<typeof presignedURLSchema>;

// # type use to fetch all the assets e.g. data from database with presignedURLS

// type WithImages = {
//   presignedURLs?: PresignedUrlResponse[];
// };
