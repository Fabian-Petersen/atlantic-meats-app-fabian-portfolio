import * as z from "zod";

export const commentRequestSchema = z.object({
  comment: z.string().min(1, { message: "A message is required" }),
});

// $ Schema for the API Response from the database when fetching the assets
export const commentResponseSchema = commentRequestSchema.extend({
  id: z.string(),
  request_id: z.string(),
  createdAt: z.string(),
  comment_sub: z.string(),
  comment_by: z.string(),
});

// $ Schema adding the form message and the rowId.
export const commentPayloadSchema = commentRequestSchema.extend({
  request_id: z.string(),
});

// # schema to the API
export type CommentRequestFormValues = z.infer<typeof commentRequestSchema>;

export type CommentPayload = z.infer<typeof commentPayloadSchema>;

// # schema from the API
export type CommentAPIResponse = z.infer<typeof commentResponseSchema>;
