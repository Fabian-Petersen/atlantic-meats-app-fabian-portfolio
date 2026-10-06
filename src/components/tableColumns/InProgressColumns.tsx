import type { ColumnDef } from "@tanstack/react-table";
import type { JobAPIResponse, Priority } from "@/schemas";
import { DropdownMenuButtonDialog } from "../modals/DropdownMenuButtonDialog";
import { getTableMenuItems } from "@/lib/getTableMenuItems";
import type { Resource } from "@/utils/api";
import type { JobApprovedAPIResponse } from "@/schemas/jobSchemas";
import { AlertTriangle, ChevronDown } from "lucide-react";
import { badgeStyles } from "@/styles/badgeStyles";
import { Badge } from "../features/Badge";
import { AssetsDropdownCell } from "../features/tables/AssetsDropdownCell";
import { isTargetDateOverdue } from "@/lib/isTargetDateOverdue";

export const getInProgressColumns = (
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
    accessorKey: "approved_at",
    header: ({ column }) => {
      const sorted = column.getIsSorted(); // false | "asc" | "desc"
      return (
        <button
          type="button"
          className="flex items-center gap-1 select-none hover:cursor-pointer"
          onClick={() => column.toggleSorting(sorted === "asc")}
        >
          <span>Date Approved</span>
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
    accessorKey: "assets",
    header: "Equipment | Asset ID",
    enableColumnFilter: false,
    cell: ({ row }) => {
      const assets = row.original.assets?.length
        ? row.original.assets
        : [
            {
              equipment: row.original.equipment,
              assetID: row.original.assetID,
            },
          ];

      return <AssetsDropdownCell assets={assets} />;
    },
  },
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
      return (
        <Badge
          value={value as Priority}
          styleMap={badgeStyles.families.priority}
        />
      );
    },
    minSize: 80,
    maxSize: 100,
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
    cell: ({ getValue }) => {
      const targetDate = getValue<string>();
      const isOverdue = isTargetDateOverdue(targetDate);

      return (
        <div className="flex flex-wrap items-center gap-2">
          <span>{targetDate}</span>
          {isOverdue && (
            <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-100 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-red-700 dark:border-red-800 dark:bg-red-950/70 dark:text-red-300">
              <AlertTriangle className="size-3" aria-hidden="true" />
              Overdue
            </span>
          )}
        </div>
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
            navigate(`/jobs/${rowId}/in-progress/action`);
            setSelectedRowId(rowId);
          },
        },

        edit: {
          url: `/jobs/${rowId}/in-progress/update`,
          onOpen: () => {
            navigate(`/jobs/${rowId}/in-progress/update`);
            setSelectedRowId(rowId);
          },
        },

        delete: {
          config: {
            resourcePath: "api/jobs",
            queryKey: ["jobs"],
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
        <Badge
          value={value as Priority}
          styleMap={badgeStyles.families.priority}
        />
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
