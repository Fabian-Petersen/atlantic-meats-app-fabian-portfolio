import * as z from "zod";

export const technicianOptionSchema = z.object({
  label: z.string(),
  value: z.string(),
  name: z.string(),
  sub: z.string(),
});

export type TechnicianOption = z.infer<typeof technicianOptionSchema>;
