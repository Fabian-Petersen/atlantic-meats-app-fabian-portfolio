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
  return (
    <div className={`relative w-full mb-2 group ${className}`}>
      <textarea
        {...register(name)}
        id={String(name)}
        rows={rows}
        placeholder={placeholder}
        disabled={disabled}
        className={clsx(
          "text-sm py-3 px-2 peer w-full rounded-md outline-none resize-none",
          "placeholder-transparent text-gray-700 dark:text-gray-100/50",
          "border border-gray-300 dark:border-gray-700/50",
          "focus:border-rose-600 focus:dark:bg-gray-600",
          isValid && "border-green-500",
          error && "border-red-300"
        )}
      />

      {label && (
        <label
          htmlFor={String(name)}
          className={clsx(
            "absolute text-sm -top-5 left-0 px-2 transition-all duration-300",
            "text-gray-700 dark:text-gray-100/50 tracking-wider",
            "peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-600",
            "peer-focus:-top-5 peer-focus:text-sm peer-focus:text-gray-600",
            "dark:peer-focus:text-gray-400 dark:peer-placeholder-shown:text-fontLight"
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
