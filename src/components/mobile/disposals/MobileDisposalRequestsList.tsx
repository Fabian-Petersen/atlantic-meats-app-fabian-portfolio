import type { Row } from "@tanstack/react-table";
import type { DisposalPendingTableRow } from "@/schemas/disposalsSchemas";
import MobileDisposalRequestCard from "./MobileDisposalRequestCard";
import { cn } from "@/lib/utils";
import { useState } from "react";

type MobileDisposalRequestsListProps = {
  data: Row<DisposalPendingTableRow>[];
  className?: string;
};

function MobileDisposalRequestsList({
  data,
  className,
}: MobileDisposalRequestsListProps) {
  const [openRowId, setOpenRowId] = useState<string | null>(null);
  return (
    <div className={cn("flex flex-col gap-2 w-full", className)}>
      {data.map((row) => (
        <MobileDisposalRequestCard
          key={row.id}
          row={row}
          isOpen={openRowId === row.id}
          onToggle={() => setOpenRowId(openRowId === row.id ? null : row.id)}
        />
      ))}
    </div>
  );
}

export default MobileDisposalRequestsList;
