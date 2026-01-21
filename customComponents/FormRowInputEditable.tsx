import { useState, useRef, useEffect } from "react";
import type { HTMLInputTypeAttribute } from "react";
import { Pencil, Check } from "lucide-react";
import clsx from "clsx";

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
};

function FormRowInputEditable<TFieldValues extends FieldValues>({
  label,
  name,
  register,
  type = "text",
  error,
  className,
  disabled,
}: FormRowInputEditableProps<TFieldValues>) {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { ref, ...field } = register(name);

  useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  return (
    <div className="relative w-full mb-2">
      <button
        type="button"
        onClick={() => setIsEditing((v) => !v)}
        className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        {isEditing ? <Check size={14} /> : <Pencil size={14} />}
      </button>

      <input
        {...field}
        ref={(el) => {
          ref(el); // ✅ RHF ref
          inputRef.current = el; // ✅ local ref
        }}
        id={String(name)}
        type={type}
        readOnly={!isEditing}
        disabled={disabled}
        className={clsx(
          className,
          "text-xs py-3 px-2 w-full rounded-md outline-none pr-8",
          "border border-gray-300 dark:border-gray-700/50",
          "dark:bg-gray-900/20 dark:text-gray-100",
          !isEditing && "bg-gray-100 cursor-not-allowed",
          error && "border-red-300",
        )}
      />

      <label
        htmlFor={String(name)}
        className="absolute text-xs -top-5 left-0 text-gray-700 dark:text-gray-300"
      >
        {label}
      </label>

      {error && <span className="text-xs text-red-600">{error.message}</span>}
    </div>
  );
}

export default FormRowInputEditable;
