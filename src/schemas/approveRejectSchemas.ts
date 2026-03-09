import * as z from "zod";

// $ Schema to create a reject request
export const jobRejectRequestSchema = z.object({
  reject_message: z
    .string()
    .min(1, { message: "Give a short rejection message" }),
});

export const jobRejectRequestPayloadSchema = jobRejectRequestSchema.extend({
  status: z.string(),
  selectedRowId: z.string(),
});

export type JobRejectRequestFormValues = z.infer<typeof jobRejectRequestSchema>;
export type JobRejectRequestPayload = z.infer<
  typeof jobRejectRequestPayloadSchema
>;

// $ Schema to create an approve request
export const jobApprovedRequestSchema = z.object({
  status: z.string(),
  selectedRowId: z.string(),
});

export type JobApprovedRequestFormValues = z.infer<
  typeof jobApprovedRequestSchema
>;

// $ Schema for the API Response from the database when fetching the maintenance requests
export const jobRejectedApiResponseSchema = jobRejectRequestSchema.extend({
  id: z.string(),
  status: z.string(),
  reject_message: z.string(),
  rejected_at: z.string(),
  rejected_by: z.string(),
});
