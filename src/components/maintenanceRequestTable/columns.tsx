import type { ColumnDef } from "@tanstack/react-table";
import type { JobAPIResponse } from "@/schemas";
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
  setOpenChatSidebar: (v: boolean) => void,
  openChatSidebar: boolean,
): ColumnDef<JobAPIResponse>[] => [
  {
    accessorKey: "jobCreated",
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
    accessorKey: "location",
    header: "Location",
    enableColumnFilter: true,
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "equipment",
    header: "Equipment",
    enableColumnFilter: false,
  },
  {
    accessorKey: "assetID",
    header: "AssetID",
    enableColumnFilter: true,
  },
  {
    accessorKey: "impact",
    header: "Impact",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return <p className="capitalize">{value}</p>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    enableColumnFilter: true,
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return <p className="capitalize">{value}</p>;
    },
  },
  {
    accessorKey: "priority",
    header: "Priority",
    enableColumnFilter: true,
  },
  // {
  //   accessorKey: "additional_notes",
  //   header: "Additional Notes",
  // },
  // {
  //   accessorKey: "type",
  //   header: "Type",
  // },
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
        setOpenChatSidebar,
        openChatSidebar,
      );
      return (
        <div className="tex-center" onClick={(e) => e.stopPropagation()}>
          <DropdownMenuButtonDialog data={row.original} menuItems={menuItems} />
        </div>
      );
    },
  },
];
