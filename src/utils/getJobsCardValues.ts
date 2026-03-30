// $ This function that takes the array of (pending jobs) data and return the amount of jobs in the array and how the value changed from the previous month.
// $ The value change is a function that returns the % change for the item passed.

import type { JobAPIResponse } from "@/schemas";
import { getMonthlyApprovedJobChange } from "./getMonthlyApprovedJobChange";
import { getMonthlyPendingRequestsChange } from "./getMonthlyPendingRequestsChange";
import type { JobApprovedAPIResponse } from "@/schemas/jobSchemas";
import type {
  ApprovedJobMetrics,
  OverdueJobMetrics,
  PendingJobMetrics,
} from "@/schemas/dashboardSchema";
import { getMonthlyOverdueJobChange } from "./getMonthlyOverdueJobChange";

export const getPendingJobsCardValues = (
  pending: JobAPIResponse[],
): PendingJobMetrics => {
  const totalRequests = pending.length;

  const { totalPendingRequestsChange } =
    getMonthlyPendingRequestsChange(pending);

  return {
    pendingRequests: {
      value: totalRequests,
      valueChange: totalPendingRequestsChange,
    },
  };
};

export const getApprovedJobsCardValues = (
  approved: JobApprovedAPIResponse[],
): ApprovedJobMetrics => {
  const totalApprovedRequests = approved.length;

  const { totalRequestsChange } = getMonthlyApprovedJobChange(approved);

  return {
    approvedRequests: {
      value: totalApprovedRequests,
      valueChange: totalRequestsChange,
    },
  };
};

export const getOverdueJobsCardValues = (
  overdue: JobApprovedAPIResponse[],
): OverdueJobMetrics => {
  const totalOverdueRequests = overdue.length;

  const { percentageChange } = getMonthlyOverdueJobChange(overdue);

  return {
    overdueRequests: {
      value: totalOverdueRequests,
      valueChange: percentageChange,
    },
  };
};
