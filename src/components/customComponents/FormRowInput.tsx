import type { HTMLInputTypeAttribute } from "react";
import PasswordToggle from "@/components/features/PasswordToggle";

type FormInputProps<TFieldValues extends FieldValues> = {
  label: string;
  name: Path<TFieldValues>;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  register: UseFormRegister<TFieldValues>;
  control: Control<TFieldValues>;
  error?: FieldError;
  multiple?: boolean;
  accept?: string;
  disabled?: boolean;
  value?: string;
  isVisible?: boolean; // Used only on input type "password"
  togglePassword?: () => void; // Used only on input type "password"
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
  multiple = false,
  accept,
  isVisible,
  togglePassword,
}: FormInputProps<TFieldValues>) => {
  const value = useWatch({ name, control });
  const isValid = !error && (type === "file" ? value?.length > 0 : value);

  // $ Manange the Password Visibility
  const isPassword = name === "password";

  return (
    <div className="relative w-full mb-2 group">
      <input
        {...register(name)}
        id={String(name)}
        type={type}
        className={clsx(
          "text-sm py-3 px-2 peer w-full rounded-md outline-none placeholder-transparent text-gray-700 dark:text-gray-100/50",
          "border border-gray-300 dark:border-gray-700/50 placeholder:dark:text-white focus:border-rose-600 focus:dark:bg-gray-600",
          isValid && "border-green-500",
          error && "border-red-300"
        )}
        placeholder={placeholder}
        disabled={disabled}
        multiple={multiple}
        accept={accept}
      ></input>
      {isPassword && togglePassword && (
        <PasswordToggle
          visible={isVisible ?? false}
          onToggle={togglePassword}
        />
      )}
      {label && (
        <label
          htmlFor={String(name)}
          className={clsx(
            "absolute text-sm -top-5 left-0 px-2 mb-0 transition-all duration-400 text-gray-700 dark:text-gray-100/50 tracking-wider",
            "peer-placeholder-shown:top-3  peer-placeholder-shown:text-gray-600 peer-focus:-top-5 peer-focus:text-gray-600 peer-focus:text-sm dark:peer-focus:text-gray-400 dark:peer-placeholder-shown:text-fontLight"
          )}
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
