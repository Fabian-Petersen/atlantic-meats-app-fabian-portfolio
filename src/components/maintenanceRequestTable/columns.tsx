import type { ColumnDef } from "@tanstack/react-table";
import type { JobAPIResponse, JobcardPresignedUrlResponse } from "@/schemas";
import { DropdownMenuButtonDialog } from "../modals/DropdownMenuButtonDialog";
import { getMaintenanceTableMenuItems } from "@/lib/JobTableActionLinks";
import type { Resource } from "@/utils/api";
import { type Priority } from "@/lib/getPriorityClasses";
import { PriorityBadge } from "../features/PriorityBadge";

export const getMaintenanceColumns = (
  setShowUpdateMaintenanceDialog: (v: boolean) => void,
  setShowActionDialog: (v: boolean) => void,
  setSelectedRowId: (id: string) => void,
  downloadItem: (id: string) => Promise<JobcardPresignedUrlResponse>,
  openDeleteDialog: (
    selectedRowId: string,
    config: { resourcePath: Resource; queryKey: readonly unknown[] },
  ) => void,
  setOpenChatSidebar: (v: boolean) => void,
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
      );
      return (
        <div className="tex-center" onClick={(e) => e.stopPropagation()}>
          <DropdownMenuButtonDialog menuItems={menuItems} />
        </div>
      );
    },
  },
];

// $ ================================ Dashhboard Columns ================================

export const getDashboardJobColumns = (): ColumnDef<JobAPIResponse>[] => [
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
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return <p className="capitalize">{value}</p>;
    },
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
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return <PriorityBadge value={value as Priority} />;
    },
  },
  {
    accessorKey: "requested_by",
    header: "Requested By",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return <p className="capitalize">{value}</p>;
    },
  },
];
