import type { HTMLInputTypeAttribute } from "react";

type FormInputProps<TFieldValues extends FieldValues> = {
  label: string;
  name: Path<TFieldValues>;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  register: UseFormRegister<TFieldValues>;
  control: Control<TFieldValues>;
  error?: FieldError;
  disabled?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

import { useWatch } from "react-hook-form";
import clsx from "clsx";

import type {
  FieldError,
  UseFormRegister,
  FieldValues,
  Path,
  Control,
} from "react-hook-form";

const FormRowInput = <TFieldValues extends FieldValues>({
  label,
  name,
  placeholder,
  register,
  error,
  disabled,
  control,
  type = "text",
}: FormInputProps<TFieldValues>) => {
  const value = useWatch({ name, control });
  const isValid = !error && value;

  return (
    <div className="relative w-full mb-2 group">
      <input
        {...register(name)}
        id={String(name)}
        type={type}
        className={clsx(
          "text-sm py-3 px-2 peer w-full rounded-md outline-none placeholder-transparent",
          "border border-gray-300 focus:border-rose-600",
          isValid && "border-green-500",
          error && "border-red-300"
        )}
        placeholder={placeholder}
        disabled={disabled}
      ></input>
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
      {/* Show error message if validation fails */}
      {error && <span className="text-xs text-red-600">{error.message}</span>}
    </div>
  );
};

export default FormRowInput;
