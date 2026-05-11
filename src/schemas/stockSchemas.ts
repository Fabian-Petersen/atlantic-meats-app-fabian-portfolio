import * as z from "zod";

/**
 * presignedURLSchema :
 * key: string; // S3 key for the image, used for deletion when a job is deleted or images are updated
 * url: string; // The actual presigned URL to access the image in S3, used for displaying the image in the frontend
 * filename: string; // Original filename of the uploaded image, used for display purposes and when uploading new images to maintain the original filename in S3
 */
export const presignedURLSchema = z.object({
  key: z.string(),
  url: z.string(),
  filename: z.string(),
});
export type PresignedUrls = z.infer<typeof presignedURLSchema>;

// $ Schema to create a maintenance request
export const stockRequestSchema = z.object({
  //   stockCode: z.string().min(1, { message: "Please enter a stock code" }),
  //   stockType: z.string().min(1, { message: "Please select stock type" }),
  description: z.string().min(1, { message: "Please provide a description" }),
  unit: z.string().min(1, "Unit of measure is required"),
  category: z.string().min(1, { message: "Please select category" }),
  subCategory: z.string().min(1, { message: "Please select sub-category" }),
  minQty: z.string().min(1, "Minimum quantity is required"),
  quantity: z
    .number()
    .min(1, { message: "Please enter a quantity" })
    .default(0),
  reorderQty: z.string().optional(),
  images: z.array(z.instanceof(File)).default([]).optional(),
  supplier: z.string().optional().default(""),
  costPerUnit: z.string().optional().default(""),
  notes: z.string().optional().default(""),
});

export type StockRequestFormValues = z.infer<typeof stockRequestSchema>;

// $ Schema for the API Response from the database when fetching the maintenance requests
export const stockRequestAPIResponseSchema = stockRequestSchema
  .omit({
    images: true,
  })
  .extend({
    id: z.string(),
    // jobCreated: z.string(),
    // completed_at: z.string(),
    // jobcardNumber: z.string(),
    // status: z.string(),
    // requested_by: z.string(),
    // images: z.array(presignedURLSchema).default([]), // existing images (urls/keys)
    // // $ These fields are added when a request was rejected
    // reject_message: z.string().optional(),
    // rejected_at: z.string().optional(),
    // rejected_by: z.string().optional(),
  });

export const stockApprovedAPIResponseSchema = stockRequestSchema
  .omit({
    images: true,
  })
  .extend({
    id: z.string(),
    // jobCreated: z.string(),
    // jobcardNumber: z.string(),
    // status: z.string(),
    // targetDate: z.string(),
    // assign_to_group: z.string(),
    // assign_to_name: z.string(),
    // requested_by: z.string().optional(),
    // approved_at: z.string().optional(),
    // approved_by: z.string().optional(),
    images: z.array(presignedURLSchema).default([]),
  });

export type StockAPIResponse = z.infer<typeof stockRequestAPIResponseSchema>;

export type StockApprovedAPIResponse = z.infer<
  typeof stockApprovedAPIResponseSchema
>;

// $ Type for sending the images to the backend
export type CreateStockPayload = Omit<StockRequestFormValues, "images"> & {
  images: {
    filename: string;
    content_type: string;
  }[];
};

// $ Schema for the Maintenance Table Menu
// export const jobTableRowSchema = jobRequestAPIResponseSchema
//   .omit({
//     images: true,
//   })
//   .extend({
//     id: z.string(),
//     createdAt: z.string(),
//     jobcardNumber: z.string(),
//     status: z.string(),
//   });

// export type JobTableRow = z.infer<typeof jobTableRowSchema>;
