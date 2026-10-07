// $ This component renders the columns for the completed jobs

import type { ColumnDef } from "@tanstack/react-table";
import type {
  // ActionTableRow,
  JobcardPresignedUrlResponse,
  ActionAPIResponse,
} from "@/schemas";
import { DropdownMenuButtonDialog } from "../modals/DropdownMenuButtonDialog";
import { getTableMenuItems } from "@/lib/getTableMenuItems";
import { ChevronDown } from "lucide-react";
import { AssetsDropdownCell } from "../features/tables/AssetsDropdownCell";
import { ExpenseItemsDropdownCell } from "../features/tables/ExpenseItemsDropdownCell";

export const getJobCompletedColumns = (
  setSelectedRowId: (id: string) => void,
  downloadItem: (id: string) => Promise<JobcardPresignedUrlResponse>,
  setOpenChatSidebar: (v: boolean) => void,
): ColumnDef<ActionAPIResponse>[] => [
  {
    accessorKey: "actionCreated",
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
    cell: ({ getValue }) => (
      <p className="">
        {new Date(getValue<string>()).toLocaleString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })}
      </p>
    ),
    size: 140,
    minSize: 120,
    maxSize: 160,
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
    accessorKey: "assets",
    header: "Equipment | Asset ID",
    enableColumnFilter: false,
    cell: ({ row }) => {
      const assets = row.original.assets?.length
        ? row.original.assets
        : [
            {
              equipment: row.original.equipment ?? "Equipment",
              assetID: row.original.assetID,
            },
          ];

      return <AssetsDropdownCell assets={assets} />;
    },
  },
  {
    accessorKey: "start_time",
    header: "Start Date",
    cell: ({ getValue }) => (
      <p className="">
        {new Date(getValue<string>()).toLocaleString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })}
      </p>
    ),
    enableColumnFilter: true,
  },
  {
    accessorKey: "end_time",
    header: "End Date",
    cell: ({ getValue }) => (
      <p className="">
        {new Date(getValue<string>()).toLocaleString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })}
      </p>
    ),
    enableColumnFilter: true,
  },
  {
    accessorKey: "jobcardNumber",
    header: "Jobcard No.",
    size: 140,
    minSize: 10,
    maxSize: 160,
    enableColumnFilter: true,
  },
  {
    accessorKey: "actioned_by",
    header: "Actioned By",
    size: 140,
    minSize: 120,
    maxSize: 160,
    enableColumnFilter: true,
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return <p className="capitalize">{value}</p>;
    },
  },
  {
    accessorKey: "parts",
    header: "Parts",
    enableColumnFilter: false,
    cell: ({ row }) => (
      <ExpenseItemsDropdownCell
        label="Parts"
        value={row.original.parts}
        total={row.original.total_cost_parts}
      />
    ),
    minSize: 110,
    maxSize: 140,
  },
  {
    accessorKey: "sundries",
    header: "Sundries",
    enableColumnFilter: false,
    cell: ({ row }) => (
      <ExpenseItemsDropdownCell
        label="Sundries"
        value={row.original.sundries}
        total={row.original.total_cost_sundries}
      />
    ),
    minSize: 120,
    maxSize: 150,
  },
  {
    accessorKey: "contractor",
    header: "Contractor",
    enableColumnFilter: true,
    cell: ({ getValue }) => {
      const value = getValue<string | undefined>();
      return <p className="capitalize">{value?.trim() || "-"}</p>;
    },
    minSize: 100,
    maxSize: 140,
  },
  {
    id: "actions",
    header: "Actions",
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => {
      const rowId = row.original.id;
      const request_id = row.original.request_id;

      const menuItems = getTableMenuItems({
        rowId: row.original.id,
        request_id: row.original.request_id,
        setSelectedRowId,
        download: {
          url: `/jobs/${rowId}/jobcard`,
          onDownload: () => {
            downloadItem(rowId);
          },
        },
        comments: {
          url: `/api/comments/${request_id}`,
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
