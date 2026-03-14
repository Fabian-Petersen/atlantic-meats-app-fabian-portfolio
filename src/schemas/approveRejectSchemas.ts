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
export const approveRequestSchema = z.object({
  assign_to_group: z
    .string()
    .min(1, { message: "Select either contractor or technician" }),
  targetDate: z
    .string()
    .min(1, { message: "Please select a reasonable completion date" }),
  assign_to_sub: z
    .string()
    .min(1, { message: "Please assign work to a technician" }), // The label will display the name and the value the sub
});

export const approveRequestPayloadSchema = approveRequestSchema.extend({
  status: z.string(),
  selectedRowId: z.string(),
  assign_to_name: z.string(),
});

export type ApproveRequestFormValues = z.infer<typeof approveRequestSchema>;
export type ApproveRequestPayload = z.infer<typeof approveRequestPayloadSchema>;

// $ Schema for the API Response from the database when fetching the maintenance requests
export const jobRejectedApiResponseSchema = jobRejectRequestSchema.extend({
  id: z.string(),
  status: z.string(),
  reject_message: z.string(),
  rejected_at: z.string(),
  rejected_by: z.string(),
});
