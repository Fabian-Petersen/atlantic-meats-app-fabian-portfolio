//$ This is a similar function to the MaintenanceRequestTable, on mobile it is an accordion instead of a table in desktop.

import type { JobAPIResponse } from "@/schemas";
import { useState } from "react";
import { MobileMaintenanceRequestRow } from "./MobileMaintenanceRequestRow";
import type { Row } from "@tanstack/react-table";

type Props = {
  data: Row<JobAPIResponse>[];
  className?: string;
};

export function MobileMaintenanceRequestsTable({ className, data }: Props) {
  const [openRowId, setOpenRowId] = useState<string | null>(null);
  return (
    <div className={`${className} flex flex-col gap-2 w-full p-2`}>
      {data.map((row) => (
        <MobileMaintenanceRequestRow
          key={row.id}
          row={row}
          isOpen={openRowId === row.id}
          onToggle={() => setOpenRowId(openRowId === row.id ? null : row.id)}
        />
      ))}
    </div>
  );
}
