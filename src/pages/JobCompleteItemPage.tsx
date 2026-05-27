// $ This page renders the full details of an completed job with information and pictures
// import { useParams } from "react-router-dom";
import { PageLoadingSpinner } from "@/components/features/PageLoadingSpinner";
import { useById } from "../utils/api";
import { type CompletedJobResponse } from "@/schemas/jobSchemas";
// import { ImageGallery } from "@/components/features/ImageGallery";
import useGlobalContext from "@/context/useGlobalContext";
import JobCompleteItemInfo from "@/components/jobs/JobCompleteItemInfo";
import BackButton from "@/components/features/BackButton";

const JobCompleteItemPage = () => {
  const { selectedRowId } = useGlobalContext();

  const { data: item, isPending } = useById<CompletedJobResponse>({
    id: selectedRowId ?? "",
    queryKey: ["jobs", "status: complete", selectedRowId],
    resourcePath: "api/jobs",
    params: { status: "complete" },
  });

  console.log("completedJob:", item);

  if (!selectedRowId || !item) {
    return <PageLoadingSpinner />;
  }

  if (isPending) {
    return <PageLoadingSpinner />;
  }

  // const images = item.images;
  return (
    <div className="flex flex-col gap-4 px-4 py-8 min-h-[calc(100vh-var(--sm-navbarHeight))] md:h-[calc(100vh-var(--lg-navbarHeight))]">
      <BackButton to="/jobs/completed" />
      <JobCompleteItemInfo item={item} />
    </div>
  );
};

export default JobCompleteItemPage;
