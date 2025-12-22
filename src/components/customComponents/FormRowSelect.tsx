import type { UseFormRegister } from "react-hook-form";

type FormSelectProps<TFieldValues extends FieldValues> = {
  name: Path<TFieldValues>;
  label: string;
  className?: string;
  options: string[];
  error?: FieldError;
  placeholder?: string;
  defaultValues?: string | string[];
  onChange?: (selectedValues: string[]) => void;
  required?: boolean;
  multiple?: boolean;
  register: UseFormRegister<TFieldValues>;
  control: Control<TFieldValues>;
};

import type { FieldError, FieldValues, Path, Control } from "react-hook-form";
import { useWatch } from "react-hook-form";
import clsx from "clsx";

const FormRowSelect = <TFieldValues extends FieldValues>({
  name,
  label,
  options,
  error,
  defaultValues,
  multiple,
  control,
  placeholder,
  register,
  onChange,
  required,
}: FormSelectProps<TFieldValues>) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = multiple
      ? Array.from(event.target.selectedOptions, (option) => option.value)
      : [event.target.value]; // Wrap single value in array

    if (onChange) onChange(selectedOptions);
  };

  const value = useWatch({ name, control });
  const isValid = !error && value != null && value.length !== 0;

  return (
    <div className="relative w-full mb-2 group">
      <select
        {...register(name)}
        id={String(name)}
        multiple={multiple}
        className={clsx(
          "text-sm py-3 px-2 peer w-full rounded-md outline-none placeholder-transparent",
          "border border-gray-300 focus:border-rose-600",
          isValid && "border-green-500",
          error && "border-red-300"
        )}
        defaultValue={multiple ? defaultValues || [] : defaultValues}
        onChange={handleChange}
        required={required}
      >
        {!multiple && <option value={placeholder}>{placeholder}</option>}
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {label && (
        <label
          htmlFor={String(name)}
          className="absolute text-sm -top-5 left-0 transition-all duration-400 text-gray-400
            peer-placeholder-shown:top-3 px-2 mb-0 peer-placeholder-shown:text-gray-600
            peer-focus:-top-5 peer-focus:text-gray-600 peer-focus:text-sm tracking-wider
            dark:peer-focus:text-gray-400 dark:peer-placeholder-shown:text-fontLight
            "
        >
          {label}
        </label>
      )}
      {error && <span className="text-xs text-red-600">{error.message}</span>}
    </div>
  );
};

export default FormRowSelect;
