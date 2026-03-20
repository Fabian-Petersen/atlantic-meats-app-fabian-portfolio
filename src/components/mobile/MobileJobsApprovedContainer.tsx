//$ This is a similar function to the MaintenanceRequestTable, on mobile it is an accordion instead of a table in desktop.

import type { JobApprovedAPIResponse } from "@/schemas/jobSchemas";
import { useState } from "react";
import type { Row } from "@tanstack/react-table";
import { MobileJobsApprovedCard } from "./MobileJobsApprovedCard";

type Props = {
  data: Row<JobApprovedAPIResponse>[];
  className?: string;
};

export function MobileJobsApprovedContainer({ className, data }: Props) {
  const [openRowId, setOpenRowId] = useState<string | null>(null);
  return (
    <div className={`${className} flex flex-col gap-2 w-full`}>
      {data.map((row) => (
        <MobileJobsApprovedCard
          key={row.id}
          row={row}
          isOpen={openRowId === row.id}
          onToggle={() => setOpenRowId(openRowId === row.id ? null : row.id)}
        />
      ))}
    </div>
  );
}
