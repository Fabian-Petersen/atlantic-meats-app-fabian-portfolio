import type { ColumnDef } from "@tanstack/react-table";
import type { AssetFormValues } from "@/schemas";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<AssetFormValues>[] = [
  // {
  //   accessorKey: "id",
  //   header: "ID",
  // },
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
    accessorKey: "condition",
    header: "Condition",
    cell: ({ getValue }) => {
      if (getValue<string>() === "repair")
        return <p className="text-red-500 capitalize">{getValue<string>()}</p>;
      return <p className="capitalize">{getValue<string>()}</p>;
    },
  },
  {
    accessorKey: "location",
    header: "Location",
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
  {
    accessorKey: "serialNumber",
    header: "Serial Number",
  },
  // {
  //   accessorKey: "warranty",
  //   header: "Warranty",
  // },
];
