// $ This is the transfer asset request page. The user can create a new request to transfer an asset from one location to a next with approvals.

import { cn } from "@/lib/utils";
import CreateTransferTransitForm from "@/components/transfers/CreateTransferTransitForm";
import { sharedStyles } from "@/styles/shared";

const CreateTransferTransitPage = () => {
  return (
    <div className={cn(sharedStyles.pageContainer)}>
      <div className={cn(sharedStyles.pageContent)}>
        <CreateTransferTransitForm />
      </div>
    </div>
  );
};

export default CreateTransferTransitPage;
