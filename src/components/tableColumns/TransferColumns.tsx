// $ This component renders the columns for the Transfer Requests with Status "Pending" and "Approved".

import type { ColumnDef } from "@tanstack/react-table";
import type { TransferPendingTableRow } from "@/schemas";
import { DropdownMenuButtonDialog } from "../modals/DropdownMenuButtonDialog";
import { getTableMenuItems } from "@/lib/getTableMenuItems";
import type { NavigateFunction } from "react-router-dom";
import { AssetsDropdownCell } from "../features/tables/AssetsDropdownCell";
import type { AssetItem } from "@/schemas/transfersSchemas";

type TransferStatus = "pending" | "approved" | "rejected" | "cancelled";

import type { Resource } from "@/utils/api";
import { Badge } from "../features/Badge";
import { badgeStyles } from "@/styles/badgeStyles";

export const getTransferColumns = (
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
): ColumnDef<TransferPendingTableRow>[] => [
  {
    accessorKey: "transferCreated",
    header: "Date Created",
    cell: ({ getValue }) => <p>{getValue<string>()}</p>,
    size: 140,
    minSize: 120,
    maxSize: 160,
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
    accessorKey: "assets",
    header: "Equipment / Asset ID",
    cell: ({ getValue }) => {
      const assets = getValue<AssetItem[]>() ?? [];

      if (assets.length === 0) return <p>—</p>;

      if (assets.length === 1) {
        const { equipment, assetID } = assets[0];
        return (
          <p className="capitalize">
            {equipment}{" "}
            <span className="text-muted-foreground">({assetID})</span>
          </p>
        );
      }

      return <AssetsDropdownCell assets={assets} />;
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
    accessorKey: "expectedDate",
    header: "Expected Transfer Date",
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
  // $ This is the actions column in the table with the delete, edit and delete logic
  {
    id: "actions",
    header: "Actions", // or "Actions"
    enableSorting: false,
    enableHiding: false,
    size: 10,
    cell: ({ row }) => {
      const rowId = row.original.id;

      const menuItems = getTableMenuItems({
        rowId: row.original.id,
        setSelectedRowId,
        edit: {
          url: `api/transfers/${rowId}`,
          onOpen: () => {
            setShowUpdateAssetDialog(true);
            // console.log(showUpdateAssetDialog);
            // console.log("rowId:", rowId);
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
