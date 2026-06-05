// $ This page renders the full details of a maintenance request information with the supporting pictures
import { useParams } from "react-router-dom";
// import { useMaintenanceRequestById } from "../utils/maintenanceRequests";
import { PageLoadingSpinner } from "@/components/features/PageLoadingSpinner";
import { useById } from "@/utils/api";
import AssetDetails from "@/components/assets/AssetDetails";
import type { AssetAPIResponse } from "@/schemas";
import BackButton from "@/components/features/BackButton";
import MobileAssetDetails from "@/components/mobile/MobileAssetDetails";

const AssetItemPage = () => {
  const { id } = useParams<{ id: string }>();

  //   const { data: item, isLoading } = useMaintenanceRequestById(id || "");
  // id "Testing from mobile: 4e9a8b44-f9e2-4fc0-ad8e-640fd23c7211"

  const { data: item, isPending } = useById<AssetAPIResponse>({
    id: id || "",
    queryKey: ["assets"],
    resourcePath: "api/assets",
  });
  console.log("assets:", item);
  if (!id || !item) {
    return <PageLoadingSpinner />;
  }

  if (isPending) {
    return <PageLoadingSpinner />;
  }

  return (
    <div>
      <div className="hidden md:flex flex-col gap-4 px-4 py-8 min-h-[calc(100vh-var(--sm-navbarHeight))] md:h-[calc(100vh-var(--lg-navbarHeight))] overflow-hidden">
        <BackButton
          to="/assets/list"
          parentStyles="flex-none w-fit"
          label="Assets List"
        />
        <AssetDetails item={item} />
      </div>
      <MobileAssetDetails item={item} />
    </div>
  );
};

export default AssetItemPage;
