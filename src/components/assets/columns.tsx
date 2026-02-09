// $ This component renders the columns for the Assets Table.

import type { ColumnDef } from "@tanstack/react-table";
import type { AssetTableRow } from "@/schemas";
import { DropdownMenuButtonDialog } from "../modals/DropdownMenuButtonDialog";
import { getAssetTableMenuItems } from "@/lib/TableMenuItemsActions";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
type EquipmentCondition = "operational" | "new" | "poor" | "broken";
import type { Resource } from "@/utils/api";

function getConditionClasses(condition: EquipmentCondition) {
  switch (condition.toLowerCase()) {
    case "operational":
      return "text-green-700 bg-green-300/60";
    case "new":
      return "text-blue-700 bg-blue-300/60";
    case "poor":
      return "text-orange-700 bg-orange-300/60";
    case "broken":
      return "text-red-700 bg-red-300/60";
    default:
      return "text-gray-700 bg-gray-200";
  }
}

export const getAssetColumns = (
  setShowUpdateAssetDialog: (v: boolean) => void,
  // setShowDeleteDialog: (v: boolean) => void,
  setSelectedRowId: (id: string) => void,
  openDeleteDialog: (
    selectedRowId: string,
    config: { resourcePath: Resource; queryKey: readonly unknown[] },
  ) => void,
): ColumnDef<AssetTableRow>[] => [
  {
    accessorKey: "createdAt",
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
    accessorKey: "equipment",
    header: "Equipment",
    enableColumnFilter: true,
  },
  {
    accessorKey: "assetID",
    header: "Asset ID",
    size: 140,
    minSize: 120,
    maxSize: 160,
    enableColumnFilter: true,
  },
  {
    accessorKey: "location",
    header: "Location",
    enableColumnFilter: true,
  },
  {
    accessorKey: "serialNumber",
    header: "Serial Number",
  },
  {
    accessorKey: "condition",
    header: "Condition",
    enableColumnFilter: true,
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return (
        <p
          className={`capitalize px-1.5 py-2 text-center rounded-full ${getConditionClasses(
            value as EquipmentCondition,
          )}`}
        >
          {value}
        </p>
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

      const menuItems = getAssetTableMenuItems(
        rowId,
        setSelectedRowId,
        setShowUpdateAssetDialog,
        openDeleteDialog,
      );

      return (
        <div className="text-center" onClick={(e) => e.stopPropagation()}>
          <DropdownMenuButtonDialog data={row.original} menuItems={menuItems} />
        </div>
      );
    },
  },
];
