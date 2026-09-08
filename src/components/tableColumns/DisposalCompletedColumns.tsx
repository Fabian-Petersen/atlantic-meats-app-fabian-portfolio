// Columns for completed disposal requests.

import type { ColumnDef } from "@tanstack/react-table";
import type { DisposalWorkflowResponse } from "@/schemas/disposalsSchemas";
import { DropdownMenuButtonDialog } from "../modals/DropdownMenuButtonDialog";
import { getTableMenuItems } from "@/lib/getTableMenuItems";
import type { NavigateFunction } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { AssetsDropdownCell } from "@/components/features/tables/AssetsDropdownCell";

// Derive completion fields directly from the API schema without duplicating it.
export type DisposalCompletedTableRow = DisposalWorkflowResponse &
  NonNullable<DisposalWorkflowResponse["disposed"]>;

import { Badge } from "../features/Badge";
import { badgeStyles } from "@/styles/badgeStyles";

export const getDisposalCompletedColumns = (
  setSelectedRowId: (id: string) => void,
  navigate: NavigateFunction,
  downloadItem: (id: string) => Promise<unknown>,
): ColumnDef<DisposalCompletedTableRow>[] => [
  {
    accessorKey: "disposalCreated",
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
    sortingFn: (a, b, id) =>
      new Date(a.getValue<string>(id)).getTime() -
      new Date(b.getValue<string>(id)).getTime(),
  },
  {
    accessorKey: "disposalLocation",
    accessorFn: (row) => row.pending.location || "Unknown",
    header: "Location",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return <p className="capitalize">{value || "-"}</p>;
    },
  },
  {
    accessorKey: "disposalMethod",
    header: "Disposal Method",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return <p className="capitalize">{value || "-"}</p>;
    },
  },
  {
    id: "assets",
    accessorFn: (row) =>
      row.assets
        .map(
          (asset) =>
            `${asset.equipment} ${asset.assetID?.trim() || "Unidentified"}`,
        )
        .join(", "),
    header: "Equipment | Asset ID",
    cell: ({ row }) => <AssetsDropdownCell assets={row.original.assets} />,
  },
  {
    accessorKey: "disposalCost",
    header: "Disposal Cost (R)",
    cell: ({ getValue }) => {
      const value = getValue<number | null>();
      return value == null
        ? "-"
        : value.toLocaleString("en-ZA", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });
    },
  },
  {
    accessorKey: "disposedDate",
    header: ({ column }) => {
      const sorted = column.getIsSorted(); // false | "asc" | "desc"
      return (
        <button
          type="button"
          className="flex items-center gap-1 select-none hover:cursor-pointer"
          onClick={() => column.toggleSorting(sorted === "asc")}
        >
          <span>Disposed Date</span>
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
      }),
    sortingFn: (a, b, id) =>
      new Date(a.getValue<string>(id)).getTime() -
      new Date(b.getValue<string>(id)).getTime(),
  },
  {
    accessorKey: "disposedBy",
    header: "Disposed By",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return <p className="capitalize">{value || "-"}</p>;
    },
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
          value={value}
          styleMap={{
            disposed: badgeStyles.families.transfer_status.completed,
          }}
          className="capitalize"
        />
      );
    },
  },
  // Open the completed disposal using the workflow ID.
  {
    id: "actions",
    header: "Actions", // or "Actions"
    enableSorting: false,
    enableHiding: false,
    size: 10,
    cell: ({ row }) => {
      const rowId = row.original.id;

      const menuItems = getTableMenuItems({
        rowId,
        setSelectedRowId,
        view: {
          url: `api/disposals/${rowId}`,
          onOpen: () => {
            setSelectedRowId(rowId);
            navigate(`/disposals/${rowId}`);
          },
        },
        download: {
          url: `api/disposals/${rowId}/disposal-document`,
          onDownload: () => {
            downloadItem(rowId);
          },
        },
      });

      return (
        <div className="text-center" onClick={(e) => e.stopPropagation()}>
          <DropdownMenuButtonDialog menuItems={menuItems} />
        </div>
      );
    },
  },
];
