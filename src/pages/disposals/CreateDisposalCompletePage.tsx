// $ This is the disposal asset request page. The user can create a new request to dispose of an asset from one location to a next with approvals.

import { cn } from "@/lib/utils";
import CreateDisposalCompletedForm from "@/components/disposals/CreateDisposalCompletedForm";
import { sharedStyles } from "@/styles/shared";

const CreateDisposalCompletePage = () => {
  return (
    <div className={cn(sharedStyles.pageContainer)}>
      <div className={cn(sharedStyles.pageContent)}>
        <CreateDisposalCompletedForm />
      </div>
    </div>
  );
};

export default CreateDisposalCompletePage;
