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
    cell: ({ getValue }) =>
      new Date(getValue<string>()).toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    sortingFn: "datetime",
  },
  {
    accessorKey: "description",
    header: "Equipment",
  },
  {
    accessorKey: "assetID",
    header: "asset ID",
  },
  {
    accessorKey: "condition",
    header: "Condition",
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "warranty",
    header: "Warranty",
  },
  {
    accessorKey: "warranty_expire",
    header: "Warranty Expire",
  },
  {
    accessorKey: "serialNumber",
    header: "Serial Number",
  },
  {
    accessorKey: "manufacturer",
    header: "Manufacturer",
  },
  {
    accessorKey: "date_of_manufacture",
    header: "Date of Manufacture",
  },
  {
    accessorKey: "model",
    header: "Model",
  },
  {
    accessorKey: "status",
    header: "status",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
];
