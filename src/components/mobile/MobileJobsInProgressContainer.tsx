//$ This is a similar function to the MaintenanceRequestTable, on mobile it is an accordion instead of a table in desktop.

import type { JobApprovedAPIResponse } from "@/schemas/jobSchemas";
import { useState } from "react";
import type { Row } from "@tanstack/react-table";
import { MobileJobsInProgressCard } from "./MobileJobsInProgressCard";

type Props = {
  data: Row<JobApprovedAPIResponse>[];
  className?: string;
};

export function MobileJobsInProgressContainer({ className, data }: Props) {
  const [openRowId, setOpenRowId] = useState<string | null>(null);
  return (
    <div className={`${className} flex flex-col gap-2 w-full`}>
      {data.map((row) => (
        <MobileJobsInProgressCard
          key={row.id}
          row={row}
          isOpen={openRowId === row.id}
          onToggle={() => setOpenRowId(openRowId === row.id ? null : row.id)}
        />
      ))}
    </div>
  );
}
