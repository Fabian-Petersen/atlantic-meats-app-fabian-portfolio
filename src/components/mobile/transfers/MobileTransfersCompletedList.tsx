import type { Row } from "@tanstack/react-table";
import type { TransferWorkflowResponse } from "@/schemas";
// import type { Resource } from "@/utils/api";
import MobileTransfersCompletedCard from "./MobileTransfersCompletedCard";
import { cn } from "@/lib/utils";
import { useState } from "react";

type MobileTransferCompletedListProps = {
  data: Row<TransferWorkflowResponse>[];
  setSelectedRowId: (id: string) => void;
  selectedRowId: string;
  className?: string;
};

function MobileTransferCompletedList({
  data,
  setSelectedRowId,
  selectedRowId,
  className,
}: MobileTransferCompletedListProps) {
  const [openRowId, setOpenRowId] = useState<string | null>(null);
  return (
    <div className={cn("flex flex-col gap-2 w-full", className)}>
      {data.map((row) => (
        <MobileTransfersCompletedCard
          key={row.id}
          row={row}
          isOpen={openRowId === row.id}
          onToggle={() => setOpenRowId(openRowId === row.id ? null : row.id)}
          setSelectedRowId={setSelectedRowId}
          selectedRowId={selectedRowId}
        />
      ))}
    </div>
  );
}

export default MobileTransferCompletedList;
