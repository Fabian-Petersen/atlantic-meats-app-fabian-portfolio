// $ This page renders the full details of a maintenance request for approval with the information and the supporting pictures.

import { PageLoadingSpinner } from "@/components/features/PageLoadingSpinner";
import { useById } from "../utils/api";
import { type JobAPIResponse } from "@/schemas";
import { ImageGallery } from "@/components/features/ImageGallery";
import RequestApproval from "@/components/requests_approvals/RequestApproval";
import { Success } from "@/components/features/Success";
import useGlobalContext from "@/context/useGlobalContext";
import MobileRequestApproval from "@/components/mobile/MobileRequestApproval";

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
    <div className="p-4">
      {showSuccess ? <Success /> : undefined}
      <div className="hidden h-auto var(--bg-primary-light) border-gray-700/70 rounded-md lg:grid md:grid-cols-2 gap-2 text-gray-100 dark:text-gray-800 p-4">
        <div>
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
