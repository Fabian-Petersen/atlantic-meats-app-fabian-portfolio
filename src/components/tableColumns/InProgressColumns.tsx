import type { ColumnDef } from "@tanstack/react-table";
import type { JobAPIResponse } from "@/schemas";
import { DropdownMenuButtonDialog } from "../modals/DropdownMenuButtonDialog";
import { getTableMenuItems } from "@/lib/getTableMenuItems";
import type { Resource } from "@/utils/api";
import type { JobApprovedAPIResponse } from "@/schemas/jobSchemas";
import { ChevronDown } from "lucide-react";
type Priority = "critical" | "high" | "medium" | "low";

export const getInProgressColumns = (
  setShowUpdateMaintenanceDialog: (v: boolean) => void,
  navigate: (path: string) => void,
  setSelectedRowId: (id: string) => void,
  openDeleteDialog: (
    selectedRowId: string,
    config: { resourcePath: Resource; queryKey: readonly unknown[] },
  ) => void,
  setOpenChatSidebar: (v: boolean) => void,
): ColumnDef<JobApprovedAPIResponse>[] => [
  {
    accessorKey: "jobCreated",
    header: ({ column }) => {
      const sorted = column.getIsSorted(); // false | "asc" | "desc"
      return (
        <button
          type="button"
          className="flex items-center gap-1 select-none hover:cursor-pointer"
          onClick={() => column.toggleSorting(sorted === "asc")}
        >
          <span>Date Created</span>
          <ChevronDown
            className="h-4 w-4 transition-transform duration-200"
            style={{
              transform: sorted === "asc" ? "rotate(180deg)" : "rotate(0deg)",
              opacity: sorted ? 1 : 0.4,
            }}
          />
        </button>
      );
    },
    minSize: 130,
    maxSize: 150,
  },
  {
    accessorKey: "location",
    header: "Location",
    enableColumnFilter: true,
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return <p className="capitalize">{value}</p>;
    },
    minSize: 80,
    maxSize: 100,
  },
  {
    accessorKey: "description",
    header: "Description",
    minSize: 240,
    maxSize: 300,
  },
  {
    accessorKey: "equipment",
    header: "Equipment",
    enableColumnFilter: false,
  },
  // {
  //   accessorKey: "assetID",
  //   header: "AssetID",
  //   enableColumnFilter: true,
  // },
  {
    accessorKey: "impact",
    header: "Impact",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return <p className="capitalize">{value}</p>;
    },
    minSize: 70,
    maxSize: 90,
  },
  // {
  //   accessorKey: "status",
  //   header: "Status",
  //   enableColumnFilter: true,
  //   cell: ({ getValue }) => {
  //     const value = getValue<string>();
  //     return <p className="capitalize">{value}</p>;
  //   },
  // },
  {
    accessorKey: "jobcardNumber",
    header: "Jobcard Number",
    enableColumnFilter: true,
    minSize: 100,
    maxSize: 150,
  },
  {
    accessorKey: "priority",
    header: "Priority",
    enableColumnFilter: true,
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return <p className="capitalize">{value}</p>;
    },
  },
  {
    accessorKey: "assign_to_name",
    header: "Assigned To",
    enableColumnFilter: true,
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return <p className="capitalize">{value}</p>;
    },
    minSize: 100,
    maxSize: 120,
  },
  // {
  //   accessorKey: "assign_to_group",
  //   header: "Group",
  //   cell: ({ getValue }) => {
  //     const value = getValue<string>();
  //     return <p className="capitalize">{value}</p>;
  //   },
  // },
  {
    accessorKey: "targetDate",
    header: ({ column }) => {
      const sorted = column.getIsSorted(); // false | "asc" | "desc"
      return (
        <button
          type="button"
          className="flex items-center gap-1 select-none hover:cursor-pointer"
          onClick={() => column.toggleSorting(sorted === "asc")}
        >
          <span>Target Date</span>
          <ChevronDown
            className="h-4 w-4 transition-transform duration-200"
            style={{
              transform: sorted === "asc" ? "rotate(180deg)" : "rotate(0deg)",
              opacity: sorted ? 1 : 0.4,
            }}
          />
        </button>
      );
    },
    minSize: 130,
    maxSize: 150,
  },
  {
    id: "actions",
    header: "Actions",
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => {
      const rowId = row.original.id;

      const menuItems = getTableMenuItems({
        rowId: row.original.id,
        setSelectedRowId,

        action: {
          url: `/jobs/${rowId}/action`,
          onOpen: () => {
            // setShowActionDialog(true);
            navigate(`/jobs/${rowId}/action`);
            setSelectedRowId(rowId);
          },
        },

        edit: {
          url: "/update-request",
          onOpen: () => {
            setShowUpdateMaintenanceDialog(true);
            setSelectedRowId(rowId);
          },
        },

        delete: {
          config: {
            resourcePath: "jobs",
            queryKey: ["jobs", "delete-inProgess-job"],
            resourceName: "job",
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
    minSize: 60,
    maxSize: 70,
  },
];

function getConditionClasses(priority: Priority) {
  switch (priority.toLocaleLowerCase()) {
    case "critical":
      return "text-red-500";
    case "high":
      return "text-purple-500";
    case "medium":
      return "text-blue-500";
    case "low":
      return "text-green-500";
    default:
      return "text-gray-400";
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
