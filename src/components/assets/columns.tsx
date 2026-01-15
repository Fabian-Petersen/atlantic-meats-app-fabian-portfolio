// $ This component renders the columns for the Assets Table.

import type { ColumnDef } from "@tanstack/react-table";
import type { AssetFormValues } from "@/schemas";
import { DropdownMenuButtonDialog } from "../modals/DropdownMenuButtonDialog";
import type { TableMenuProps } from "@/data/TableMenuItems";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
type EquipmentCondition = "operational" | "new" | "poor" | "broken";

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
  menuStateActions: TableMenuProps[]
): ColumnDef<AssetFormValues>[] => [
  {
    accessorKey: "createdAt",
    header: "Date Created",
    // sortingFn: "datetime",
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
  },
  {
    accessorKey: "equipment",
    header: "Equipment",
  },
  {
    accessorKey: "assetID",
    header: "Asset ID",
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "serialNumber",
    header: "Serial Number",
  },
  {
    accessorKey: "condition",
    header: "Condition",
    cell: ({ getValue }) => {
      const value = getValue<string>();

      return (
        <p
          className={`capitalize px-1.5 py-2 w-24 min-w-fit text-center rounded-full ${getConditionClasses(
            value as EquipmentCondition
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
    cell: ({ row }) => (
      <div className="w-fit text-center" onClick={(e) => e.stopPropagation()}>
        <DropdownMenuButtonDialog
          data={row.original}
          menuStateActions={menuStateActions}
        />
      </div>
    ),
  },
];
