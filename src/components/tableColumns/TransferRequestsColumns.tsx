import type { ColumnDef } from "@tanstack/react-table";
import type { TransferResponseValues, Priority } from "@/schemas";
import { DropdownMenuButtonDialog } from "../modals/DropdownMenuButtonDialog";
import { getTableMenuItems } from "@/lib/getTableMenuItems";
import type { Resource } from "@/utils/api";
import { ChevronDown } from "lucide-react";
import { badgeStyles } from "@/styles/badgeStyles";
import { Badge } from "../features/Badge";
import type { NavigateFunction } from "react-router-dom";

type TransferStatus =
  | "pending"
  | "aproved"
  | "cancelled"
  | "in-transit"
  | "rejected"
  | "receipted";
export const getTransferRequestsColumns = (
  setShowUpdateMaintenanceDialog: (v: boolean) => void,
  setSelectedRowId: (id: string) => void,
  openDeleteDialog: (
    selectedRowId: string,
    config: { resourcePath: Resource; queryKey: readonly unknown[] },
  ) => void,
  setOpenChatSidebar: (v: boolean) => void,
  navigate: NavigateFunction,
): ColumnDef<TransferResponseValues>[] => [
  {
    accessorKey: "transferCreated",
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
    accessorKey: "locationFrom",
    header: "Location From",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return <p className="capitalize">{value}</p>;
    },
  },
  {
    accessorKey: "locationTo",
    header: "Location To",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return <p className="capitalize">{value}</p>;
    },
  },
  {
    accessorKey: "area",
    header: "Area",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return <p className="capitalize">{value}</p>;
    },
  },
  {
    accessorKey: "equipment",
    header: "Equipment",
    enableColumnFilter: true,
  },
  {
    accessorKey: "assetID",
    header: "Asset ID",
    size: 120,
    minSize: 100,
    maxSize: 140,
  },
  {
    accessorKey: "expectedDate",
    header: "Transfer Date",
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
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return (
        <Badge
          value={value as TransferStatus}
          styleMap={badgeStyles.families.transfer_status}
          className="capitalize"
        />
      );
    },
  },
  {
    accessorKey: "requested_by",
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
        rowId: row.original.id,
        status: row.original.status,
        setSelectedRowId,

        edit: {
          url: "/update-request",
          onOpen: () => {
            setShowUpdateMaintenanceDialog(true);
            setSelectedRowId(rowId);
          },
        },

        transit: {
          url: "/transfers/in-transit",
          onOpen: () => {
            setSelectedRowId(rowId);
            navigate(`/transfers/${rowId}/in-transit`);
          },
        },

        delete: {
          config: {
            resourcePath: "api/jobs",
            queryKey: ["jobs", "delete-pending"],
            resourceName: "request",
          },
          onDelete: openDeleteDialog,
        },

        comments: {
          url: `/api/jobs/pending/${rowId}/comments`,
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

// $ ================================ Dashboard Columns ================================

export const getDashboardJobColumns =
  (): ColumnDef<TransferResponseValues>[] => [
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
    },
    {
      accessorKey: "equipment",
      header: "Equipment",
    },
    {
      accessorKey: "assetID",
      header: "AssetID",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const value = getValue<string>();
        return <p className="capitalize">{value}</p>;
      },
    },
    {
      accessorKey: "priority",
      header: "Priority",
      size: 30,
      minSize: 30,
      maxSize: 50,
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
      size: 80,
      minSize: 80,
      maxSize: 100,
      cell: ({ getValue }) => {
        const value = getValue<string>();
        return <p className="capitalize">{value}</p>;
      },
    },
  ];
