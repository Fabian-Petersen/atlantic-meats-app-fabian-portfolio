// $ This page renders the full details of an approved request with information and pictures
import { useState } from "react";
import { PageLoadingSpinner } from "@/components/features/PageLoadingSpinner";
import { useById } from "../../utils/api";
import { type JobApprovedAPIResponse } from "@/schemas/jobSchemas";
import { ImageGallery } from "@/components/features/ImageGallery";
import JobApprovedItemInfo from "@/components/jobs/JobApprovedItemInfo";
import useGlobalContext from "@/context/useGlobalContext";
import BackButton from "@/components/features/BackButton";
import { cn } from "@/lib/utils";

// % Mobile
import MobileInProgressPage from "@/components/mobile/jobs/MobileInProgressPage";

const JobInProgressItemPage = () => {
  const { selectedRowId } = useGlobalContext();

  const { data: item, isPending } = useById<JobApprovedAPIResponse>({
    id: selectedRowId ?? "",
    queryKey: ["jobs", "in-progress"],
    resourcePath: "api/jobs",
    params: { status: "in progress" },
  });

  const [selectedAssetIndex, setSelectedAssetIndex] = useState(0);
  const [prevRowId, setPrevRowId] = useState(selectedRowId);
  if (selectedRowId !== prevRowId) {
    setPrevRowId(selectedRowId);
    setSelectedAssetIndex(0);
  }

  if (!selectedRowId || !item) {
    return <PageLoadingSpinner />;
  }

  if (isPending) {
    return <PageLoadingSpinner />;
  }

  const assets = item.assets?.length
    ? item.assets
    : [
        {
          equipment: item.equipment,
          assetID: item.assetID,
          area: item.area,
          assetIssueReason: item.assetIssueReason,
          assetIssueDetails: item.assetIssueDetails,
          images: item.images ?? [],
        },
      ];
  const selectedAsset = assets[selectedAssetIndex] ?? assets[0];
  const images = selectedAsset?.images ?? [];

  return (
    <div className="flex min-h-[calc(100vh-var(--sm-navbarHeight))] flex-col gap-4 px-1 py-2 md:h-[calc(100vh-var(--lg-navbarHeight))] md:py-8">
      <BackButton to="/jobs/in-progress" parentStyles="hidden md:flex" />
      <div
        className={cn(
          "hidden min-h-0 flex-1 gap-2 rounded-md border-gray-700/70 bg-(--bg-primary-light) text-gray-100 md:grid md:grid-cols-2 dark:text-gray-800",
          "dark:bg-(--bg-secondary_dark)",
        )}
      >
        <div className="flex min-h-0 flex-col gap-2">
          <ImageGallery
            key={`${selectedAsset?.assetID ?? "asset"}-${selectedAssetIndex}`}
            images={images}
          />
        </div>
        <div className="min-h-0 overflow-y-auto custom-scrollbar">
          <JobApprovedItemInfo
            item={item}
            selectedAssetIndex={selectedAssetIndex}
            onSelectAsset={setSelectedAssetIndex}
          />
        </div>
      </div>
      <div className="md:hidden">
        <MobileInProgressPage
          item={item}
          selectedAssetIndex={selectedAssetIndex}
          onSelectAsset={setSelectedAssetIndex}
        />
      </div>
    </div>
  );
};

export default JobInProgressItemPage;
