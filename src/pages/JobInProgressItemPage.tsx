// $ This page renders the full details of an approved request with information and pictures
// import { useParams } from "react-router-dom";
import { PageLoadingSpinner } from "@/components/features/PageLoadingSpinner";
import { useById } from "../utils/api";
import { type JobApprovedAPIResponse } from "@/schemas/jobSchemas";
import { ImageGallery } from "@/components/features/ImageGallery";
import JobApprovedItemInfo from "@/components/jobs/JobApprovedItemInfo";
import useGlobalContext from "@/context/useGlobalContext";

// % Mobile
import MobileInProgressPage from "@/components/mobile/MobileInProgressPage";

const JobInProgressItemPage = () => {
  // const { id } = useParams<{ id: string }>();
  const { selectedRowId } = useGlobalContext();
  // console.log("Selected Row ID:", selectedRowId);

  const { data: item, isPending } = useById<JobApprovedAPIResponse>({
    id: selectedRowId ?? "",
    queryKey: ["jobs", "in-progress"],
    resourcePath: "jobs",
    params: { status: "in progress" },
  });

  if (!selectedRowId || !item) {
    return <PageLoadingSpinner />;
  }

  if (isPending) {
    return <PageLoadingSpinner />;
  }

  const images = item.images;

  // console.log("Item Data with Presigned URLS:", item);
  return (
    <div className="p-2 md:p-8">
      <div className="hidden h-auto p-8 bg-white dark:bg-(--bgd) border-(--clr-borderDark) rounded-md md:grid md:grid-cols-2 gap-2 text-(--clr-textLight) dark:(--clr-textDark)">
        <div>
          <ImageGallery images={images ?? []} />
        </div>
        <div>
          <JobApprovedItemInfo item={item} />
        </div>
      </div>
      <MobileInProgressPage item={item} />
    </div>
  );
};

export default JobInProgressItemPage;
