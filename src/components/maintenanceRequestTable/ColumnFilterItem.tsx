// src/components/table/ColumnFilterItem.tsx
type Option = { label: string; value: string };

export type ColumnFilter = {
  //   id: string;
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
      className="rounded-lg px-3 py-2 text-sm w-full focus:outline-none hover:cursor-pointer dark:bg-[#1d2739] dark:text-gray-200 border border-gray-200"
      value={(value ?? "") as string}
      onChange={(e) => onChange(e.target.value || "")}
    >
      <option value="" className="hover:cursor-pointer">
        {placeholder}
      </option>
      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
          className="hover:cursor-pointer"
        >
          {option.label}
        </option>
      ))}
    </select>
  );
}
