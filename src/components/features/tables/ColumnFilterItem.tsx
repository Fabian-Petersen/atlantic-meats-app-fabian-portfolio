import { cn } from "@/lib/utils";
import { sharedStyles } from "@/styles/shared";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useState } from "react";

// src/components/table/ColumnFilterItem.tsx
type Option = { label: string; value: string };

export type ColumnFilter = {
  value: string | undefined;
  onChange: (value: string) => void;
  options: Option[];
  placeholder: string;
};

export type ColumnFilterState = ColumnFilter[];

export function ColumnFilterItem({
  value,
  onChange,
  options,
  placeholder,
}: ColumnFilter) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative h-full">
      <select
        aria-label="filter options"
        className={cn(
          sharedStyles.formInputDefault,
          sharedStyles.formSelect,
          "base-select",
          "hover:cursor-pointer w-44 h-full",
        )}
        value={(value ?? "") as string}
        onMouseDown={() => setIsOpen((prev) => !prev)}
        onChange={(e) => {
          onChange(e.target.value || "");
          setIsOpen(false);
        }}
      >
        <option value="" className="hover:cursor-pointer text-xs">
          {placeholder}
        </option>
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="hover:cursor-pointer text-xs"
          >
            {option.label}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground dark:text-(--clr-textDark)">
        {isOpen ? <ChevronUpIcon size={14} /> : <ChevronDownIcon size={14} />}
      </span>
    </div>
  );
}
