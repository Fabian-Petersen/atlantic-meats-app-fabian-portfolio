import * as z from "zod";

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
  images: z.array(z.instanceof(File)).default([]),
});

// $ Schema for the API Response from the database when fetching the assets
export const assetResponseSchema = assetRequestSchema.extend({
  id: z.string(),
  createdAt: z.string(),
});

// $ Schema for the Asset Table Menu
export const assetTableRowSchema = assetRequestSchema.extend({
  id: z.string(),
  createdAt: z.string(),
});

// $ Type for sending the asset images to the backend excluding the images (the images is not included with the initial request)
export type CreateAssetPayload = Omit<AssetRequestFormValues, "images"> & {
  images: {
    filename: string;
    content_type: string;
  }[];
};

export type AssetRequestFormValues = z.infer<typeof assetRequestSchema>;
export type AssetTableRow = z.infer<typeof assetTableRowSchema>;

// # type use to fetch all the assets e.g. in the MaintenanceRequestForm component
export type AssetAPIResponse = z.infer<typeof assetResponseSchema>;
