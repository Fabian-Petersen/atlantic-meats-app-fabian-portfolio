// $ This component renders the columns for the Assets Table.

import type { ColumnDef } from "@tanstack/react-table";
import type { AssetTableRow } from "@/schemas";
import { DropdownMenuButtonDialog } from "../modals/DropdownMenuButtonDialog";
import { getTableMenuItems } from "@/lib/getTableMenuItems";
import type { NavigateFunction } from "react-router-dom";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
type EquipmentCondition = "operational" | "new" | "poor" | "broken";

import type { Resource } from "@/utils/api";
import { Badge } from "../features/Badge";
import { badgeStyles } from "@/styles/badgeStyles";

export const getAssetColumns = (
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
): ColumnDef<AssetTableRow>[] => [
  {
    accessorKey: "createdAt",
    header: "Date Created",
    cell: ({ getValue }) => <p>{getValue<string>()}</p>,
    size: 140,
    minSize: 120,
    maxSize: 160,
  },
  {
    accessorKey: "location",
    header: "Location",
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
    accessorKey: "last_verified_at",
    header: "Last Verified",
    size: 120,
    minSize: 100,
    maxSize: 140,
  },
  {
    accessorKey: "next_verification_due",
    header: "Verification Due",
    size: 120,
    minSize: 100,
    maxSize: 140,
  },
  {
    accessorKey: "verified_by",
    header: "verified _by",
    size: 120,
    minSize: 100,
    maxSize: 140,
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return <p className="capitalize">{value}</p>;
    },
  },
  {
    accessorKey: "verify_status",
    header: "Verify Status",
    size: 120,
    minSize: 100,
    maxSize: 140,
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return (
        <Badge
          value={value as EquipmentCondition}
          styleMap={badgeStyles.families.verification}
        />
      );
    },
  },
  {
    accessorKey: "condition",
    header: "Condition",
    size: 150,
    minSize: 100,
    maxSize: 160,
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return (
        <Badge
          value={value as EquipmentCondition}
          styleMap={badgeStyles.families.condition}
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
          url: "/asset",
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
            resourcePath: "api/assets",
            queryKey: ["assets", "asset-elete"],
            resourceName: "asset",
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
