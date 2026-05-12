// $ This is the maintence request page with the maintenance request form. The user can create a maintenance job/action from this page.

import CreateJobForm from "@/components/jobs/CreateJobForm";
import { cn } from "@/lib/utils";
import { sharedStyles } from "@/styles/shared";

const CreateJobPage = () => {
  return (
    <div className={cn(sharedStyles.pageContainer)}>
      <div className={cn(sharedStyles.pageContent)}>
        <CreateJobForm />
      </div>
    </div>
  );
};

export default CreateJobPage;
