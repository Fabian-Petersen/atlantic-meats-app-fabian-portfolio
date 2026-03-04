// import CardItem from "./CardItem";
import { useMemo } from "react";
import {
  assetsCardData,
  jobsCardData,
  actionCardData,
} from "@/data/dashboardCardData";
import type {
  JobAPIResponse,
  AssetAPIResponse,
  ActionAPIResponse,
} from "@/schemas";
import { useGetAll } from "@/utils/api";
import { getJobsCardValues } from "@/utils/getJobsCardValues";
import { getAssetCardValues } from "@/utils/getAssetCardValues";
import { getActionCardValues } from "@/utils/getActionCardValues";
import { MetricCardItem } from "./MetricsCardItem";

const Cards = () => {
  // $ Jobs Data
  const { data: requests = [], isPending } = useGetAll<JobAPIResponse[]>(
    "maintenance-requests-list",
    ["maintenanceRequests"],
  );

  // const location = requests[0].location;
  // $ Assets Data
  const { data: assets = [] } = useGetAll<AssetAPIResponse[]>("assets-list", [
    "assetRequests",
  ]);

  // $ Actions Data
  const { data: actions = [] } = useGetAll<ActionAPIResponse[]>(
    "maintenance-actions-list",
    ["actionRequests"],
  );

  // $ Get the job metrics from the data returned from the database
  const jobMetrics = useMemo(() => getJobsCardValues(requests), [requests]);

  // $ Get the asset metrics from the data returned from the database
  const assetsMetrics = useMemo(() => getAssetCardValues(assets), [assets]);

  // $ Get the action metrics from the data returned from the database
  const actionMetrics = useMemo(() => getActionCardValues(actions), [actions]);

  if (isPending) return <div>Loading...</div>;

  return (
    <div
      className="
        grid w-full
        grid-cols-2 lg:grid-cols-4 gap-2"
    >
      <MetricCardItem cardData={jobsCardData} metrics={jobMetrics} />
      <MetricCardItem cardData={actionCardData} metrics={actionMetrics} />
      <MetricCardItem cardData={assetsCardData} metrics={assetsMetrics} />
    </div>
  );
};

export default Cards;
