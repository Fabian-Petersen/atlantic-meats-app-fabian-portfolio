//$ This is a similar function to the MaintenanceRequestTable, on mobile it is an accordion instead of a table in desktop.

import type {
  ActionAPIResponse,
  JobcardPresignedUrlResponse,
} from "@/schemas";
import { useState } from "react";
import MobileJobsCompletedCard from "./MobileJobsCompletedCard";
import type { Row } from "@tanstack/react-table";

type Props = {
  data: Row<ActionAPIResponse>[];
  className?: string;
  downloadItem: (id: string) => Promise<JobcardPresignedUrlResponse>;
};

export function MobileJobsCompletedParent({
  className,
  data,
  downloadItem,
}: Props) {
  const [openRowId, setOpenRowId] = useState<string | null>(null);
  return (
    <div className={`${className} flex flex-col gap-2 w-full`}>
      {data.map((row) => (
        <MobileJobsCompletedCard
          key={row.id}
          row={row}
          isOpen={openRowId === row.id}
          onToggle={() => setOpenRowId(openRowId === row.id ? null : row.id)}
          downloadItem={downloadItem}
        />
      ))}
    </div>
  );
}
