// $ This is the maintence request page with the maintenance request form. The user can create a maintenance job/action from this page.

import FormHeading from "../../customComponents/FormHeading";
import { ErrorPage } from "@/components/features/Error";
import JobRequestForm from "@/components/jobs/JobRequestForm";
import useGlobalContext from "@/context/useGlobalContext";
import { cn } from "@/lib/utils";
import { sharedStyles } from "@/styles/shared";

const JobRequestPage = () => {
  const { showError } = useGlobalContext();

  if (showError) {
    <ErrorPage />;
  }

  return (
    <div className={cn(sharedStyles.pageContainer)}>
      <div className={cn(sharedStyles.pageContent)}>
        <FormHeading
          className={cn(sharedStyles.headingForm)}
          heading="Create Job Request"
        />
        <JobRequestForm />
      </div>
    </div>
  );
};

export default JobRequestPage;
