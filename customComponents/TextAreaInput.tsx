import type {
  FieldError,
  FieldValues,
  // Control,
  Path,
  UseFormRegister,
} from "react-hook-form";
import { sharedStyles } from "@/styles/shared";
import { cn } from "@/lib/utils";

type FormRowTextAreaProps<T extends FieldValues> = {
  name: Path<T>;
  label?: string;
  // control: Control<T>;
  placeholder?: string;
  register: UseFormRegister<T>;
  error?: FieldError;
  disabled?: boolean;
  rows?: number;
  isValid?: boolean;
  className?: string;
  labelStyles?: string;
  textAreaStyles?: string;
};

const TextAreaInput = <T extends FieldValues>({
  name,
  label,
  placeholder,
  register,
  error,
  disabled = false,
  rows = 4,
  isValid,
  className,
  labelStyles,
  textAreaStyles,
}: FormRowTextAreaProps<T>) => {
  const registered = register(name);
  return (
    <div className={`relative w-full mb-2 group ${className}`}>
      <textarea
        {...registered}
        id={String(name)}
        rows={rows}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          `${placeholder ? "placeholder-shown:" : "placeholder-transparent "}`,
          sharedStyles.formInputDefault,
          sharedStyles.formTextArea,
          textAreaStyles,
          isValid && "border-green-500",
          error && "border-red-300",
        )}
        onInput={(e) => {
          const target = e.currentTarget;
          target.style.height = "auto";
          target.style.height = `${target.scrollHeight}px`;
        }}
        onChange={(e) => {
          registered.onChange(e);
          const target = e.currentTarget;
          target.style.height = "auto";
          target.style.height = `${target.scrollHeight}px`;
        }}
      />

      {label && (
        <label
          htmlFor={String(name)}
          className={cn(sharedStyles.formLabel, labelStyles)}
        >
          {label}
        </label>
      )}
      {error && (
        <span className={cn(sharedStyles.formError)}>{error.message}</span>
      )}
    </div>
  );
};

export default TextAreaInput;
