import { cn } from "@/lib/utils";
import { ColumnFilterItem } from "./tables/ColumnFilterItem";
import { type Table } from "@tanstack/react-table";

type Props<T extends Record<string, unknown>> = {
  table: Table<T>;
  className?: string;
  dependentFilters?: Array<{
    parentColumnId: string;
    childColumnId: string;
  }>;
};

function FilterContainer<T extends Record<string, unknown>>({
  table,
  className = "",
  dependentFilters,
}: Props<T>) {
  const filterableColumns = table
    .getAllLeafColumns()
    .filter((col) => col.columnDef.enableColumnFilter);

  const uniqueValues = (columnId: string) => {
    const dependencies =
      dependentFilters?.filter(
        ({ childColumnId }) => childColumnId === columnId,
      ) ?? [];
    const activeDependencies = dependencies.flatMap((dependency) => {
      const value = table
        .getColumn(dependency.parentColumnId)
        ?.getFilterValue();

      return typeof value === "string" && value
        ? [{ ...dependency, value }]
        : [];
    });
    const rows = table
      .getCoreRowModel()
      .rows.filter((row) =>
        activeDependencies.every(
          ({ parentColumnId, value }) =>
            row.original[parentColumnId as keyof T] === value,
        ),
      );

    const values = rows
      .map((row) => row.original[columnId as keyof T])
      .filter((value) => typeof value === "string") as string[];
    const optionValues = dependencies.length
      ? values.filter((value) => value.trim().length > 0)
      : values;

    return Array.from(new Set(optionValues))
      .sort((a, b) => a.localeCompare(b)) // Sort the options in alphabetical order
      .map((v) => ({
        label: v,
        value: v,
      }));
  };

  if (!filterableColumns.length) return null;

  const updateFilter = (columnId: string, value: string) => {
    const column = table.getColumn(columnId);

    if (value) {
      const resetColumnIds = new Set<string>();

      dependentFilters
        ?.filter(({ parentColumnId }) => parentColumnId === columnId)
        .forEach(({ childColumnId }) => {
          const childColumn = table.getColumn(childColumnId);
          const selectedChildValue = childColumn?.getFilterValue();

          if (typeof selectedChildValue === "string" && selectedChildValue) {
            const childDependencies = dependentFilters.filter(
              (dependency) => dependency.childColumnId === childColumnId,
            );
            const isChildValueAvailable = table.getCoreRowModel().rows.some(
              (row) =>
                childDependencies.every(({ parentColumnId }) => {
                  const parentValue =
                    parentColumnId === columnId
                      ? value
                      : resetColumnIds.has(parentColumnId)
                        ? undefined
                        : table.getColumn(parentColumnId)?.getFilterValue();

                  return (
                    typeof parentValue !== "string" ||
                    !parentValue ||
                    row.original[parentColumnId as keyof T] === parentValue
                  );
                }) &&
                row.original[childColumnId as keyof T] === selectedChildValue,
            );

            if (!isChildValueAvailable) {
              childColumn?.setFilterValue(undefined);
              resetColumnIds.add(childColumnId);
            }
          }
        });
    }

    column?.setFilterValue(value || undefined);
  };

  return (
    <div className={cn("h-full flex gap-2", className)}>
      {filterableColumns.map((column) => (
        <div key={column.id} className="capitalize h-full ">
          <ColumnFilterItem
            placeholder={column.columnDef.header as string}
            value={(column.getFilterValue() as string) ?? ""}
            onChange={(value) => updateFilter(column.id, value)}
            options={uniqueValues(column.id)}
          />
        </div>
      ))}
    </div>
  );
}

export default FilterContainer;
