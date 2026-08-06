import type { Row } from "@tanstack/react-table";
import type { TransferPendingTableRow } from "@/schemas";
import MobileTransferRequestCard from "./MobileTransfersRequestCard";
import { cn } from "@/lib/utils";
import { useState } from "react";

type MobileTransfersRequestsListProps = {
  data: Row<TransferPendingTableRow>[];
  className?: string;
};

function MobileTransfersRequestsList({
  data,
  className,
}: MobileTransfersRequestsListProps) {
  const [openRowId, setOpenRowId] = useState<string | null>(null);
  return (
    <div className={cn("flex flex-col gap-2 w-full", className)}>
      {data.map((row) => (
        <MobileTransferRequestCard
          key={row.id}
          row={row}
          isOpen={openRowId === row.id}
          onToggle={() => setOpenRowId(openRowId === row.id ? null : row.id)}
        />
      ))}
    </div>
  );
}

export default MobileTransfersRequestsList;
