// $ This page renders when a user updates a transfer request

import TransferUpdateForm from "@/components/transfers/TransferUpdateForm";
import { cn } from "@/lib/utils";
import { sharedStyles } from "@/styles/shared";

const TransferUpdatePage = () => {
  return (
    <div className={cn(sharedStyles.pageContainer)}>
      <div className={cn(sharedStyles.pageContent)}>
        <TransferUpdateForm />
      </div>
    </div>
  );
};

export default TransferUpdatePage;
