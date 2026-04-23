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
  selectStyles?: string;
  labelStyles?: string;
  // control: Control<T>;
};

// import { useWatch } from "react-hook-form";
import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "lucide-react";
import { sharedStyles } from "@/styles/shared";

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
  selectStyles,
  labelStyles,
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
          selectStyles,
          sharedStyles.formSelect,
          sharedStyles.formInputDefault,
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
      <span className={cn(sharedStyles.formSelectChevron)}>
        <ChevronDownIcon size={16} />
      </span>
      {label && (
        <label
          htmlFor={String(name)}
          className={cn(labelStyles, sharedStyles.formLabel)}
        >
          {label}
        </label>
      )}
      {error && (
        <span className={cn(sharedStyles.formError)}>{error.message}</span>
      )}
    </div>
  );
}

export default FormRowSelect;
