// $ This is the transfer asset request page. The user can create a new request to transfer an asset from one location to a next with approvals.

import { cn } from "@/lib/utils";
import CreateTransferReceiptForm from "@/components/transfers/CreateTransferReceiptForm";
import { sharedStyles } from "@/styles/shared";
import { useById } from "@/utils/api";
import { useParams } from "react-router-dom";
import type { TransferWorkflowResponse } from "@/schemas";

const CreateTransferReceiptPage = () => {
  const { id } = useParams<{ id: string }>();

  const { data } = useById<TransferWorkflowResponse>({
    id: id ?? "",
    resourcePath: `api/transfers`,
    queryKey: ["transfer", id],
  });

  console.log("transferItemPage:", data);
  return (
    <div className={cn(sharedStyles.pageContainer)}>
      <div className={cn(sharedStyles.pageContent)}>
        <CreateTransferReceiptForm data={data} />
      </div>
    </div>
  );
};

export default CreateTransferReceiptPage;
