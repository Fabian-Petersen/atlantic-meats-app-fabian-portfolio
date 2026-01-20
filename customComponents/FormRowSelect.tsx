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
import clsx from "clsx";

function FormRowSelect<T extends FieldValues>({
  name,
  label,
  options,
  error,
  defaultValues,
  multiple,
  // control,
  placeholder,
  register,
  onChange,
  required,
}: FormSelectProps<T>) {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = multiple
      ? Array.from(event.target.selectedOptions, (option) => option.value)
      : [event.target.value]; // Wrap single value in array

    if (onChange) onChange(selectedOptions);
  };

  // const value = useWatch({
  //   name,
  //   control,
  // }) as (string | File | number | null)[] | string | number | undefined;

  // const isValid =
  //   !error &&
  //   (Array.isArray(value)
  //     ? value.length > 0
  //     : value !== undefined && value !== "");

  return (
    <div className="relative w-full mb-2 group">
      <select
        {...register(name)}
        id={String(name)}
        multiple={multiple}
        className={clsx(
          "text-xs py-3 px-2 peer w-full rounded-md outline-none text-gray-700",
          "border border-gray-300 focus:border-rose-600 capitalize",
          "dark:bg-gray-900/20 dark:border-gray-700/50 dark:text-gray-200",
          // isValid && "border-green-500",
          error && "border-red-400",
        )}
        defaultValue={multiple ? defaultValues || [] : ""}
        onChange={handleChange}
        required={required}
      >
        {!multiple && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => {
          const value = typeof option === "string" ? option : option.value;
          const label = typeof option === "string" ? option : option.label;

          return (
            <option key={value} value={value}>
              {label}
            </option>
          );
        })}
      </select>
      {label && (
        <label
          htmlFor={String(name)}
          className={clsx(
            "absolute text-xs -top-5 left-0 transition-all duration-400 text-gray-400 dark:text-gray-100/20",
            "peer-placeholder-shown:top-3 px-2 mb-0 peer-placeholder-shown:text-gray-600",
            "dark:peer-placeholder-shown:text-gray-100",
            "peer-focus:-top-5 peer-focus:text-gray-600 peer-focus:text-xs tracking-wider",
            "dark:peer-focus:text-blue-300 dark:text-gray-100/30",
          )}
        >
          {label}
        </label>
      )}
      {error && <span className="text-xs text-red-600">{error.message}</span>}
    </div>
  );
}

export default FormRowSelect;
