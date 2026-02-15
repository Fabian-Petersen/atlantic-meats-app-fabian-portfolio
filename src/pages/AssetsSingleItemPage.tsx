// $ This page renders the full details of a maintenance request information with the supporting pictures
import { useParams } from "react-router-dom";
// import { useMaintenanceRequestById } from "../utils/maintenanceRequests";
import { PageLoadingSpinner } from "@/components/features/PageLoadingSpinner";
import { useById } from "@/utils/api";
import { AssetSingleItemImages } from "@/components/assets/AssetSingleItemImages";
import AssetSingleItemInfo from "@/components/assets/AssetSingleItemInfo";
import type { AssetRequestFormValues } from "@/schemas";

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

  const { data: item, isPending } = useById<
    AssetRequestFormValues & WithImages
  >({
    id: id || "",
    queryKey: ASSETS_KEY,
    resourcePath: "asset",
  });

  if (!id || !item) {
    return <PageLoadingSpinner />;
  }

  if (isPending) {
    return <PageLoadingSpinner />;
  }

  const imageUrls = item.imageUrls;

  return (
    <div className="p-2">
      <div className="min-h-(var(--minheight-page)) bg-white dark:bg-[#1d2739] border-gray-700/70 rounded-md grid md:grid-cols-2 gap-2 text-gray-100 dark:text-gray-800">
        <div className="order-2 md:order-1">
          <AssetSingleItemImages imageUrls={imageUrls ?? []} />
        </div>
        <div className="order-1 md:order-2">
          <AssetSingleItemInfo item={item} />
        </div>
      </div>
    </div>
  );
};

export default AssetsSingleItemPage;
