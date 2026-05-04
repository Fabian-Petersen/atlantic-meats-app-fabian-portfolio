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

export const getJobActionColumns = (
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
    accessorKey: "start_time",
    header: "Start Date",
    enableColumnFilter: true,
  },
  {
    accessorKey: "end_time",
    header: "End Date",
    enableColumnFilter: true,
  },
  {
    accessorKey: "total_km",
    header: "Total Km",
  },
  {
    accessorKey: "work_order_number",
    header: "Works Order #",
    size: 140,
    minSize: 120,
    maxSize: 160,
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
    accessorKey: "requested_by",
    header: "Requested By",
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
          url: `/comments/${request_id}`,
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
