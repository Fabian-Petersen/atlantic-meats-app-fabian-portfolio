import type { ColumnDef } from "@tanstack/react-table";
import type { MaintenanceTableRow } from "@/schemas";
import { DropdownMenuButtonDialog } from "../modals/DropdownMenuButtonDialog";
import { getMaintenanceTableMenuItems } from "@/lib/TableMenuItemsActions";
import type { Resource } from "@/utils/api";

export const getMaintenanceColumns = (
  setShowUpdateMaintenanceDialog: (v: boolean) => void,
  setShowActionDialog: (v: boolean) => void,
  setSelectedRowId: (id: string) => void,
  downloadItem: (id: string) => Promise<void>,
  openDeleteDialog: (
    selectedRowId: string,
    config: { resourcePath: Resource; queryKey: readonly unknown[] },
  ) => void,
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
    enableColumnFilter: true,
  },
  {
    accessorKey: "impact",
    header: "Impact",
  },
  { accessorKey: "status", header: "Status", enableColumnFilter: true },
  {
    accessorKey: "priority",
    header: "Priority",
    enableColumnFilter: true,
  },
  {
    accessorKey: "location",
    header: "Location",
    enableColumnFilter: true,
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
        setSelectedRowId,
        downloadItem,
        openDeleteDialog,
      );

      return (
        <div className="text-right" onClick={(e) => e.stopPropagation()}>
          <DropdownMenuButtonDialog data={row.original} menuItems={menuItems} />
        </div>
      );
    },
  },
];
