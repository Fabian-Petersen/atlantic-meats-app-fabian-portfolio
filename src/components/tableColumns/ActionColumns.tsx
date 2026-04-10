// $ This component renders the columns for the completed jobs

import type { ColumnDef } from "@tanstack/react-table";
import type { ActionTableRow, JobcardPresignedUrlResponse } from "@/schemas";
import { DropdownMenuButtonDialog } from "../modals/DropdownMenuButtonDialog";
import { getTableMenuItems } from "@/lib/getTableMenuItems";

type StatusCondition = "in progess" | "complete";

function getConditionClasses(condition: StatusCondition) {
  switch (condition.toLowerCase()) {
    case "complete":
      return "text-green-700 bg-green-300/60";
    case "in progess":
      return "text-red-700 bg-red-300/60";
    default:
      return "text-gray-400 bg-gray-200";
  }
}
export const getJobActionColumns = (
  // setShowUpdateMaintenanceDialog: (v: boolean) => void,
  // setShowActionDialog: (v: boolean) => void,
  setSelectedRowId: (id: string) => void,
  downloadItem: (id: string) => Promise<JobcardPresignedUrlResponse>,
  // openDeleteDialog: (
  //   selectedRowId: string,
  //   config: { resourcePath: Resource; queryKey: readonly unknown[] },
  // ) => void,
  setOpenChatSidebar: (v: boolean) => void,
): ColumnDef<ActionTableRow>[] => [
  {
    accessorKey: "actionCreated",
    header: "Date Created",
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
    header: "Jobcard Number",
    size: 140,
    minSize: 120,
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
    accessorKey: "status",
    header: "Status",
    enableColumnFilter: true,
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return (
        <p
          className={`capitalize text-xs min-w-fit px-2 py-2.5 text-center rounded-full ${getConditionClasses(
            value as StatusCondition,
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
    cell: ({ row }) => {
      const rowId = row.original.id;
      const request_id = row.original.request_id;

      const menuItems = getTableMenuItems({
        rowId: row.original.id,
        request_id: row.original.request_id,
        setSelectedRowId,
        download: {
          url: "/jobs/jobcard",
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
