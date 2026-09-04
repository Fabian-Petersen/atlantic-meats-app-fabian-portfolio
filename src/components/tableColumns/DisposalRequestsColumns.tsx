import type { ColumnDef } from "@tanstack/react-table";
import type { NavigateFunction } from "react-router-dom";
import { ChevronDown } from "lucide-react";

import type {
  DisposalPendingTableRow,
  DisposalStatus,
} from "@/schemas/disposalsSchemas";
import { AssetsDropdownCell } from "@/components/features/tables/AssetsDropdownCell";
import { Badge } from "@/components/features/Badge";
import { DropdownMenuButtonDialog } from "@/components/modals/DropdownMenuButtonDialog";
import { getTableMenuItems } from "@/lib/getTableMenuItems";
import { badgeStyles } from "@/styles/badgeStyles";
import type { Resource } from "@/utils/api";

export const getDisposalRequestsColumns = (
  setShowUpdateMaintenanceDialog: (value: boolean) => void,
  setSelectedRowId: (id: string) => void,
  openDeleteDialog: (
    selectedRowId: string,
    config: { resourcePath: Resource; queryKey: readonly unknown[] },
  ) => void,
  setOpenChatSidebar: (value: boolean) => void,
  navigate: NavigateFunction,
): ColumnDef<DisposalPendingTableRow>[] => [
  {
    accessorKey: "disposalCreated",
    header: ({ column }) => {
      const sorted = column.getIsSorted();
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
    cell: ({ getValue }) => <p className="capitalize">{getValue<string>()}</p>,
  },
  {
    accessorKey: "disposalReason",
    header: "Disposal Reason",
    cell: ({ getValue }) => <p className="capitalize">{getValue<string>()}</p>,
  },
  {
    accessorKey: "assets",
    header: "Equipment | Asset ID",
    cell: ({ getValue }) => (
      <AssetsDropdownCell
        assets={getValue<DisposalPendingTableRow["assets"]>()}
      />
    ),
  },
  {
    accessorKey: "expectedDisposalDate",
    header: "Disposal Date",
    cell: ({ getValue }) => <p>{getValue<string>()}</p>,
    size: 140,
    minSize: 120,
    maxSize: 160,
  },
  {
    accessorKey: "status",
    header: "Status",
    size: 120,
    minSize: 100,
    maxSize: 140,
    cell: ({ getValue }) => (
      <Badge
        value={getValue<DisposalStatus>()}
        styleMap={badgeStyles.families.transfer_status}
        className="capitalize"
      />
    ),
  },
  {
    accessorKey: "requestedBy",
    header: "Requested By",
    size: 120,
    minSize: 100,
    maxSize: 140,
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
    size: 20,
    minSize: 20,
    maxSize: 100,
    cell: ({ row }) => {
      const rowId = row.original.id;
      const menuItems = getTableMenuItems({
        rowId,
        status: row.original.status,
        setSelectedRowId,
        edit: {
          url: "/disposals/update-request",
          onOpen: () => {
            setShowUpdateMaintenanceDialog(true);
            setSelectedRowId(rowId);
          },
        },
        view: {
          url: `/disposals/${rowId}`,
          onOpen: () => navigate(`/disposals/${rowId}`),
        },
        delete: {
          config: {
            resourcePath: "api/disposals/requests",
            queryKey: ["disposals", "delete-request"],
            resourceName: "disposal request",
          },
          onDelete: openDeleteDialog,
        },
        comments: {
          url: `/api/disposals/requests/${rowId}/comments`,
          onOpen: () => setOpenChatSidebar(true),
        },
      });

      return (
        <div
          className="text-center"
          onClick={(event) => event.stopPropagation()}
        >
          <DropdownMenuButtonDialog menuItems={menuItems} />
        </div>
      );
    },
  },
];
