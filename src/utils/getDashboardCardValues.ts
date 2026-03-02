import type { JobAPIResponse } from "@/schemas";

type MetricKey = "totalRequests" | "openRequests" | "completedRequests";

type DashboardMetrics = Record<
  MetricKey,
  {
    value: number;
    valueChange: number;
  }
>;

export const getDashboardCardValues = (
  jobs: JobAPIResponse[],
): DashboardMetrics => {
  const totalRequests = jobs.length;

  const openRequests = jobs.filter(
    (item) => item.status === "Pending" || item.status === "In Progress",
  ).length;

  const completedRequests = jobs.filter(
    (item) => item.status === "Complete",
  ).length;

  return {
    totalRequests: {
      value: totalRequests,
      valueChange: 0,
    },
    openRequests: {
      value: openRequests,
      valueChange: 0,
    },
    completedRequests: {
      value: completedRequests,
      valueChange: 0,
    },
  };
};
