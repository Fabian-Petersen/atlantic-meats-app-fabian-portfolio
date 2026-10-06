// $ This page renders when a user updates an asset

import { cn } from "@/lib/utils";
import { sharedStyles } from "@/styles/shared";
import JobUpdateForm from "@/components/jobs/JobUpdateForm";

const JobInProgressUpdatePage = () => {
  return (
    <div
      className={cn(
        sharedStyles.pageContainer,
        "md:h-[calc(100dvh-var(--sm-navbarHeight))] md:max-h-[calc(100dvh-var(--sm-navbarHeight))] md:items-start md:overflow-y-auto md:py-6 md:[scrollbar-gutter:stable] lg:h-[calc(100dvh-var(--lg-navbarHeight))] lg:max-h-[calc(100dvh-var(--lg-navbarHeight))]",
      )}
    >
      <div className={cn(sharedStyles.pageContent, "md:shrink-0")}>
        <JobUpdateForm />
      </div>
    </div>
  );
};

export default JobInProgressUpdatePage;
