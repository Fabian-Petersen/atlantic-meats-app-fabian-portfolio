// $ This is the transfer asset request page. The user can create a new request to transfer an asset from one location to a next with approvals.

import { cn } from "@/lib/utils";
import CreateTransferReceiptForm from "@/components/transfers/CreateTransferReceiptForm";
import { sharedStyles } from "@/styles/shared";

const CreateTransferReceiptPage = () => {
  return (
    <div className={cn(sharedStyles.pageContainer)}>
      <div className={cn(sharedStyles.pageContent)}>
        <CreateTransferReceiptForm />
      </div>
    </div>
  );
};

export default CreateTransferReceiptPage;
