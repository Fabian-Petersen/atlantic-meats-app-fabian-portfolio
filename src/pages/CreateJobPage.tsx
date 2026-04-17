// $ This is the maintence request page with the maintenance request form. The user can create a maintenance job/action from this page.

import FormHeading from "../../customComponents/FormHeading";
import { ErrorPage } from "@/components/features/Error";
import CreateJobForm from "@/components/jobs/CreateJobForm";
import useGlobalContext from "@/context/useGlobalContext";
import { cn } from "@/lib/utils";
import { sharedStyles } from "@/styles/shared";

const CreateJobPage = () => {
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
        <CreateJobForm />
      </div>
    </div>
  );
};

export default CreateJobPage;
