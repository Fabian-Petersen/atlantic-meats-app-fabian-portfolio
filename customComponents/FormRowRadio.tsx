// FormRowRadio.tsx
import type {
  FieldError,
  UseFormRegister,
  FieldValues,
  Path,
} from "react-hook-form";
import { cn } from "@/lib/utils";
import { sharedStyles } from "@/styles/shared";

type RadioOption = {
  label: string;
  value: string;
};

type FormRowRadioProps<TFieldValues extends FieldValues> = {
  label?: string;
  name: Path<TFieldValues>;
  options: RadioOption[];
  register?: UseFormRegister<TFieldValues>;
  error?: FieldError;
  disabled?: boolean;
  className?: string;
  optionStyles?: string;
  labelStyles?: string;
  required?: boolean;
  orientation?: "row" | "column";
};

function FormRowRadio<TFieldValues extends FieldValues>({
  label,
  name,
  options,
  register,
  error,
  disabled,
  className,
  optionStyles,
  labelStyles,
  required,
  orientation = "row",
}: FormRowRadioProps<TFieldValues>) {
  return (
    <div className={cn(className, "relative w-full mb-2 group")}>
      {label && (
        <span
          className={cn(
            labelStyles,
            sharedStyles.formLabel,
            "static mb-1 flex items-baseline gap-1",
          )}
        >
          <span>{label}</span>
          {required && <span className="text-red-500">*</span>}
        </span>
      )}

      <div
        className={cn(
          "flex gap-4",
          orientation === "column" && "flex-col gap-2",
        )}
      >
        {options.map((opt) => (
          <label
            key={opt.value}
            htmlFor={`${String(name)}-${opt.value}`}
            className={cn(
              optionStyles,
              "flex items-center gap-2 text-sm cursor-pointer",
              disabled && "opacity-50 cursor-not-allowed",
            )}
          >
            <input
              {...(register ? register(name) : {})}
              id={`${String(name)}-${opt.value}`}
              type="radio"
              value={opt.value}
              disabled={disabled}
              className={cn(
                "accent-(--clr-primary)",
                error && "outline outline-red-300",
              )}
            />
            {opt.label}
          </label>
        ))}
      </div>

      {/* Show error message if validation fails */}
      {error && (
        <span className={cn(sharedStyles.formError)}>{error.message}</span>
      )}
    </div>
  );
}

export default FormRowRadio;
