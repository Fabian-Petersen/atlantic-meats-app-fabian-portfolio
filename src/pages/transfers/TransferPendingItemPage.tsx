// $ This page renders the full details of a maintenance request for approval with the information and the supporting pictures.

import { PageLoadingSpinner } from "@/components/features/PageLoadingSpinner";
import { useById } from "../../utils/api";
import { type TransferResponseValues } from "@/schemas";
import { ImageGallery } from "@/components/features/ImageGallery";
import { Success } from "@/components/features/Success";
import useGlobalContext from "@/context/useGlobalContext";
import MobileRequestApproval from "@/components/mobile/MobileRequestApproval";
import BackButton from "@/components/features/BackButton";
import { cn } from "@/lib/utils";
import TransferRequestApproval from "@/components/transfers/TransferRequestApproval";

export type PresignedUrlResponse = {
  key: string;
  filename?: string;
  url: string;
};

const TransferPendingItemPage = () => {
  const { showSuccess, selectedRowId } = useGlobalContext();

  const { data: item } = useById<TransferResponseValues>({
    id: selectedRowId ?? "",
    queryKey: ["transfers", "pending-approval"],
    resourcePath: `api/transfers`,
    params: {
      status: "pending",
    },
  });

  if (!selectedRowId || !item) {
    return <PageLoadingSpinner />;
  }

  const images = item.images;

  return (
    <div className="flex flex-col gap-4 px-4 py-8 min-h-[calc(100vh-var(--sm-navbarHeight))] md:h-[calc(100vh-var(--lg-navbarHeight))]">
      {showSuccess ? <Success /> : undefined}
      <BackButton to="/transfers/requests" />
      <div
        className={cn(
          "flex-1 min-h-0 hidden bg-(--bg-primary-light) border-gray-700/70 rounded-md lg:grid md:grid-cols-2 gap-2 text-gray-100 dark:text-gray-800",
          "dark:bg-(--bg-secondary_dark)",
        )}
      >
        <div className="flex flex-col gap-2 min-h-0">
          <ImageGallery images={images ?? []} />
        </div>
        <div>
          <TransferRequestApproval />
        </div>
      </div>
      <MobileRequestApproval item={item} />
    </div>
  );
};

export default TransferPendingItemPage;
