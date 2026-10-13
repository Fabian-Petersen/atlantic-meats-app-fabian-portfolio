import { useState } from "react";

import JobsChart from "../charts/JobsChart";
import ChartHeading from "../ChartHeading";
import { JobRequestsChartSkeleton } from "../charts/JobRequestsChartSkeleton";
import { HeadingSkeleton } from "../charts/HeadingSkeleton";

import { cn } from "@/lib/utils";
import { sharedStyles } from "@/styles/shared";

import type { StoreJobMetrics } from "@/schemas/dashboardSchema";

type JobStatus = "pending" | "in progress" | "complete" | "cancelled";

type Props = {
  data: StoreJobMetrics;
  isPending: boolean;
  userGroup?: string;
};

function MaintenanceJobs({ data, isPending, userGroup }: Props) {
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedStatus, setSelectedStatus] =
    useState<JobStatus>("complete");

  const chartData = data[selectedStatus] ?? {};
  const years = Object.keys(chartData).sort();
  const latestYear = years[years.length - 1] ?? "";
  const resolvedYear =
    selectedYear && chartData[selectedYear] ? selectedYear : latestYear;

  const statusLabel =
    selectedStatus === "in progress"
      ? "In Progress"
      : selectedStatus === "complete"
        ? "Completed"
        : selectedStatus === "cancelled"
          ? "Cancelled"
          : "Pending";

  const isTechnician = userGroup?.toLowerCase() === "maintenance";
  const chartTitle = isTechnician
    ? `My ${statusLabel} Jobs YTD`
    : "Maintenance Jobs YTD";

  const hasChartData =
    !!resolvedYear &&
    (chartData[resolvedYear]?.some((item) => Number(item.value) > 0) ?? false);

  const handleStatusChange = (status: JobStatus) => {
    setSelectedStatus(status);
    setSelectedYear("");
  };

  return (
    <div
      className={cn(
        sharedStyles.chartParent,
        "xl:col-span-3 min-h-0 flex flex-col gap-4",
        "text-gray-600 dark:text-gray-100",
      )}
    >
      <div className="flex flex-col gap-4 h-full">
        <div className="flex items-center justify-between">
          <ChartHeading
            title={isPending ? "Maintenance Jobs YTD" : chartTitle}
            className={cn(sharedStyles.chartHeading)}
          />

          <div className="flex items-center gap-2">
            {isPending ? (
              <HeadingSkeleton className="w-16" />
            ) : (
              <select
                value={selectedStatus}
                onChange={(event) =>
                  handleStatusChange(event.target.value as JobStatus)
                }
                aria-label="job status selector"
                className={cn(sharedStyles.chartSelectBtn)}
              >
                <option value="pending">Pending</option>
                <option value="in progress">In Progress</option>
                <option value="complete">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            )}

            {isPending ? (
              <HeadingSkeleton className="w-12" />
            ) : (
              <select
                value={resolvedYear}
                onChange={(event) => setSelectedYear(event.target.value)}
                aria-label="year selector"
                className={cn(sharedStyles.chartSelectBtn)}
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        <div className="flex-1 min-h-0">
          {isPending ? (
            <JobRequestsChartSkeleton />
          ) : !hasChartData ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  No {statusLabel} Jobs yet
                </p>
              </div>
            </div>
          ) : (
            <JobsChart data={chartData} selectedYear={resolvedYear} />
          )}
        </div>
      </div>
    </div>
  );
}

export default MaintenanceJobs;
