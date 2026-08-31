// $ This is the transfer asset request page. The user can create a new request to transfer an asset from one location to a next with approvals.

import { cn } from "@/lib/utils";
import CreateTransferTransitForm from "@/components/transfers/CreateTransferTransitForm";
import { sharedStyles } from "@/styles/shared";
import { useById } from "@/utils/api";
import { useParams } from "react-router-dom";
import type { TransferWorkflowResponse } from "@/schemas";

const CreateTransferTransitPage = () => {
  const { id } = useParams<{ id: string }>();

  const { data } = useById<TransferWorkflowResponse>({
    id: id ?? "",
    resourcePath: `api/transfers`,
    queryKey: ["transfer", id],
  });

  return (
    <div className={cn(sharedStyles.pageContainer)}>
      <div className={cn(sharedStyles.pageContent)}>
        <CreateTransferTransitForm data={data} />
      </div>
    </div>
  );
};

export default CreateTransferTransitPage;
