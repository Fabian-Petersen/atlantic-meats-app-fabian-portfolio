import { useEffect, useRef, useState } from "react";
import type { HTMLInputTypeAttribute } from "react";
import { Check, Pencil } from "lucide-react";
import { sharedStyles } from "@/styles/shared";
import { cn } from "@/lib/utils";

import type {
  FieldError,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";

type FormRowInputEditableProps<TFieldValues extends FieldValues> = {
  label: string;
  name: Path<TFieldValues>;
  register: UseFormRegister<TFieldValues>;
  type?: HTMLInputTypeAttribute;
  error?: FieldError;
  className?: string;
  disabled?: boolean;
  capitalizeValue?: boolean;
};

function FormRowInputEditable<TFieldValues extends FieldValues>({
  label,
  name,
  register,
  type = "text",
  error,
  className,
  disabled,
  capitalizeValue = false,
}: FormRowInputEditableProps<TFieldValues>) {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { ref, onChange, ...field } = register(name);

  useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  return (
    <div className="group relative mb-2 w-full">
      <input
        {...field}
        ref={(element) => {
          ref(element);
          inputRef.current = element;
        }}
        id={String(name)}
        type={type}
        readOnly={!isEditing}
        disabled={disabled}
        autoCapitalize={capitalizeValue ? "words" : undefined}
        placeholder=" "
        onChange={(event) => {
          if (capitalizeValue) {
            event.currentTarget.value = event.currentTarget.value.replace(
              /(^|[\s'-])\p{L}/gu,
              (character) => character.toUpperCase(),
            );
          }
          onChange(event);
        }}
        className={cn(
          className,
          sharedStyles.formInput,
          sharedStyles.formInputDefault,
          "pr-11 text-xs transition-[border-color,box-shadow]",
          !isEditing && "cursor-default",
          error && "border-red-300",
        )}
      />

      <label
        htmlFor={String(name)}
        className={cn(sharedStyles.formLabel, "capitalize")}
      >
        <span className={sharedStyles.formLabelRequired}>{label}</span>
      </label>

      <button
        type="button"
        onClick={() => setIsEditing((value) => !value)}
        disabled={disabled}
        aria-label={isEditing ? `Finish editing ${label}` : `Edit ${label}`}
        className={cn(
          "absolute right-1.5 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50",
          isEditing
            ? "bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-500/15 dark:text-blue-400 dark:hover:bg-blue-500/25"
            : "text-gray-400 hover:bg-gray-200/70 hover:text-gray-700 dark:hover:bg-white/10 dark:hover:text-gray-200",
        )}
      >
        {isEditing ? <Check size={15} /> : <Pencil size={15} />}
      </button>

      {error && <span className="text-xs text-red-600">{error.message}</span>}
    </div>
  );
}

export default FormRowInputEditable;
