// $ This page renders the full details of a maintenance request information with the supporting pictures
import { useParams } from "react-router-dom";
// import { useMaintenanceRequestById } from "../utils/maintenanceRequests";
import { PageLoadingSpinner } from "@/components/features/PageLoadingSpinner";
import { useById } from "@/utils/api";
import { ImageGallery } from "@/components/features/ImageGallery";
import AssetSingleItemInfo from "@/components/assets/AssetSingleItemInfo";
import type { AssetAPIResponse } from "@/schemas";

const ASSETS_KEY = ["assetRequests"];

const AssetsSingleItemPage = () => {
  const { id } = useParams<{ id: string }>();

  //   const { data: item, isLoading } = useMaintenanceRequestById(id || "");
  // id "Testing from mobile: 4e9a8b44-f9e2-4fc0-ad8e-640fd23c7211"

  const { data: item, isPending } = useById<AssetAPIResponse>({
    id: id || "",
    queryKey: ASSETS_KEY,
    resourcePath: "assets-data",
  });

  if (!id || !item) {
    return <PageLoadingSpinner />;
  }

  if (isPending) {
    return <PageLoadingSpinner />;
  }

  const images = item.images;

  return (
    <div className="p-2">
      <div className="min-h-(var(--minheight-page)) bg-white dark:bg-[#1d2739] border-gray-700/70 rounded-md grid md:grid-cols-2 gap-2 text-gray-100 dark:text-gray-800">
        <div className="order-2 md:order-1">
          <ImageGallery images={images ?? []} />
        </div>
        <div className="order-1 md:order-2">
          <AssetSingleItemInfo item={item} />
        </div>
      </div>
    </div>
  );
};

export default AssetsSingleItemPage;
