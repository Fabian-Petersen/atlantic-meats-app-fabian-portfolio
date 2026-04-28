// $ This function calculates the variance for the requests of last month vs requests this month and return the value from the input data (jobs from API)
import type { JobAPIResponse } from "@/schemas";

export const getMonthlyPendingRequestsChange = (jobs: JobAPIResponse[]) => {
  const now = new Date();

  const pendingRequests = jobs.filter(
    (item) => item.status === "pending" || item.status === "in progress",
  );

  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const thisMonthPendingRequests = pendingRequests.filter((item) => {
    const createdAt = new Date(item.jobCreated);
    return createdAt >= startOfThisMonth && createdAt < startOfNextMonth;
  }).length;

  const lastMonthPendingRequests = pendingRequests.filter((item) => {
    const createdAt = new Date(item.jobCreated);
    return createdAt >= startOfLastMonth && createdAt < startOfThisMonth;
  }).length;

  const difference = thisMonthPendingRequests - lastMonthPendingRequests;

  const totalPendingRequestsChange =
    lastMonthPendingRequests === 0
      ? thisMonthPendingRequests > 0
        ? 100
        : 0
      : (difference / lastMonthPendingRequests) * 100;

  const roundedPendingRequestsChange =
    Math.round(totalPendingRequestsChange * 10) / 10;

  return {
    thisMonthPendingRequests,
    lastMonthPendingRequests,
    difference,
    totalPendingRequestsChange: roundedPendingRequestsChange,
  };
};
