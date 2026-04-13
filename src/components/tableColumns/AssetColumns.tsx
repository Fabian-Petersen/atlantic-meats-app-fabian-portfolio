// $ This component renders the columns for the Assets Table.

import type { ColumnDef } from "@tanstack/react-table";
import type { AssetTableRow } from "@/schemas";
import { DropdownMenuButtonDialog } from "../modals/DropdownMenuButtonDialog";
import { getTableMenuItems } from "@/lib/getTableMenuItems";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
type EquipmentCondition = "operational" | "new" | "poor" | "broken";

import type { Resource } from "@/utils/api";

function getConditionClasses(condition: EquipmentCondition) {
  const generalStyles =
    "border min-w-16 w-fit rounded-full max-w-fit py-[0.25rem] text-center px-[0.40rem]";
  switch (condition.toLowerCase()) {
    case "operational":
      return `text-green-600 bg-green-300/30 border-green-300 dark:border-green-500 dark:bg-green-300/20 dark:text-green-300 ${generalStyles}`;
    case "not operational":
      return `text-orange-600 bg-orange-300/30 border-orange-300  dark:border-orange-500 dark:bg-orange-300/20 dark:text-orange-300 ${generalStyles}`;
    case "new":
      return `text-blue-600 bg-blue-300/30 border-blue-300 dark:border-blue-500 dark:bg-blue-300/20 dark:text-blue-300 ${generalStyles}`;
    case "poor":
      return `text-orange-600 bg-orange-300/30 border-orange-300  dark:border-orange-500 dark:bg-orange-300/20 dark:text-orange-300 ${generalStyles}`;
    case "broken":
      return `text-red-600 bg-red-300/30 border-red-300 dark:border-red-500 dark:bg-red-300/20 dark:text-red-300 ${generalStyles}`;
    default:
      return `text-gray-400 bg-gray-100 border border-gray-500 ${generalStyles}`;
  }
}

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
    enableColumnFilter: true,
  },
  {
    accessorKey: "area",
    header: "Area",
    enableColumnFilter: true,
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
    enableColumnFilter: true,
  },
  // {
  //   accessorKey: "serialNumber",
  //   header: "Serial Number",
  // },
  {
    accessorKey: "condition",
    header: "Condition",
    enableColumnFilter: true,
    size: 150,
    minSize: 100,
    maxSize: 160,
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return (
        <p
          className={`capitalize text-cxs ${getConditionClasses(
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

      const menuItems = getTableMenuItems({
        rowId: row.original.id,
        setSelectedRowId,
        edit: {
          url: "/asset",
          onOpen: () => {
            setShowUpdateAssetDialog(true);
            setSelectedRowId(rowId);
          },
        },
        delete: {
          config: {
            resourcePath: "assets",
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
