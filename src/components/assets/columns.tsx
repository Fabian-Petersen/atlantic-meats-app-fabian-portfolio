import type { ColumnDef } from "@tanstack/react-table";
import type { AssetFormValues } from "@/schemas";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
type EquipmentCondition = "operational" | "new" | "poor" | "broken";

function getConditionClasses(condition: EquipmentCondition) {
  switch (condition.toLowerCase()) {
    case "operational":
      return "text-green-700 bg-green-300/70";
    case "new":
      return "text-blue-700 bg-blue-300/70";
    case "poor":
      return "text-orange-700 bg-orange-300/70";
    case "broken":
      return "text-red-700 bg-red-300/70";
    default:
      return "text-gray-700 bg-gray-200";
  }
}

export const columns: ColumnDef<AssetFormValues>[] = [
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
    // sortingFn: "datetime",
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
          className={`capitalize py-1.5 px-2 w-20 text-center rounded-full ${getConditionClasses(
            value as EquipmentCondition
          )}`}
        >
          {value}
        </p>
      );
    },
  },
  // {
  //   accessorKey: "warranty",
  //   header: "Warranty",
  // },
  // {
  //   accessorKey: "warranty_expire",
  //   header: "Warranty Expire",
  // },
  // {
  //   accessorKey: "serialNumber",
  //   header: "Serial Number",
  // },
  // {
  //   accessorKey: "manufacturer",
  //   header: "Manufacturer",
  // },
  // {
  //   accessorKey: "date_of_manufacture",
  //   header: "Date of Manufacture",
  // },
  // {
  //   accessorKey: "model",
  //   header: "Model",
  // },
  // {
  //   accessorKey: "warranty",
  //   header: "Warranty",
  // },
];
