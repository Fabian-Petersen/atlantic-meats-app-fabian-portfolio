import type { JobAPIResponse, JobMetrics } from "@/schemas";
import { getMonthlyJobChange } from "./getMonthlyJobChange";
import { getMonthlyPendingRequests } from "./getMonthlyPendingRequestsChange";

export const getJobsCardValues = (jobs: JobAPIResponse[]): JobMetrics => {
  const totalRequests = jobs.length;

  const openRequests = jobs.filter(
    (item) => item.status === "Pending" || item.status === "In Progress",
  ).length;

  const { totalRequestsChange } = getMonthlyJobChange(jobs);
  const { totalPendingRequestsChange } = getMonthlyPendingRequests(jobs);

  return {
    totalRequests: {
      value: totalRequests,
      valueChange: totalRequestsChange,
    },
    openRequests: {
      value: openRequests,
      valueChange: totalPendingRequestsChange,
    },
  };
};
