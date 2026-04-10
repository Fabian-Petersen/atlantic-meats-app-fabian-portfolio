import type { ColumnDef } from "@tanstack/react-table";
import type { JobAPIResponse } from "@/schemas";
import { DropdownMenuButtonDialog } from "../modals/DropdownMenuButtonDialog";
import { getTableMenuItems } from "@/lib/getTableMenuItems";
import type { Resource } from "@/utils/api";
type Priority = "critical" | "high" | "medium" | "low";

export const getJobPendingColumns = (
  setShowUpdateMaintenanceDialog: (v: boolean) => void,
  setSelectedRowId: (id: string) => void,
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
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return <p className="capitalize">{value}</p>;
    },
  },
  {
    accessorKey: "assetID",
    header: "AssetID",
    enableColumnFilter: true,
  },
  // {
  //   accessorKey: "area",
  //   header: "Area",
  //   enableColumnFilter: true,
  //   cell: ({ getValue }) => {
  //     const value = getValue<string>();
  //     return <p className="capitalize">{value}</p>;
  //   },
  // },
  {
    accessorKey: "requested_by",
    header: "Requested By",
    enableColumnFilter: true,
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return <p className="capitalize">{value}</p>;
    },
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
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return (
        <p
          className={`capitalize text-xs ${getConditionClasses(
            value as Priority,
          )}`}
        >
          {value}
        </p>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    enableSorting: false,
    enableHiding: false,
    size: 20,
    minSize: 20,
    maxSize: 100,

    cell: ({ row }) => {
      const rowId = row.original.id;

      const menuItems = getTableMenuItems({
        rowId: row.original.id,
        setSelectedRowId,

        edit: {
          url: "/update-request",
          onOpen: () => {
            setShowUpdateMaintenanceDialog(true);
            setSelectedRowId(rowId);
          },
        },

        delete: {
          config: {
            resourcePath: "jobs/pending",
            queryKey: ["maintenanceRequests"],
            resourceName: "request",
          },
          onDelete: openDeleteDialog,
        },

        comments: {
          url: `/jobs/pending/${rowId}/comments`,
          onOpen: () => {
            setOpenChatSidebar(true);
          },
        },
      });

      return (
        <div className="tex-center" onClick={(e) => e.stopPropagation()}>
          <DropdownMenuButtonDialog menuItems={menuItems} />
        </div>
      );
    },
  },
];

// border-red-200 dark:border-red-500 text-red-600 dark:bg-red-300/20 dark:text-red-300

function getConditionClasses(priority: Priority) {
  switch (priority.toLocaleLowerCase()) {
    case "critical":
      return "text-red-600 border-red-300 bg-red-300/30 dark:border-red-500 dark:bg-red-300/20 dark:text-red-300 border min-w-fit w-fit rounded-full text-xs p-[0.135rem] text-center px-[0.40rem]";
    case "high":
      return "text-purple-600 border-purple-300 bg-purple-300/30 dark:border-purple-500 dark:bg-blue-300/20 dark:text-blue-300 border min-w-fit rounded-full w-fit p-[0.135rem] text-xs text-center";
    case "medium":
      return "text-blue-600 bg-blue-300 bg-blue-300/30 border dark:border-blue-500 dark:bg-blue-300/20 dark:text-blue-300 max-w-fit rounded-full w-fit p-[0.135rem] text-xs text-center";
    case "low":
      return "text-green-500 bg-green-100 border border-green-500 w-12 rounded-full min-w-fit p-[0.135rem] text-xs text-center";
    default:
      return "text-gray-400 bg-gray-100 border border-gray-500 max-w-fit rounded-full w-fit p-0.5 text-xs text-center";
  }
}

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
      return (
        <p
          className={`capitalize text-xs ${getConditionClasses(
            value as Priority,
          )}`}
        >
          {value}
        </p>
      );
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
