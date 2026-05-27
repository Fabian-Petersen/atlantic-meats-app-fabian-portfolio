// $ This page renders the full details of an completed job with information and pictures
// import { useParams } from "react-router-dom";
import { PageLoadingSpinner } from "@/components/features/PageLoadingSpinner";
import { useById } from "../utils/api";
import { type CompletedJobResponse } from "@/schemas/jobSchemas";
// import { ImageGallery } from "@/components/features/ImageGallery";
import useGlobalContext from "@/context/useGlobalContext";
import BackButton from "@/components/features/BackButton";
import CompletedJobDetails from "@/components/jobs/CompletedJobDetails";

const JobCompleteItemPage = () => {
  const { selectedRowId } = useGlobalContext();

  const { data: item, isPending } = useById<CompletedJobResponse>({
    id: selectedRowId ?? "",
    queryKey: ["jobs", "status: complete"],
    resourcePath: "api/jobs",
    params: { status: "complete" },
  });

  console.log("completedJob:", item);

  if (!selectedRowId) {
    // setErrorConfig({
    //   title: "Error",
    //   message: "No job selected",
    //   redirectPath: "jobs/completed",
    // });
    // setShowError(true);
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
    // setErrorConfig({
    //   title: "Error",
    //   message: "Job details not found",
    //   redirectPath: "jobs/completed",
    // });
    // setShowError(true);
  }

  // const images = item.images;
  return (
    <div className="flex flex-col gap-4 px-4 py-8 min-h-[calc(100vh-var(--sm-navbarHeight))] md:h-[calc(100vh-var(--lg-navbarHeight))] overflow-hidden">
      <BackButton to="/jobs/completed" parentStyles="text-gray-400 flex-none" />
      <CompletedJobDetails item={item} />
    </div>
  );
};

export default JobCompleteItemPage;
