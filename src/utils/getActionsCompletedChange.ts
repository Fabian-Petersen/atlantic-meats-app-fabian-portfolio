// $ This function calculates the variance for the requests completed of last month vs requests complted this month and return the value from the input data (jobs from API)
import type { ActionAPIResponse } from "@/schemas";

export const getActionsCompletedChange = (actions: ActionAPIResponse[]) => {
  const now = new Date();

  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const thisMonthCompletedRequests = actions.filter((item) => {
    const createdAt = new Date(item.actionCreated);

    return createdAt >= startOfThisMonth && createdAt < startOfNextMonth;
  }).length;

  // console.log("this-month-completed:", thisMonthCompletedRequests);

  const lastMonthCompletedRequests = actions.filter((item) => {
    const completed_at = new Date(item.actionCreated);
    return completed_at >= startOfLastMonth && completed_at < startOfThisMonth;
  }).length;

  // console.log("last-month-completed:", lastMonthCompletedRequests);
  const difference = thisMonthCompletedRequests - lastMonthCompletedRequests;

  const totalCompletedChange =
    lastMonthCompletedRequests === 0
      ? thisMonthCompletedRequests > 0
        ? 100
        : 0
      : (difference / lastMonthCompletedRequests) * 100;

  const roundedCompletedRequestsChange =
    Math.round(totalCompletedChange * 10) / 10;

  return {
    thisMonthCompletedRequests,
    lastMonthCompletedRequests,
    difference,
    totalCompletedChange: roundedCompletedRequestsChange,
  };
};
