// $ This function calculates the variance for the requests of last month vs requests this month and return the value from the input data (jobs from API)
import type { JobAPIResponse } from "@/schemas";

export const getMonthlyJobChange = (jobs: JobAPIResponse[]) => {
  const now = new Date();

  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const thisMonthJobs = jobs.filter((item) => {
    const createdAt = new Date(item.jobCreated);
    return createdAt >= startOfThisMonth && createdAt < startOfNextMonth;
  }).length;

  const lastMonthJobs = jobs.filter((item) => {
    const createdAt = new Date(item.jobCreated);
    return createdAt >= startOfLastMonth && createdAt < startOfThisMonth;
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
