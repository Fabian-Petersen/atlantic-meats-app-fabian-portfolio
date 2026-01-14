//$ This is a similar function to the MaintenanceRequestTable, on mobile it is an accordion instead of a table in desktop.

import type { AssetFormValues } from "@/schemas";
import { useState } from "react";
import { MobileAssetViewRow } from "./MobileAssetViewRow";
import type { Row } from "@tanstack/react-table";

type Props = {
  data: Row<AssetFormValues>[];
  className?: string;
};

export function MobileAssetsOverviewTable({ className, data }: Props) {
  const [openRowId, setOpenRowId] = useState<string | null>(null);
  return (
    <div className={`${className} flex flex-col gap-2 w-full`}>
      {data.map((row) => (
        <MobileAssetViewRow
          key={row.id}
          row={row}
          isOpen={openRowId === row.id}
          onToggle={() => setOpenRowId(openRowId === row.id ? null : row.id)}
        />
      ))}
    </div>
  );
}
