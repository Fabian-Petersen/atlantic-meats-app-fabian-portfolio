import { useState } from "react";
import type {
  Control,
  FieldError,
  FieldValues,
  Path,
  PathValue,
} from "react-hook-form";
import { Controller } from "react-hook-form";
import clsx from "clsx";
import { Trash2 } from "lucide-react";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_FILES = 10;

type FileInputProps<T extends FieldValues, TName extends Path<T>> = {
  name: TName;
  control: Control<T>;
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
  multiple = true,
  accept = "image/*",
  className,
  error,
}: FileInputProps<T, TName>) {
  const [files, setFiles] = useState<File[]>([]);
  const [localError, setLocalError] = useState<string | null>(null);

  return (
    <Controller<T, TName>
      name={name}
      control={control}
      render={({ field }) => {
        type Value = NonNullable<PathValue<T, TName>>;

        const updateForm = (updated: File[]) => {
          setFiles(updated);
          field.onChange(updated as Value);
        };

        const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
          setLocalError(null);

          const selected = Array.from(e.target.files ?? []);

          if (files.length + selected.length > MAX_FILES) {
            setLocalError(`Maximum ${MAX_FILES} files allowed`);
            return;
          }

          const invalid = selected.find((file) => file.size > MAX_FILE_SIZE);

          if (invalid) {
            setLocalError("Each file must be 10MB or smaller");
            return;
          }

          updateForm([...files, ...selected]);
          e.target.value = ""; // allow re-selecting same file
        };

        const removeFile = (index: number) => {
          const updated = files.filter((_, i) => i !== index);
          updateForm(updated);
        };

        return (
          <div className={clsx("w-full space-y-2", className)}>
            {label && (
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-200">
                {label}
              </label>
            )}

            {/* Hidden native input */}
            <input
              id={String(name)}
              type="file"
              multiple={multiple}
              accept={accept}
              className="hidden"
              onChange={handleSelect}
            />

            {/* Custom button */}
            <label
              htmlFor={String(name)}
              className={clsx(
                "inline-flex cursor-pointer items-center rounded-md border text-xs py-3 px-2",
                "bg-white hover:bg-gray-50 border-gray-300 w-full",
                "dark:bg-[#2b3a5c] dark:hover:bg-[#34466e] dark:text-gray-100",
                (error || localError) && "border-red-500",
              )}
            >
              Add images
            </label>

            {/* File list */}
            {files.length > 0 && (
              <ul className="flex flex-col gap-2 text-sm text-gray-600 dark:text-gray-300 h-auto max-h-28 overflow-y-scroll">
                {files.map((file, index) => (
                  <li
                    key={`${file.name}-${index}`}
                    className="flex items-center justify-between gap-2 hover:bg-gray-200 py-0.5 rounded px-1 hover:cursor-pointer"
                  >
                    <span className="truncate text-xs">{file.name}</span>
                    <button
                      type="button"
                      aria-label="remove image button"
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:underline hover:cursor-pointer"
                    >
                      <Trash2 size="12" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {/* Errors */}
            {(localError || error) && (
              <p className="text-xs text-red-500">
                {localError ?? error?.message}
              </p>
            )}
          </div>
        );
      }}
    />
  );
}

export default FileInput;
