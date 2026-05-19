// $ This page renders the full details of a maintenance request for approval with the information and the supporting pictures.

import { PageLoadingSpinner } from "@/components/features/PageLoadingSpinner";
import { useById } from "../utils/api";
import { type JobAPIResponse } from "@/schemas";
import { ImageGallery } from "@/components/features/ImageGallery";
import RequestApproval from "@/components/requests_approvals/RequestApproval";
import { Success } from "@/components/features/Success";
import useGlobalContext from "@/context/useGlobalContext";
import MobileRequestApproval from "@/components/mobile/MobileRequestApproval";
import BackButton from "@/components/features/BackButton";
import { cn } from "@/lib/utils";

export type PresignedUrlResponse = {
  key: string;
  filename?: string;
  url: string;
};

const JobPendingItemPage = () => {
  const { showSuccess, selectedRowId } = useGlobalContext();

  const { data: item } = useById<JobAPIResponse>({
    id: selectedRowId ?? "",
    queryKey: ["jobs", "pending-approval-job"],
    resourcePath: `jobs`,
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
      <BackButton to="/jobs/pending-approval" />
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
          <RequestApproval />
        </div>
      </div>
      <MobileRequestApproval item={item} />
    </div>
  );
};

export default JobPendingItemPage;
