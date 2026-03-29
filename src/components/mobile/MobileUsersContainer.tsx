//$ This is a similar function to the MaintenanceRequestTable, on mobile it is an accordion instead of a table in desktop.

import type { UsersAPIResponse } from "@/schemas";
import { useState } from "react";
import type { Row } from "@tanstack/react-table";
import { MobileUsersCard } from "./MobileUsersCard";

type Props = {
  data: Row<UsersAPIResponse>[];
  className?: string;
};

export function MobileUsersContainer({ className, data }: Props) {
  const [openRowId, setOpenRowId] = useState<string | null>(null);
  return (
    <div className={`${className} flex flex-col gap-2 w-full`}>
      {data.map((row) => (
        <MobileUsersCard
          key={row.id}
          row={row}
          isOpen={openRowId === row.id}
          onToggle={() => setOpenRowId(openRowId === row.id ? null : row.id)}
        />
      ))}
    </div>
  );
}
