import type { HTMLInputTypeAttribute } from "react";
import PasswordToggle from "@/components/features/PasswordToggle";
import type { LucideIcon } from "lucide-react";

type FormInputProps<TFieldValues extends FieldValues> = {
  label?: string;
  name: Path<TFieldValues>;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  register?: UseFormRegister<TFieldValues>;
  // control: Control<TFieldValues>;
  error?: FieldError;
  multiple?: boolean;
  readOnly?: boolean;
  accept?: string;
  disabled?: boolean;
  value?: string;
  className?: string;
  isVisible?: boolean; // Used only on input type "password"
  togglePassword?: () => void; // Used only on input type "password"
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  Icon?: LucideIcon;
  inputStyles?: string;
  iconStyles?: string;
  labelStyles?: string;
};

import type {
  FieldError,
  UseFormRegister,
  FieldValues,
  Path,
  // Control,
} from "react-hook-form";
import { cn } from "@/lib/utils";
import { sharedStyles } from "@/styles/shared";

function FormRowInput<TFieldValues extends FieldValues>({
  label,
  name,
  placeholder,
  register,
  error,
  disabled,
  className,
  readOnly,
  // control,
  type,
  multiple = false,
  accept,
  isVisible,
  togglePassword,
  Icon,
  inputStyles,
  iconStyles,
  labelStyles,
}: FormInputProps<TFieldValues>) {
  {
    /* import type {Control} from "react-hook-form"; */
  }

  // $ Manange the Password Visibility
  const isPassword = name === "password";

  return (
    <div className={cn(className, "relative w-full mb-2 group")}>
      {Icon && (
        <span
          className={cn(
            iconStyles,
            "pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-gray-400 dark:text-(--clr-textDark)",
          )}
        >
          <Icon size={16} />
        </span>
      )}

      <input
        {...(register ? register(name) : {})}
        id={String(name)}
        type={type}
        className={cn(
          inputStyles,
          placeholder
            ? "placeholder:text-(--clr-textLight) dark:placeholder:text-(--clr-textDark)"
            : "placeholder-transparent",
          sharedStyles.formInput,
          sharedStyles.formInputDefault,
          error && "border-red-300",
          Icon ? "pl-12" : "",
        )}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        multiple={multiple}
        accept={accept}
      ></input>
      {isPassword && togglePassword && (
        <PasswordToggle
          visible={isVisible ?? false}
          onToggle={togglePassword}
        />
      )}
      {label && !placeholder && (
        <label
          htmlFor={String(name)}
          className={cn(
            labelStyles,
            sharedStyles.formLabel,
            Icon ? "left-8 peer-focus:left-3 peer-placeholder-shown:top-0" : "",
          )}
        >
          {label}
        </label>
      )}
      {/* Show error message if validation fails */}
      {error && (
        <span className={cn(sharedStyles.formError)}>{error.message}</span>
      )}
    </div>
  );
}

export default FormRowInput;
