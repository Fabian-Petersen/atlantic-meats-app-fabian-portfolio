// $ This component renders the columns for the Assets Table.

import type { ColumnDef } from "@tanstack/react-table";
import type { TransferTransitTableRow } from "@/schemas";
import { DropdownMenuButtonDialog } from "../modals/DropdownMenuButtonDialog";
import { getTableMenuItems } from "@/lib/getTableMenuItems";
import type { NavigateFunction } from "react-router-dom";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
type EquipmentCondition = "operational" | "new" | "poor" | "broken";

import type { Resource } from "@/utils/api";
import { Badge } from "../features/Badge";
import { badgeStyles } from "@/styles/badgeStyles";

export const getTransferTransitColumns = (
  setShowUpdateAssetDialog: (v: boolean) => void,
  setSelectedRowId: (id: string) => void,
  openDeleteDialog: (
    selectedRowId: string,
    config: {
      resourcePath: Resource;
      queryKey: readonly unknown[];
      resourceName?: string;
    },
  ) => void,
  navigate: NavigateFunction,
): ColumnDef<TransferTransitTableRow>[] => [
  {
    accessorKey: "dateCreated",
    header: "Date Created",
    cell: ({ getValue }) => <p>{getValue<string>()}</p>,
    size: 140,
    minSize: 120,
    maxSize: 160,
  },
  {
    accessorKey: "assetID",
    header: "Asset ID",
    size: 120,
    minSize: 100,
    maxSize: 140,
  },
  {
    accessorKey: "equipment",
    header: "Equipment",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return <p className="capitalize">{value}</p>;
    },
  },
  {
    accessorKey: "transportType",
    header: "Transport Type",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return <p className="capitalize">{value}</p>;
    },
  },
  {
    accessorKey: "transportName",
    header: "Transport Name",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return <p className="capitalize">{value}</p>;
    },
  },
  {
    accessorKey: "trackingNumber",
    header: "Trancking Number",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return <p className="capitalize">{value}</p>;
    },
  },
  {
    accessorKey: "transportCost",
    header: "Cost",
    enableColumnFilter: true,
  },
  {
    accessorKey: "transportDate",
    header: "Transport Date",
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
          value={value as EquipmentCondition}
          styleMap={badgeStyles.families.transfer_status}
          className="capitalize"
        />
      );
    },
  },
  // $ This is the actions column in the table with the delete, edit and delete logic
  {
    id: "actions",
    header: "Actions", // or "Actions"
    enableSorting: false,
    enableHiding: false,
    size: 10,
    cell: ({ row }) => {
      const rowId = row.original.transitId;

      const menuItems = getTableMenuItems({
        rowId: row.original.transitId,
        setSelectedRowId,
        edit: {
          url: `api/transfers/${rowId}`,
          onOpen: () => {
            setShowUpdateAssetDialog(true);
            setSelectedRowId(rowId);
          },
        },
        history: {
          url: `/assets/${rowId}/history`,
          config: {
            resourcePath: `api/assets/${rowId}/history`,
            queryKey: ["assets", "asset-history"],
            resourceName: "asset",
          },
          onOpen: () => {
            setSelectedRowId(rowId);
            navigate(`/assets/${rowId}/history`);
            // console.log("history:", rowId);
          },
        },
        delete: {
          config: {
            resourcePath: `api/transfers/${rowId}`,
            queryKey: ["transfers", "transfer-delete"],
            resourceName: "transfer",
          },
          onDelete: openDeleteDialog,
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
