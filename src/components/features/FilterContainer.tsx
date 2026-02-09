// import { useState } from "react";
import { ColumnFilterItem } from "./ColumnFilterItem";
// import type { AssetFormValues, CreateJobFormValues } from "@/schemas";
import { type Table } from "@tanstack/react-table";
// import AddNewItemButton from "./AddNewItemButton";

// type Props = {
//   table: Table<AssetFormValues> | Table<CreateJobFormValues>;
// };

type Props<T extends Record<string, unknown>> = {
  table: Table<T>;
};

function FilterContainer<T extends Record<string, unknown>>({
  table,
}: Props<T>) {
  const filterableColumns = table
    .getAllLeafColumns()
    .filter((col) => col.columnDef.enableColumnFilter);

  const uniqueValues = (columnId: string) => {
    const rows = table.getCoreRowModel().rows;

    const values = rows
      .map((row) => row.original[columnId as keyof T])
      .filter((v) => typeof v === "string") as string[];

    return Array.from(new Set(values)).map((v) => ({
      label: v,
      value: v,
    }));
  };

  if (!filterableColumns.length) return null;

  return (
    <div className="flex gap-2 shadow-sm py-1 p-2 rounded-md">
      {filterableColumns.map((column) => (
        <div key={column.id} className="py-2 flex-1">
          <label className="text-xs text-gray-500">
            {column.columnDef.header as string}
          </label>
          <ColumnFilterItem
            placeholder="All"
            value={(column.getFilterValue() as string) ?? ""}
            onChange={(v) => column.setFilterValue(v)}
            options={uniqueValues(column.id)}
          />
        </div>
      ))}
    </div>
  );
}

// return (
//   <div className="flex gap-4 justify-between w-full md:gap-2 h-auto">
//     <div className="flex gap-2 shadow-sm  py-1 p-2 rounded-md">
//       <div className="py-2 flex-1">
//         <label className="text-xs text-gray-500">Equipment</label>
//         <ColumnFilterItem
//           placeholder="All"
//           value={
//             (table.getColumn("equipment")?.getFilterValue() as string) ?? ""
//           }
//           onChange={(v) => table.getColumn("equipment")?.setFilterValue(v)}
//           options={uniqueValues("equipment")}
//         />
//       </div>
//       <div className="py-2 flex-1">
//         <label className="text-xs text-gray-500">Location</label>
//         <ColumnFilterItem
//           placeholder="All"
//           value={
//             (table.getColumn("location")?.getFilterValue() as string) ?? ""
//           }
//           onChange={(v) => table.getColumn("location")?.setFilterValue(v)}
//           options={uniqueValues("location")}
//         />
//       </div>
//       {table.getColumn("condition") ? (
//         <div className="py-2 flex-1">
//           <label className="text-xs text-gray-500">Condition</label>
//           <ColumnFilterItem
//             placeholder="All"
//             value={
//               (table.getColumn("condition")?.getFilterValue() as string) ?? ""
//             }
//             onChange={(v) => table.getColumn("condition")?.setFilterValue(v)}
//             options={uniqueValues("condition")}
//           />
//         </div>
//       ) : null}
//     </div>
//     <div className="py-2 hidden md:inline-block ml-auto">
//       <label className="text-sm md:text-md text-transparent">
//         Create New Asset
//       </label>
//       <AddNewItemButton title="Create Asset" className="" />
//     </div>
//   </div>
// );
// }

export default FilterContainer;
