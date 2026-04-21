// import CardItem from "./CardItem";
import { useMemo } from "react";
import {
  // assetsCardData,
  jobsPendingCardData,
  jobsApprovedCardData,
  actionCardData,
  jobsOverdueCardData,
} from "@/data/dashboardCardData";
import type {
  JobAPIResponse,
  // AssetAPIResponse,
  ActionAPIResponse,
} from "@/schemas";
import { useGetAll } from "@/utils/api";
import {
  getApprovedJobsCardValues,
  getOverdueJobsCardValues,
  getPendingJobsCardValues,
} from "@/utils/getJobsCardValues";
// import { getAssetCardValues } from "@/utils/getAssetCardValues";
import { getActionCardValues } from "@/utils/getActionCardValues";
import { MetricCardItem } from "./MetricsCardItem";
import type { JobApprovedAPIResponse } from "@/schemas/jobSchemas";
// import { Spinner } from "../ui/spinner";

const Cards = () => {
  // % ===================================================================================
  // % Fetch Card Data
  // % ===================================================================================

  // $ Pending Requests Data
  const { data: pendingJobs = [], isPending } = useGetAll<JobAPIResponse[]>({
    resourcePath: "jobs/requests",
    queryKey: ["jobs", "pending"],
    params: {
      status: "pending",
    },
  });

  // $ Approved Requests Data
  const { data: approvedJobs = [] } = useGetAll<JobApprovedAPIResponse[]>({
    resourcePath: "jobs/requests",
    queryKey: ["jobs", "in-progress"],
    params: {
      status: "in progress",
    },
  });

  // $ Assets Data
  // const { data: assets = [] } = useGetAll<AssetAPIResponse[]>({
  //   resourcePath: "assets-list",
  //   queryKey: ["assetRequests"],
  // });

  // $ Actions Data
  const { data: actions = [] } = useGetAll<ActionAPIResponse[]>({
    resourcePath: "jobs/completed",
    queryKey: ["actions"],
  });

  // $ Get the job metrics from the data returned from the database
  const pendingJobMetrics = useMemo(
    () => getPendingJobsCardValues(pendingJobs),
    [pendingJobs],
  );

  // const pendingJobMetrics = pendingJobs.length;

  // $ Get the job metrics from the data returned from the database
  const approvedJobMetrics = useMemo(
    () => getApprovedJobsCardValues(approvedJobs),
    [approvedJobs],
  );

  // $ Get the overdue job metrics from the data returned from the database
  const overdueJobMetrics = useMemo(
    () => getOverdueJobsCardValues(approvedJobs),
    [approvedJobs],
  );

  // $ Get the asset metrics from the data returned from the database
  // const assetsMetrics = useMemo(() => getAssetCardValues(assets), [assets]);

  // $ Get the action metrics from the data returned from the database
  const actionMetrics = useMemo(() => getActionCardValues(actions), [actions]);

  return (
    <div
      className="
        grid w-full
        grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4"
    >
      <>
        <MetricCardItem
          cardData={jobsPendingCardData}
          metrics={pendingJobMetrics}
          isPending={isPending}
        />
        <MetricCardItem
          cardData={jobsApprovedCardData}
          metrics={approvedJobMetrics}
          isPending={isPending}
        />
        <MetricCardItem
          cardData={actionCardData}
          metrics={actionMetrics}
          isPending={isPending}
        />
        <MetricCardItem
          cardData={jobsOverdueCardData}
          metrics={overdueJobMetrics}
          isPending={isPending}
        />
      </>
    </div>
  );
};

export default Cards;
