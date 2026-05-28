// $ This page renders the full details of an completed job with information and pictures
// import { useParams } from "react-router-dom";
// import { PageLoadingSpinner } from "@/components/features/PageLoadingSpinner";
import { useById } from "../utils/api";
import { type CompletedJobResponse } from "@/schemas/jobSchemas";
import BackButton from "@/components/features/BackButton";
import CompletedJobDetails from "@/components/jobs/CompletedJobDetails";
import MobileCompletedJobDetails from "@/components/mobile/MobileCompletedJobDetails";
import { PageLoadingSpinner } from "@/components/features/PageLoadingSpinner";
import { useParams } from "react-router-dom";

const JobCompleteItemPage = () => {
  const { id: jobId } = useParams<{ id: string }>();

  const { data: item, isPending } = useById<CompletedJobResponse>({
    id: jobId ?? "",
    queryKey: ["jobs", "status: complete"],
    resourcePath: "api/jobs",
    params: { status: "complete" },
  });

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
