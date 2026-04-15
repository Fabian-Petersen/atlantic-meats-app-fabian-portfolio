// $ This page renders the full details of an approved request with information and pictures
import { useParams } from "react-router-dom";
import { PageLoadingSpinner } from "@/components/features/PageLoadingSpinner";
import { useById } from "../utils/api";
import { type JobApprovedAPIResponse } from "@/schemas/jobSchemas";
import { ImageGallery } from "@/components/features/ImageGallery";
import JobApprovedItemInfo from "@/components/jobs/JobApprovedItemInfo";

const JobApprovedItemPage = () => {
  const { id } = useParams<{ id: string }>();

  const MAINTENANCE_REQUESTS_KEY = ["maintenanceRequests"];

  const { data: item, isPending } = useById<JobApprovedAPIResponse>({
    id: id || "",
    queryKey: MAINTENANCE_REQUESTS_KEY,
    resourcePath: "jobs/approved",
  });

  if (!id || !item) {
    return <PageLoadingSpinner />;
  }

  if (isPending) {
    return <PageLoadingSpinner />;
  }

  const images = item.images;

  // console.log("Item Data with Presigned URLS:", item);
  return (
    <div className="p-8">
      <div className="h-auto p-8 bg-white dark:bg-(--bgd) border-(--clr-borderDark) rounded-md grid md:grid-cols-2 gap-2 text-(--clr-textLight) dark:(--clr-textDark)">
        <div>
          <ImageGallery images={images ?? []} />
        </div>
        <div>
          <JobApprovedItemInfo item={item} />
        </div>
      </div>
    </div>
  );
};

export default JobApprovedItemPage;
