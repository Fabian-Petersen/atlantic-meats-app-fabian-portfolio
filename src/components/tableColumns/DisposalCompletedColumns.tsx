// Columns for completed disposal requests.

import type { ColumnDef } from "@tanstack/react-table";
import type { DisposalWorkflowResponse } from "@/schemas/disposalsSchemas";
import { DropdownMenuButtonDialog } from "../modals/DropdownMenuButtonDialog";
import { getTableMenuItems } from "@/lib/getTableMenuItems";
import type { NavigateFunction } from "react-router-dom";
import { ChevronDown } from "lucide-react";

// Derive completion fields directly from the API schema without duplicating it.
export type DisposalCompletedTableRow = DisposalWorkflowResponse &
  NonNullable<DisposalWorkflowResponse["disposed"]>;

import { Badge } from "../features/Badge";
import { badgeStyles } from "@/styles/badgeStyles";

export const getDisposalCompletedColumns = (
  setSelectedRowId: (id: string) => void,
  navigate: NavigateFunction,
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
    id: "assetID",
    accessorFn: (row) =>
      row.assets.map((asset) => asset.assetID || "Unidentified").join(", "),
    header: "Asset ID",
    size: 120,
    minSize: 100,
    maxSize: 140,
  },
  {
    id: "equipment",
    accessorFn: (row) => row.assets.map((asset) => asset.equipment).join(", "),
    header: "Equipment",
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
    accessorKey: "disposalLocation",
    header: "Disposal Location",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return <p className="capitalize">{value || "-"}</p>;
    },
  },
  {
    accessorKey: "disposalNotes",
    header: "Disposal Notes",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return <p className="capitalize">{value || "-"}</p>;
    },
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
  },
  {
    id: "disposalImages",
    accessorFn: (row) =>
      row.disposalImages.map((file) => file.filename).join(", "),
    header: "Disposal Photos",
    cell: ({ getValue }) => getValue<string>() || "-",
  },
  {
    id: "disposalDocuments",
    accessorFn: (row) =>
      row.disposalDocuments.map((file) => file.filename).join(", "),
    header: "Supporting Documents",
    cell: ({ getValue }) => getValue<string>() || "-",
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
      });

      return (
        <div className="text-center" onClick={(e) => e.stopPropagation()}>
          <DropdownMenuButtonDialog menuItems={menuItems} />
        </div>
      );
    },
  },
];
