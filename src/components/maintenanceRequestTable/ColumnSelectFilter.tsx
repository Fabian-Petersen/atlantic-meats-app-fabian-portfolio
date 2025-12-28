// src/components/table/ColumnSelectFilter.tsx
type Option = { label: string; value: string };

export type Props = {
  value: unknown;
  onChange: (value: string) => void;
  options: Option[];
  placeholder: string;
};

export function ColumnSelectFilter({
  value,
  onChange,
  options,
  placeholder,
}: Props) {
  return (
    <select
      className="rounded-lg px-3 py-2 text-sm w-fit focus:outline-none hover:cursor-pointer"
      value={(value ?? "") as string}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="" className="hover:cursor-pointer">
        {placeholder}
      </option>
      {options.map((o) => (
        <option key={o.value} value={o.value} className="hover:cursor-pointer">
          {o.label}
        </option>
      ))}
    </select>
  );
}
