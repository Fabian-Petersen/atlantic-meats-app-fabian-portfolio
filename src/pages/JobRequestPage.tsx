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
    <div className="flex items-center justify-center w-full h-full p-4">
      <div className="bg-white flex flex-col gap-4 w-full lg:max-w-3xl h-auto rounded-xl shadow-lg p-4 dark:bg-(--bg-primary_dark) dark:text-(--clr-textDark) dark:border-gray-700/50 dark:border">
        <FormHeading
          className={cn(sharedStyles.formHeading)}
          heading="Create Job Request"
        />
        <JobRequestForm />
      </div>
    </div>
  );
};

export default JobRequestPage;
