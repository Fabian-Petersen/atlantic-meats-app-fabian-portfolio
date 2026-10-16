// $ This page renders when a user updates a disposal request

import { cn } from "@/lib/utils";
import { sharedStyles } from "@/styles/shared";
import DisposalUpdateForm from "@/components/disposals/DisposalUpdateForm";

const DisposalUpdatePage = () => {
  return (
    <div className={cn(sharedStyles.pageContainer)}>
      <div className={cn(sharedStyles.pageContent)}>
        <DisposalUpdateForm />
      </div>
    </div>
  );
};

export default DisposalUpdatePage;
