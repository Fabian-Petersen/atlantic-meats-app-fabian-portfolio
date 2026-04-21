// $ This page renders the full details of an completed job with information and pictures
// import { useParams } from "react-router-dom";
import { PageLoadingSpinner } from "@/components/features/PageLoadingSpinner";
import { useById } from "../utils/api";
import { type JobApprovedAPIResponse } from "@/schemas/jobSchemas";
import { ImageGallery } from "@/components/features/ImageGallery";
import useGlobalContext from "@/context/useGlobalContext";
import JobCompleteItemInfo from "@/components/jobs/JobCompleteItemInfo";

const JobCompleteItemPage = () => {
  const { selectedRowId } = useGlobalContext();

  const { data: item, isPending } = useById<JobApprovedAPIResponse>({
    id: selectedRowId ?? "",
    queryKey: ["jobs", "completed"],
    resourcePath: "jobs",
    params: { status: "Complete" },
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
    <div className="p-8">
      <div className="h-auto p-8 bg-white dark:bg-(--bgd) border-(--clr-borderDark) rounded-md grid md:grid-cols-2 gap-2 text-(--clr-textLight) dark:(--clr-textDark)">
        <div>
          <ImageGallery images={images ?? []} />
        </div>
        <div>
          <JobCompleteItemInfo item={item} />
        </div>
      </div>
    </div>
  );
};

export default JobCompleteItemPage;
