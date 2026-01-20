import type { HTMLInputTypeAttribute } from "react";
import PasswordToggle from "@/components/features/PasswordToggle";
import type { LucideIcon } from "lucide-react";

type FormInputProps<TFieldValues extends FieldValues> = {
  label: string;
  name: Path<TFieldValues>;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  register: UseFormRegister<TFieldValues>;
  // control: Control<TFieldValues>;
  error?: FieldError;
  multiple?: boolean;
  accept?: string;
  disabled?: boolean;
  value?: string;
  isVisible?: boolean; // Used only on input type "password"
  togglePassword?: () => void; // Used only on input type "password"
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  Icon?: LucideIcon;
};

// import { useWatch } from "react-hook-form";
import clsx from "clsx";

import type {
  FieldError,
  UseFormRegister,
  FieldValues,
  Path,
  // Control,
} from "react-hook-form";

function FormRowInput<TFieldValues extends FieldValues>({
  label,
  name,
  placeholder,
  register,
  error,
  disabled,
  // control,
  type,
  multiple = false,
  accept,
  isVisible,
  togglePassword,
  Icon,
}: FormInputProps<TFieldValues>) {
  {
    /* import type {Control} from "react-hook-form"; */
  }

  // $ Manange the Password Visibility
  const isPassword = name === "password";

  return (
    <div className="relative w-full mb-2 group">
      {Icon && (
        <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-gray-400">
          <Icon size={16} />
        </span>
      )}

      <input
        {...register(name)}
        id={String(name)}
        type={type}
        className={clsx(
          "text-xs py-3 px-2 peer w-full rounded-md outline-none placeholder-transparent text-gray-700",
          "border border-gray-300 dark:border-gray-700/50 placeholder:dark:text-gray-700 placeholder:text-xs focus:border-rose-600 focus:dark:bg-gray-600",
          "dark:bg-gray-900/20 dark:text-gray-100/50",

          // isValid && "border-green-500",
          error && "border-red-300",
          Icon ? "pl-12" : "",
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
            "absolute text-xs -top-5 left-0 px-2 mb-0 transition-all duration-400 text-gray-700 tracking-wider",
            "peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-600 peer-focus:-top-5  peer-focus:text-gray-600 peer-focus:text-sm dark:peer-focus:text-gray-400 dark:peer-placeholder-shown:text-fontLight dark:text-gray-100/50",
            Icon ? "left-8 peer-focus:left-3 peer-placeholder-shown:top-0" : "",
          )}
        >
          {label}
        </label>
      )}
      {/* Show error message if validation fails */}
      {error && <span className="text-xs text-red-600">{error.message}</span>}
    </div>
  );
}

export default FormRowInput;
