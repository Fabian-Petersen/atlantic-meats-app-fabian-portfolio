// $ This page renders the full details of a maintenance request for approval with the information and the supporting pictures.

import { useParams } from "react-router-dom";
import { PageLoadingSpinner } from "@/components/features/PageLoadingSpinner";
import { useById } from "../utils/api";
import { type JobAPIResponse } from "@/schemas";
import { ImageGallery } from "@/components/features/ImageGallery";
import RequestApproval from "@/components/requests_approvals/RequestApproval";
import { Success } from "@/components/features/Success";
import useGlobalContext from "@/context/useGlobalContext";

export type PresignedUrlResponse = {
  key: string;
  filename?: string;
  url: string;
};

const JobPendingPage = () => {
  const { id } = useParams<{ id: string }>();
  const { showSuccess } = useGlobalContext();

  const MAINTENANCE_REQUESTS_KEY = ["maintenanceRequests"];

  const { data: item, isPending } = useById<JobAPIResponse>({
    id: id || "",
    queryKey: MAINTENANCE_REQUESTS_KEY,
    resourcePath: "jobs-list-pending",
  });

  if (!id || !item) {
    return <PageLoadingSpinner />;
  }

  if (isPending) {
    return <PageLoadingSpinner />;
  }

  const images = item.images;

  return (
    <div className="p-4">
      {showSuccess ? (
        <Success
          title="Success"
          message="The item was successfully assigned"
          redirectPath="/jobs-list-approved"
        />
      ) : undefined}
      <div className="h-auto bg-white dark:bg-[#1d2739] border-gray-700/70 rounded-md grid md:grid-cols-2 gap-2 text-gray-100 dark:text-gray-800">
        <div>
          <ImageGallery images={images ?? []} />
        </div>
        <div>
          <RequestApproval />
        </div>
      </div>
    </div>
  );
};

export default JobPendingPage;
