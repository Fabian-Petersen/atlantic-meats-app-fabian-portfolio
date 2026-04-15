// $ This is the maintence request page with the maintenance request form. The user can create a maintenance job/action from this page. The Page is used on mobile and a dialog on desktop.

import FormHeading from "../../customComponents/FormHeading";
import JobActionForm from "@/components/jobs/JobActionForm";
import { cn } from "@/lib/utils";
import { sharedStyles } from "@/styles/shared";
import { useNavigate } from "react-router-dom";

const JobActionPage = () => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center w-full h-full p-4">
      <div className="dark:bg-(--bg-primary_dark) bg-white flex flex-col gap-1 lg:gap-4 w-full max-w-xl lg:max-w-3xl h-auto rounded-xl shadow-lg p-4 dark:text-gray-100 dark:border-gray-700/50 dark:border">
        <FormHeading
          heading="Job Completed"
          className={cn(sharedStyles.formHeading)}
        />
        <JobActionForm onCancel={() => navigate("/jobs/completed")} />
      </div>
    </div>
  );
};

export default JobActionPage;
