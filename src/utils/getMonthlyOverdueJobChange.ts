// $ This function calculates the variance for the approved requests of last month vs requests this month and return the value from the input data (jobs from API)
import type { JobApprovedAPIResponse } from "@/schemas/jobSchemas";

export const getMonthlyOverdueJobChange = (jobs: JobApprovedAPIResponse[]) => {
  const now = new Date();

  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  // Helper: overdue logic based on targetDate
  const isOverdue = (job: JobApprovedAPIResponse) => {
    if (!job.targetDate) return false;

    const targetDate = new Date(job.targetDate);

    // Optional: exclude completed jobs
    // if (job.status === "completed") return false;

    return targetDate < now;
  };

  // THIS month overdue (based on targetDate falling in this month)
  const thisMonthOverdue = jobs.filter((job) => {
    if (!job.targetDate) return false;

    const targetDate = new Date(job.targetDate);

    return (
      isOverdue(job) &&
      targetDate >= startOfThisMonth &&
      targetDate < startOfNextMonth
    );
  }).length;

  // LAST month overdue
  const lastMonthOverdue = jobs.filter((job) => {
    if (!job.targetDate) return false;

    const targetDate = new Date(job.targetDate);

    return (
      isOverdue(job) &&
      targetDate >= startOfLastMonth &&
      targetDate < startOfThisMonth
    );
  }).length;

  const difference = thisMonthOverdue - lastMonthOverdue;

  const percentageChange =
    lastMonthOverdue === 0
      ? thisMonthOverdue > 0
        ? 100
        : 0
      : (difference / lastMonthOverdue) * 100;

  // Optional: total overdue right now
  const totalOverdue = jobs.filter(isOverdue).length;

  return {
    thisMonthOverdue,
    lastMonthOverdue,
    totalOverdue,
    difference,
    percentageChange,
  };
};
