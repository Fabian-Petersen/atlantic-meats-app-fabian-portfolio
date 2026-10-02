// $ This is the maintence request page with the maintenance request form. The user can create a maintenance job/action from this page.

import CreateJobForm from "@/components/jobs/CreateJobForm";
import { cn } from "@/lib/utils";
import { sharedStyles } from "@/styles/shared";

const CreateJobPage = () => {
  return (
    <div
      className={cn(
        sharedStyles.pageContainer,
        "md:h-[calc(100dvh-var(--sm-navbarHeight))] md:max-h-[calc(100dvh-var(--sm-navbarHeight))] md:items-start md:overflow-y-auto md:py-6 md:[scrollbar-gutter:stable] lg:h-[calc(100dvh-var(--lg-navbarHeight))] lg:max-h-[calc(100dvh-var(--lg-navbarHeight))]",
      )}
    >
      <div className={cn(sharedStyles.pageContent, "md:shrink-0")}>
        <CreateJobForm />
      </div>
    </div>
  );
};

export default CreateJobPage;
