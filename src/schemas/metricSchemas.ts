import * as z from "zod";

export const metricValuesSchema = z.object({
  value: z.number(),
  valueChange: z.number().optional(),
});

export const cardMetricsSchema = z.object({
  pendingRequests: metricValuesSchema,
  approvedRequests: metricValuesSchema,
  overdueRequests: metricValuesSchema,
  totalCompleted: metricValuesSchema,
});

export type CardMetrics = z.infer<typeof cardMetricsSchema>;
export type MetricValues = z.infer<typeof metricValuesSchema>;
