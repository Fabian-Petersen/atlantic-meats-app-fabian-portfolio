import type { Row } from "@tanstack/react-table";
import type { TransferWorkflowResponse } from "@/schemas";
import type { Resource } from "@/utils/api";
import MobileTransferTransitCard from "./MobileTransferTransitCard";
import { cn } from "@/lib/utils";

type MobileTransferTransitListProps = {
  data: Row<TransferWorkflowResponse>[];
  setShowUpdateAssetDialog: (v: boolean) => void;
  setSelectedRowId: (id: string) => void;
  openDeleteDialog: (
    selectedRowId: string,
    config: {
      resourcePath: Resource;
      queryKey: readonly unknown[];
      resourceName?: string;
    },
  ) => void;
  className?: string;
};

function MobileTransferTransitList({
  data,
  setShowUpdateAssetDialog,
  setSelectedRowId,
  openDeleteDialog,
  className,
}: MobileTransferTransitListProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      {data.map((row) => (
        <MobileTransferTransitCard
          key={row.id}
          row={row}
          setShowUpdateAssetDialog={setShowUpdateAssetDialog}
          setSelectedRowId={setSelectedRowId}
          openDeleteDialog={openDeleteDialog}
        />
      ))}
    </div>
  );
}

export default MobileTransferTransitList;
