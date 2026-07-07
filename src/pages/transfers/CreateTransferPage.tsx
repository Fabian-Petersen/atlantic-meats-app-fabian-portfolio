// $ This is the transfer asset request page. The user can create a new request to transfer an asset from one location to a next with approvals.

import { cn } from "@/lib/utils";
// import FormHeading from "../../customComponents/FormHeading";
import CreateTransferForm from "@/components/transfers/CreateTransferForm";
import { sharedStyles } from "@/styles/shared";

const CreateTransferPage = () => {
  return (
    <div className={cn(sharedStyles.pageContainer)}>
      <div className={cn(sharedStyles.pageContent)}>
        <CreateTransferForm />
      </div>
    </div>
  );
};

export default CreateTransferPage;
