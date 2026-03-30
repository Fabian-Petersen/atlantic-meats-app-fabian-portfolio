// $ This function calculates the variance for the approved requests of last month vs requests this month and return the value from the input data (jobs from API)
import type { JobApprovedAPIResponse } from "@/schemas/jobSchemas";

export const getMonthlyApprovedJobChange = (jobs: JobApprovedAPIResponse[]) => {
  const now = new Date();

  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const thisMonthJobs = jobs.filter((item) => {
    if (item.approved_at) {
      const createdAt = new Date(item.approved_at);
      return createdAt >= startOfThisMonth && createdAt < startOfNextMonth;
    }
  }).length;

  const lastMonthJobs = jobs.filter((item) => {
    if (item.approved_at) {
      const createdAt = new Date(item.approved_at);
      return createdAt >= startOfLastMonth && createdAt < startOfThisMonth;
    }
  }).length;

  const difference = thisMonthJobs - lastMonthJobs;

  const totalRequestsChange =
    lastMonthJobs === 0
      ? thisMonthJobs > 0
        ? 100
        : 0
      : (difference / lastMonthJobs) * 100;

  return {
    thisMonthJobs,
    lastMonthJobs,
    difference,
    totalRequestsChange,
  };
};
