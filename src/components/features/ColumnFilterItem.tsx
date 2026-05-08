import { cn } from "@/lib/utils";
import { sharedStyles } from "@/styles/shared";

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
  return (
    <select
      aria-label="filter options"
      className={cn(
        sharedStyles.formInputDefault,
        sharedStyles.formSelect,
        "hover:cursor-pointer",
      )}
      value={(value ?? "") as string}
      onChange={(e) => onChange(e.target.value || "")}
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
  );
}
