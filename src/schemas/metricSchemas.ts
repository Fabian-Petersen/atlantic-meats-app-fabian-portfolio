import * as z from "zod";

export const metricValuesSchema = z.object({
  value: z.number(),
  valueChange: z.number().optional(),
});

export type MetricValues = z.infer<typeof metricValuesSchema>;
