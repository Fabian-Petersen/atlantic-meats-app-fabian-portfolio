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
  requestId: z.string(),
  assetID: z.string(),
  status: z.enum(["pending", "in progress", "complete"]),
  jobCreated: z.string(), // ISO date
  targetDate: z.string().optional(),
  completedAt: z.string().optional(),
  location: z.string(),
  description: z.string().optional(),
  requestedBy: z.string().optional(),
  technician: z.string().optional(),
});

export type AssetHistoryItem = z.infer<typeof assetHistoryItemSchema>;

export const assetHistoryResponseSchema = z.object({
  assetID: z.string(),
  metrics: {
    completedRequests: metricValuesSchema,
    inProgressRequests: metricValuesSchema,
    pendingRequests: metricValuesSchema,
  },
  history: z.array(assetHistoryItemSchema),
});

export type AssetHistoryResponse = z.infer<typeof assetHistoryResponseSchema>;

export type AssetTableRow = z.infer<typeof assetTableRowSchema>;

export type PresignedURL = z.infer<typeof presignedURLSchema>;

// # type use to fetch all the assets e.g. data from database with presignedURLS

// type WithImages = {
//   presignedURLs?: PresignedUrlResponse[];
// };
