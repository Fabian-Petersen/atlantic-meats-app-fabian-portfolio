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
    size: 30,
    minSize: 20,
    maxSize: 100,
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return (
        <p
          className={`capitalize text-cxs ${getConditionClasses(
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
            queryKey: ["jobs", "pending"],
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
  const generalStyles =
    "border min-w-12 w-fit rounded-full max-w-fit text-xs p-[0.135rem] text-center px-[0.40rem]";
  switch (priority.toLocaleLowerCase()) {
    case "critical":
      return `text-red-600 bg-red-300/30 border-red-300 dark:border-red-500 dark:bg-red-300/20 dark:text-red-300 ${generalStyles}`;
    case "high":
      return `text-orange-600 bg-orange-300/30 border-orange-300  dark:border-orange-500 dark:bg-orange-300/20 dark:text-orange-300 ${generalStyles}`;
    case "medium":
      return `text-blue-600 bg-blue-300/30 border-blue-300 dark:border-blue-500 dark:bg-blue-300/20 dark:text-blue-300 ${generalStyles}`;
    case "low":
      return `text-green-600 bg-green-300/30 border-green-300 dark:border-green-500 dark:bg-green-300/20 dark:text-green-300 ${generalStyles}`;
    default:
      return `text-gray-400 bg-gray-100 border border-gray-500 ${generalStyles}`;
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
