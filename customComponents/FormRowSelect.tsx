//$ Have a union type for options that can take a array string and a json object with label and value
import type {
  FieldError,
  FieldValues,
  Path,
  // Control,
  UseFormRegister,
} from "react-hook-form";

type SelectOption = string | { label: string; value: string };

type FormSelectProps<T extends FieldValues> = {
  name: Path<T>;
  register: UseFormRegister<T>;
  label?: string;
  className?: string;
  options: SelectOption[];
  error?: FieldError | undefined;
  placeholder?: string;
  defaultValues?: string | string[];
  onChange?: (selectedValues: string[]) => void;
  required?: boolean;
  multiple?: boolean;
  // control: Control<T>;
};

// import { useWatch } from "react-hook-form";
import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "lucide-react";

function FormRowSelect<T extends FieldValues>({
  name,
  label,
  options,
  error,
  defaultValues,
  multiple,
  placeholder,
  register,
  onChange,
  required,
  className,
}: FormSelectProps<T>) {
  const { onChange: rhfOnChange, ...restRegister } = register(name);

  // $ Added the rhfOnChange to the onChange event of the select input. This will update the react-hook-form state when the user selects an option. The onChange prop is optional and can be used to perform additional actions when the user selects an option.
  return (
    <div className={cn(className, "relative w-full mb-2 group")}>
      <select
        {...restRegister}
        id={String(name)}
        multiple={multiple}
        className={cn(
          "appearance-none", // Remove default arrow for better styling
          // default styles
          "text-xs py-3 px-2 peer w-full rounded-md text-gray-700 capitalize",
          // focus & border styles
          "border border-gray-300 focus:border-orange-500 outline-none focus:ring-0.5 focus:ring-orange-500",
          // focus: dark styles
          "dark:border-gray-700/50 focus:dark:border-rose-500 focus:dark:ring-0.5 focus:dark:ring-rose-500",
          // dark mode styles
          "dark:bg-(--bg-secondary_dark) dark:border-(--clr-borderDark) dark:text-(--clr-textDark)",
          //error styles
          error && "border-red-400",
        )}
        defaultValue={multiple ? defaultValues || [] : ""}
        onChange={(event) => {
          rhfOnChange(event); // ✅ Update RHF state

          const selectedOptions = multiple
            ? Array.from(event.target.selectedOptions, (option) => option.value)
            : [event.target.value];

          if (onChange) onChange(selectedOptions); // ✅ Your custom logic
        }}
        required={required}
      >
        {!multiple && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}
        {options.map((option, index) => {
          const value = typeof option === "string" ? option : option.value;
          const label = typeof option === "string" ? option : option.label;

          return (
            <option
              key={`${value}-${index}`}
              value={value}
              className="hover:cursor-pointer"
            >
              {label}
            </option>
          );
        })}
      </select>
      <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 dark:text-(--clr-textDark) text-(--clr-textLight)">
        <ChevronDownIcon size={16} />
      </span>
      {label && (
        <label
          htmlFor={String(name)}
          className={cn(
            "absolute text-xs -top-5 left-0 transition-all duration-400 text-gray-400 dark:text-gray-100/20 px-2 mb-0",
            "peer-focus:-top-5 peer-focus:text-gray-600 peer-focus:text-xs tracking-wider",
            "dark:peer-focus:text-blue-300 dark:text-gray-100/30",
            "placeholder-transparent",
          )}
        >
          {label}
        </label>
      )}
      {error && (
        <span className="text-xs text-red-600 dark:text-red-500">
          {error.message}
        </span>
      )}
    </div>
  );
}

export default FormRowSelect;
