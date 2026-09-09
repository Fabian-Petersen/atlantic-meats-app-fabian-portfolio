// $ This page renders the full details of a maintenance request for approval with the information and the supporting pictures.

import { PageLoadingSpinner } from "@/components/features/PageLoadingSpinner";
import { useById } from "../../utils/api";
import { type JobAPIResponse } from "@/schemas";
import { ImageGallery } from "@/components/features/ImageGallery";
import RequestApproval from "@/components/modal_request_actions/RequestApproval";
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
    resourcePath: `api/jobs`,
    params: {
      status: "pending",
    },
  });

  if (!selectedRowId || !item) {
    return <PageLoadingSpinner />;
  }

  const images = item.images;

  return (
    <div className="flex min-h-[calc(100vh-var(--sm-navbarHeight))] flex-col gap-4 px-1 py-2 md:h-[calc(100vh-var(--lg-navbarHeight))] md:py-8">
      {showSuccess ? <Success /> : undefined}
      <BackButton to="/jobs/pending-approval" parentStyles="hidden md:flex" />
      <div
        className={cn(
          "hidden min-h-0 flex-1 gap-2 rounded-md border-gray-700/70 bg-(--bg-primary-light) text-gray-100 md:grid md:grid-cols-2 dark:text-gray-800",
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
      <div className="md:hidden">
        <MobileRequestApproval item={item} />
      </div>
    </div>
  );
};

export default JobPendingItemPage;
