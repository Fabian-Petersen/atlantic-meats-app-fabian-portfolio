// $ This page renders the full details of a maintenance request information with the supporting pictures

import { useParams } from "react-router-dom";
import { PageLoadingSpinner } from "@/components/features/PageLoadingSpinner";
import { useById } from "../utils/api";
import { type JobAPIResponse } from "@/schemas";
import { AssetSingleItemImages } from "@/components/assets/AssetSingleItemImages";
import MaintenanceSingleItemInfo from "@/components/jobs/JobSingleItemInfo";

export type PresignedUrlResponse = {
  key: string;
  filename?: string;
  url: string;
};

// type WithImages = {
//   imageUrls?: PresignedUrlResponse[];
// };

const JobItemPage = () => {
  const { id } = useParams<{ id: string }>();

  const MAINTENANCE_REQUESTS_KEY = ["maintenanceRequests"];

  const { data: item, isPending } = useById<JobAPIResponse>({
    id: id || "",
    queryKey: MAINTENANCE_REQUESTS_KEY,
    resourcePath: "maintenance-request",
  });

  if (!id || !item) {
    return <PageLoadingSpinner />;
  }

  if (isPending) {
    return <PageLoadingSpinner />;
  }

  const images = item.images;

  // console.log("Item Data with Presigned URLS:", item);
  return (
    <div className="p-4">
      <div className="h-auto bg-white dark:bg-[#1d2739] border-gray-700/70 rounded-md grid md:grid-cols-2 gap-2 text-gray-100 dark:text-gray-800">
        <div>
          <AssetSingleItemImages images={images ?? []} />
        </div>
        <div>
          <MaintenanceSingleItemInfo />
        </div>
      </div>
    </div>
  );
};

export default JobItemPage;
