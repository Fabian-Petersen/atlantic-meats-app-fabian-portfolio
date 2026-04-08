import type {
  FieldError,
  FieldValues,
  // Control,
  Path,
  UseFormRegister,
} from "react-hook-form";
import clsx from "clsx";

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
        className={clsx(
          "text-xs py-3 px-2 peer w-full rounded-md outline-none resize-none text-gray-700",
          `${placeholder ? "placeholder-shown:" : "placeholder-transparent "}`,
          "border border-gray-300",
          "resize-none overflow-hidden", // this removes the scrollbar when the textarea grows
          "focus:border-rose-600 focus:dark:bg-gray-600",
          "dark:bg-(--bg-secondary_dark) dark:border-(--clr-borderDark) dark:text-(--clr-textDark)",
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
          className={clsx(
            "absolute text-xs -top-5 left-0 px-2 transition-all duration-300",
            "text-gray-700 dark:text-gray-100/50 tracking-wider",
            "peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-600",
            "peer-focus:-top-5 peer-focus:text-sm peer-focus:text-gray-600",
            "placeholder-transparent",
          )}
        >
          {label}
        </label>
      )}
      {error && <span className="text-xs text-red-600">{error.message}</span>}
    </div>
  );
};

export default TextAreaInput;
