import type { Row } from "@tanstack/react-table";
import type { TransferWorkflowResponse } from "@/schemas";
// import type { Resource } from "@/utils/api";
import MobileTransfersCompletedCard from "./MobileTransfersCompletedCard";
import { cn } from "@/lib/utils";

type MobileTransferCompletedListProps = {
  data: Row<TransferWorkflowResponse>[];
  setSelectedRowId: (id: string) => void;
  //   setShowUpdateAssetDialog: (v: boolean) => void;
  //   openDeleteDialog: (
  //     selectedRowId: string,
  //     config: {
  //       resourcePath: Resource;
  //       queryKey: readonly unknown[];
  //       resourceName?: string;
  //     },
  //   ) => void;
  className?: string;
};

function MobileTransferCompletedList({
  data,
  setSelectedRowId,
  //   setShowUpdateAssetDialog,
  //   openDeleteDialog,
  className,
}: MobileTransferCompletedListProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      {data.map((row) => (
        <MobileTransfersCompletedCard
          key={row.id}
          row={row}
          setSelectedRowId={setSelectedRowId}
          //   setShowUpdateAssetDialog={setShowUpdateAssetDialog}
          //   openDeleteDialog={openDeleteDialog}
        />
      ))}
    </div>
  );
}

export default MobileTransferCompletedList;
