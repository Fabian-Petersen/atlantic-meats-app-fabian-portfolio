// $ This page renders the full details of an completed job with information and pictures
// import { useParams } from "react-router-dom";
import { PageLoadingSpinner } from "@/components/features/PageLoadingSpinner";
import { useById } from "../utils/api";
import { type CompletedJobResponse } from "@/schemas/jobSchemas";
// import { ImageGallery } from "@/components/features/ImageGallery";
import useGlobalContext from "@/context/useGlobalContext";
import BackButton from "@/components/features/BackButton";
import CompletedJobDetails from "@/components/jobs/CompletedJobDetails";
import MobileCompletedJobDetails from "@/components/mobile/MobileCompletedJobDetails";

const JobCompleteItemPage = () => {
  const { selectedRowId } = useGlobalContext();

  const { data: item, isPending } = useById<CompletedJobResponse>({
    id: selectedRowId ?? "",
    queryKey: ["jobs", "status: complete"],
    resourcePath: "api/jobs",
    params: { status: "complete" },
  });

  // console.log("completedJob:", item);

  if (!selectedRowId) {
    return (
      <p className="w-full h-screen flex justify-center items-center">
        No job selected. Please go back.
      </p>
    ); // Or redirect
  }

  if (isPending) {
    return <PageLoadingSpinner />;
  }

  if (!item) {
    return <p>Job not found</p>;
  }

  return (
    <div>
      <div className="hidden md:flex flex-col gap-4 px-4 py-8 min-h-[calc(100vh-var(--sm-navbarHeight))] md:h-[calc(100vh-var(--lg-navbarHeight))] overflow-hidden">
        <BackButton
          to="/jobs/completed"
          parentStyles="text-gray-400 flex-none"
          label="Jobs"
        />
        <CompletedJobDetails item={item} />
      </div>
      <MobileCompletedJobDetails item={item} />
    </div>
  );
};

export default JobCompleteItemPage;
