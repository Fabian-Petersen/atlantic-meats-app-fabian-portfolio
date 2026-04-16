// $ This is the maintence request page with the maintenance request form. The user can create a maintenance job/action from this page. The Page is used on mobile and a dialog on desktop.

import FormHeading from "../../customComponents/FormHeading";
import JobActionForm from "@/components/jobs/JobActionForm";
import { cn } from "@/lib/utils";
import { sharedStyles } from "@/styles/shared";
import { useNavigate } from "react-router-dom";

const JobActionPage = () => {
  const navigate = useNavigate();
  return (
    <div className={cn(sharedStyles.pageContainer)}>
      <div className={cn(sharedStyles.pageContent)}>
        <FormHeading
          heading="Action Job"
          className={cn(sharedStyles.headingForm)}
        />
        <JobActionForm onCancel={() => navigate("/jobs/completed")} />
      </div>
    </div>
  );
};

export default JobActionPage;
