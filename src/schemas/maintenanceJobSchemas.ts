import * as z from "zod";

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
  images: z.array(z.instanceof(File)).default([]).optional(),
});

// $ Schema for the API Response from the database when fetching the maintenance requests
export const jobResponseSchema = jobRequestSchema.extend({
  id: z.string(),
  createdAt: z.string(),
  jobcardNumber: z.string(),
  status: z.string(),
});

// $ Schema for the Maintenance Table Menu
export const maintenanceTableRowSchema = jobRequestSchema.extend({
  id: z.string(),
  createdAt: z.string(),
  jobcardNumber: z.string(),
  status: z.string(),
});

// $ Type for sending the images to the backend
export type CreateJobPayload = Omit<JobRequestFormValues, "images"> & {
  images: {
    filename: string;
    content_type: string;
  }[];
};

export type JobRequestFormValues = z.infer<typeof jobRequestSchema>;
export type JobAPIResponse = z.infer<typeof jobResponseSchema>;
export type MaintenanceTableRow = z.infer<typeof maintenanceTableRowSchema>;
