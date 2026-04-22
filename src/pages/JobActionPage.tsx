// $ This is the maintence request page with the maintenance request form. The user can create a maintenance job/action from this page. The Page is used on mobile and a dialog on desktop.

import FormHeading from "../../customComponents/FormHeading";
import JobActionForm from "@/components/jobs/JobActionForm";
import { cn } from "@/lib/utils";
import { sharedStyles } from "@/styles/shared";
import { useNavigate } from "react-router-dom";

/**
 *JobActionPage
 *Path: "/jobs/:id/action"
 *
 *Purpose:
 * - Enables users to action a maintenance job request.
 *
 *Responsibilities:
 * - Renders the page layout and heading.
 * - Hosts the JobActionForm component.
 * - Handles navigation on user actions.
 *
 *Layout Behavior:
 * - Mobile: Rendered as a full standalone page.
 * - Desktop: Rendered as a full standalone page.
 *
 *Navigation:
 * - Cancel: Redirects user to "/jobs/in-progress".
 * - Submit:
 *    - POST action to the database '*-actions-table'
 *    - Change job status to "Complete"
 *    - Redirect user back to "/jobs/in-progress"
 *
 *Dependencies:
 * - JobActionForm (form logic and submission)
 * - FormHeading (UI heading)
 * - Shared layout styles
 */
const JobActionPage = () => {
  const navigate = useNavigate();
  return (
    <div className={cn(sharedStyles.pageContainer)}>
      <div className={cn(sharedStyles.pageContent)}>
        <FormHeading
          heading="Action Job"
          className={cn(sharedStyles.headingForm)}
        />
        <JobActionForm onCancel={() => navigate("/jobs/in-progress")} />
      </div>
    </div>
  );
};

export default JobActionPage;
