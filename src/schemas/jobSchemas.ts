import * as z from "zod";
import { presignedURLSchema } from "./assetSchemas"; //manage the schema in assets since it is the same

// $ Schema to create a maintenance request
export const jobRequestSchema = z.object({
  location: z.string().min(1, { message: "Please select a location" }),
  type: z.string().min(1, { message: "Please select maintenance type" }),
  priority: z.string().min(1, { message: "Please select a priority" }),
  equipment: z.string().min(1, { message: "Please select equipment" }),
  impact: z.string().min(1, { message: "Please select impact" }),
  jobComments: z.string().optional().default(""),
  description: z
    .string()
    .min(1, { message: "Give a brief description of the works required" }),
  area: z.string().optional(),
  assetID: z.string().optional(),
  // NEW uploads only
  images: z.array(z.instanceof(File)).default([]).optional(),
});
export type JobRequestFormValues = z.infer<typeof jobRequestSchema>;

// $ Schema for the API Response from the database when fetching the maintenance requests
export const jobApiResponseSchema = jobRequestSchema
  .omit({
    images: true,
  })
  .extend({
    id: z.string(),
    jobCreated: z.string(),
    jobcardNumber: z.string(),
    status: z.string(),
    requested_by: z.string(),
    images: z.array(presignedURLSchema).default([]), // existing images (urls/keys)
  });

export type JobAPIResponse = z.infer<typeof jobApiResponseSchema>;

// $ Type for sending the images to the backend
export type CreateJobPayload = Omit<JobRequestFormValues, "images"> & {
  images: {
    filename: string;
    content_type: string;
  }[];
};

// $ Schema for the Maintenance Table Menu
export const jobTableRowSchema = jobApiResponseSchema
  .omit({
    images: true,
  })
  .extend({
    id: z.string(),
    createdAt: z.string(),
    jobcardNumber: z.string(),
    status: z.string(),
  });
export type MaintenanceTableRow = z.infer<typeof jobTableRowSchema>;
