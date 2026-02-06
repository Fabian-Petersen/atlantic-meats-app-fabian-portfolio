import type { ColumnDef } from "@tanstack/react-table";
import type { MaintenanceTableRow } from "@/schemas";
import { DropdownMenuButtonDialog } from "../modals/DropdownMenuButtonDialog";
import { getMaintenanceTableMenuItems } from "@/lib/TableMenuItemsActions";

export const getMaintenanceColumns = (
  setShowUpdateMaintenanceDialog: (v: boolean) => void,
  setShowActionDialog: (v: boolean) => void,
  setShowDeleteDialog: (v: boolean) => void,
  setSelectedRowId: (id: string) => void,
  downloadItem: (id: string) => Promise<void>,
): ColumnDef<MaintenanceTableRow>[] => [
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
    cell: ({ row }) => {
      const selectedRowId = row.original.id;

      const menuItems = getMaintenanceTableMenuItems(
        selectedRowId,
        setShowUpdateMaintenanceDialog,
        setShowActionDialog,
        setShowDeleteDialog,
        setSelectedRowId,
        downloadItem,
      );

      return (
        <div className="text-right" onClick={(e) => e.stopPropagation()}>
          <DropdownMenuButtonDialog data={row.original} menuItems={menuItems} />
        </div>
      );
    },
  },
];
