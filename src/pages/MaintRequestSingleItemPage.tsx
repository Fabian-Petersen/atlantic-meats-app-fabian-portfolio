// $ This page renders the full details of a maintenance request information with the supporting pictures

import { useParams } from "react-router-dom";
import { PageLoadingSpinner } from "@/components/features/PageLoadingSpinner";
import { useById } from "../utils/api";
import { type CreateJobFormValues } from "@/schemas";
import { AssetSingleItemImages } from "@/components/assets/AssetSingleItemImages";
import MaintenanceSingleItemInfo from "@/components/maintenance/MaintenanceSingleItemInfo";

export type PresignedUrlResponse = {
  key: string;
  filename?: string;
  url: string;
};

type WithImages = {
  imageUrls?: PresignedUrlResponse[];
};

const MaintRequestSingleItemPage = () => {
  const { id } = useParams<{ id: string }>();

  const MAINTENANCE_REQUESTS_KEY = ["maintenanceRequests"];

  const { data: item, isPending } = useById<CreateJobFormValues & WithImages>({
    id: id || "",
    queryKey: MAINTENANCE_REQUESTS_KEY,
    endpoint: "/maintenance-request",
  });

  if (!id || !item) {
    return <PageLoadingSpinner />;
  }

  if (isPending) {
    return <PageLoadingSpinner />;
  }

  const imageUrls = item.imageUrls;

  // console.log("Item Data with Presigned URLS:", item);
  return (
    <div className="p-4">
      <div className="h-auto bg-white dark:bg-[#1d2739] border-gray-700/70 rounded-md grid md:grid-cols-2 gap-2 text-gray-100 dark:text-gray-800">
        <div>
          <AssetSingleItemImages imageUrls={imageUrls ?? []} />
        </div>
        <div>
          <MaintenanceSingleItemInfo item={item} />
        </div>
      </div>
    </div>
  );
};

export default MaintRequestSingleItemPage;
