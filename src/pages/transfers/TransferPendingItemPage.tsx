// $ This page renders the full details of a maintenance request for approval with the information and the supporting pictures.

import { useState } from "react";
import { PageLoadingSpinner } from "@/components/features/PageLoadingSpinner";
import { useById } from "../../utils/api";
import { type TransferWorkflowResponse } from "@/schemas";
import { ImageGallery } from "@/components/features/ImageGallery";
import { Success } from "@/components/features/Success";
import useGlobalContext from "@/context/useGlobalContext";
import MobileTransferRequestApproval from "@/components/mobile/transfers/MobileTransfersRequestApproval";
import BackButton from "@/components/features/BackButton";
import { cn } from "@/lib/utils";
import TransferRequestApproval from "@/components/transfers/TransferRequestApproval";
import { sharedStyles } from "@/styles/shared";

export type PresignedUrlResponse = {
  key: string;
  filename?: string;
  url: string;
};

const TransferPendingItemPage = () => {
  const { showSuccess, selectedRowId } = useGlobalContext();

  const { data: item } = useById<TransferWorkflowResponse>({
    id: selectedRowId ?? "",
    queryKey: ["transfers", "pending-approval"],
    resourcePath: `api/transfers`,
    params: {
      status: "pending",
    },
  });

  // console.log("pending-item:", item)

  // Which asset (of possibly many) in this transfer is currently being viewed/approved
  const [selectedAssetIndex, setSelectedAssetIndex] = useState(0);

  // Jump back to the first asset whenever a different transfer request is opened.
  // Adjusted during render (not in an effect) per React's guidance on resetting
  // state when a prop changes — see https://react.dev/learn/you-might-not-need-an-effect
  const [prevRowId, setPrevRowId] = useState(selectedRowId);
  if (selectedRowId !== prevRowId) {
    setPrevRowId(selectedRowId);
    setSelectedAssetIndex(0);
  }

  if (!selectedRowId || !item) {
    return <PageLoadingSpinner />;
  }
  // console.log("item:", item);
  const assets = item?.assets ?? [];
  const selectedAsset = assets[selectedAssetIndex] ?? assets[0];
  const images = selectedAsset?.images ?? [];

  return (
    <>
      <div className="hidden md:flex flex-col gap-4 px-4 py-8 min-h-[calc(100vh-var(--sm-navbarHeight))] md:h-[calc(100vh-var(--lg-navbarHeight))]">
        {showSuccess ? <Success /> : undefined}
        <BackButton to="/transfers/requests" parentStyles="hidden md:flex" />
        <div
          className={cn(
            "flex-1 min-h-0 hidden rounded-md p-2",
            "md:grid md:grid-cols-2 md:gap-2",
            "text-gray-100 bg-(--bg-primary-light) border-gray-700/70",
            "dark:bg-(--bg-primary_dark) dark:text-gray-800",
          )}
        >
          <div className="flex flex-col gap-2 min-h-0">
            <ImageGallery images={images} />
          </div>
          <div className="dark:bg-(--bg-secondary_dark) rounded-md">
            <TransferRequestApproval
              selectedAssetIndex={selectedAssetIndex}
              onSelectAsset={setSelectedAssetIndex}
            />
          </div>
        </div>
      </div>
      <div className={cn(sharedStyles.pageMobile)}>
        <MobileTransferRequestApproval
          item={item}
          selectedAssetIndex={selectedAssetIndex}
          onSelectAsset={setSelectedAssetIndex}
        />
      </div>
    </>
  );
};
export default TransferPendingItemPage;
