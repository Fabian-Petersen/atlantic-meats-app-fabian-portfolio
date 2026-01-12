// $ This page renders the full details of a maintenance request information with the supporting pictures
import { useParams } from "react-router-dom";
// import { useMaintenanceRequestById } from "../utils/maintenanceRequests";
import { PageLoadingSpinner } from "@/components/features/PageLoadingSpinner";
import { useById } from "@/utils/maintenanceRequests";
import { AssetSingleItemImages } from "@/components/assets/AssetSingleItemImages";
import AssetSingleItemInfo from "@/components/assets/AssetSingleItemInfo";
import type { AssetFormValues } from "@/schemas";

export type PresignedUrlResponse = {
  key: string;
  filename?: string;
  url: string;
};

export type WithImages = {
  imageUrls?: PresignedUrlResponse[];
};

const ASSETS_KEY = ["assets"];

const AssetsSingleItemPage = () => {
  const { id } = useParams<{ id: string }>();

  //   const { data: item, isLoading } = useMaintenanceRequestById(id || "");
  // id "Testing from mobile: 4e9a8b44-f9e2-4fc0-ad8e-640fd23c7211"

  const { data: item, isPending } = useById<AssetFormValues & WithImages>({
    id: id || "",
    queryKey: ASSETS_KEY,
    endpoint: "/asset",
  });

  if (!id || !item) {
    return <PageLoadingSpinner />;
  }

  if (isPending) {
    return <PageLoadingSpinner />;
  }

  const imageUrls = item.imageUrls;

  return (
    <div className="p-4">
      <div className="h-auto bg-white dark:bg-[#1d2739] border-gray-700/70 rounded-md grid md:grid-cols-2 gap-2 text-gray-100 dark:text-gray-800">
        <div>
          <AssetSingleItemImages imageUrls={imageUrls ?? []} />
        </div>
        <div>
          <AssetSingleItemInfo item={item} />
        </div>
      </div>
    </div>
  );
};

export default AssetsSingleItemPage;
