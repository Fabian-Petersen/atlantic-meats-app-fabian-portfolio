import type { Row } from "@tanstack/react-table";
import type { TransferPendingTableRow } from "@/schemas";
import MobileTransferRequestCard from "./MobileTransfersRequestCard";
import { cn } from "@/lib/utils";

type MobileTransfersRequestsListProps = {
  data: Row<TransferPendingTableRow>[];
  className?: string;
};

function MobileTransfersRequestsList({
  data,
  className,
}: MobileTransfersRequestsListProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      {data.map((row) => (
        <MobileTransferRequestCard key={row.id} row={row} />
      ))}
    </div>
  );
}

export default MobileTransfersRequestsList;
