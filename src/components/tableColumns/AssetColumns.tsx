// $ This component renders the columns for the Assets Table.

import type { ColumnDef } from "@tanstack/react-table";
import type { AssetTableRow } from "@/schemas";
import { DropdownMenuButtonDialog } from "../modals/DropdownMenuButtonDialog";
import { getTableMenuItems } from "@/lib/getTableMenuItems";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
type EquipmentCondition = "operational" | "new" | "poor" | "broken";

import type { Resource } from "@/utils/api";
import { Badge } from "../features/Badge";
import { badgeStyles } from "@/styles/badgeStyles";

export const getAssetColumns = (
  showUpdateAssetDialog: boolean, // remove this again, only for testing
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
            console.log(showUpdateAssetDialog);
            console.log("rowId:", rowId);
            setSelectedRowId(rowId);
          },
        },
        delete: {
          config: {
            resourcePath: "assets-data",
            queryKey: ["assetRequests"],
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
