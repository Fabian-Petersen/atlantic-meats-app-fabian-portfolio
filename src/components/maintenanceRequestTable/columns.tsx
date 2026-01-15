import type { ColumnDef } from "@tanstack/react-table";
import type { CreateJobFormValues } from "@/schemas";
import { DropdownMenuButtonDialog } from "../modals/DropdownMenuButtonDialog";
import { type TableMenuProps } from "@/data/TableMenuItems";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const getMaintenanceColumns = (
  menuStateActions: TableMenuProps[]
): ColumnDef<CreateJobFormValues>[] => [
  {
    accessorKey: "createdAt",
    header: "Date Created",
    cell: ({ getValue }) =>
      new Date(getValue<string>()).toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    sortingFn: "datetime",
  },
  {
    accessorKey: "additional_notes",
    header: "Additional Notes",
  },
  {
    accessorKey: "equipment",
    header: "Equipment",
  },
  {
    accessorKey: "impact",
    header: "Impact",
  },
  {
    accessorKey: "priority",
    header: "Priority",
  },
  {
    accessorKey: "store",
    header: "Store",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    id: "actions",
    header: "Actions",
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => (
      <div className="text-right" onClick={(e) => e.stopPropagation()}>
        <DropdownMenuButtonDialog
          data={row.original}
          menuStateActions={menuStateActions}
        />
      </div>
    ),
  },
];
