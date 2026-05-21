import { cn } from "@/lib/utils";
import { sharedStyles } from "@/styles/shared";
import type { Table } from "@tanstack/react-table";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useState } from "react";

type Props<T> = {
  table: Table<T>;
  className?: string;
};

function TablePageSizeSelector<T>({ table, className }: Props<T>) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={`${className} relative h-full`}>
      <select
        title="PageSelect"
        value={table.getState().pagination.pageSize}
        onBlur={() => setIsOpen(false)} // closes when focus is lost
        onMouseDown={() => setIsOpen((prev) => !prev)}
        onChange={(e) => {
          table.setPageSize(Number(e.target.value));
          setIsOpen(false);
        }} // closes on selection
        onKeyDown={(e) => {
          if (e.key === "Escape") setIsOpen(false); // closes on Escape
        }}
        className={cn(
          sharedStyles.formInputDefault,
          sharedStyles.formSelect,
          "base-select",
          "hover:cursor-pointer h-full w-26",
        )}
      >
        {[5, 10, 20, 50].map((size) => (
          <option key={size} value={size} className="p-2 hover:cursor-pointer">
            Show {size}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground dark:text-(--clr-textDark)">
        {isOpen ? <ChevronUpIcon size={14} /> : <ChevronDownIcon size={14} />}
      </span>
    </div>
  );
}

export default TablePageSizeSelector;
