import * as z from "zod";

const ASSIGNABLE_GROUPS = ["technician", "contractor", "other"] as const;

const isValidDateInput = (value: string) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) return false;

  const [, year, month, day] = match.map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
};

const getLocalDateInputValue = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

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
    .trim()
    .min(1, { message: "Please select a group" })
    .refine(
      (value) =>
        !value || ASSIGNABLE_GROUPS.includes(value as (typeof ASSIGNABLE_GROUPS)[number]),
      { message: "Please select a valid group" },
    ),
  targetDate: z
    .string()
    .trim()
    .min(1, { message: "Please select a target date" })
    .refine((value) => !value || isValidDateInput(value), {
      message: "Please select a valid target date",
    })
    .refine(
      (value) =>
        !value || !isValidDateInput(value) || value >= getLocalDateInputValue(),
      { message: "Target date cannot be in the past" },
    ),
  assign_to_sub: z
    .string()
    .trim()
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
