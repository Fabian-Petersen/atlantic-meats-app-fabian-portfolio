import type {
  Control,
  FieldError,
  FieldValues,
  Path,
  PathValue,
} from "react-hook-form";
import { Controller } from "react-hook-form";
import clsx from "clsx";

type FileInputProps<T extends FieldValues, TName extends Path<T>> = {
  name: TName;
  control: Control<T>; // react-hook-form control
  label?: string;
  multiple?: boolean;
  accept?: string;
  className?: string;
  error?: FieldError;
};

function FileInput<T extends FieldValues, TName extends Path<T>>({
  name,
  control,
  label,
  multiple = false,
  accept = "image/*",
  className,
  error,
}: FileInputProps<T, TName>) {
  return (
    <Controller<T, TName>
      name={name}
      control={control}
      render={({ field }) => {
        type Value = NonNullable<PathValue<T, TName>>;
        return (
          <div className={`relative w-full mb-2 ${className}`}>
            {label && (
              <label
                htmlFor={String(name)}
                className={clsx(
                  "absolute text-sm -top-5 left-0 px-2 transition-all duration-300 tracking-wider",
                  "text-gray-400 dark:text-white",
                  "peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-600 dark:peer-placeholder-shown:text-gray-100",
                  "peer-focus:-top-5 peer-focus:text-sm peer-focus:text-gray-600 dark:peer-focus:text-gray-200"
                )}
              >
                {label}
              </label>
            )}
            <input
              id={String(name)}
              type="file"
              multiple={multiple}
              accept={accept}
              title={label ?? String(name)}
              aria-label={label ?? String(name)}
              onChange={(e) => {
                const files = Array.from(e.target.files ?? []) as Value;
                field.onChange(files);
              }}
              className="border rounded text-sm py-3 px-2 dark:bg-[#2b3a5c] dark:text-gray-100 w-full"
            />
            {error && (
              <span className="text-red-500 text-sm">{error.message}</span>
            )}
          </div>
        );
      }}
    />
  );
}

export default FileInput;
