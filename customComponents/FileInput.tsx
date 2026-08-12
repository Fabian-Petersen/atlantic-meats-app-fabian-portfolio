import { useState } from "react";
import type {
  Control,
  FieldError,
  FieldValues,
  Path,
  PathValue,
} from "react-hook-form";
import { Controller } from "react-hook-form";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { sharedStyles } from "@/styles/shared";

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB
const MAX_FILES = 10;

type FileInputProps<T extends FieldValues, TName extends Path<T>> = {
  name: TName;
  control: Control<T>;
  label?: string;
  multiple?: boolean;
  accept?: string;
  className?: string;
  error?: FieldError;
  placeholder?: string;
  labelStyles?: string;
  required?: boolean;
};

function FileInput<T extends FieldValues, TName extends Path<T>>({
  name,
  control,
  label,
  multiple = true,
  accept = "image/*",
  className,
  error,
  placeholder,
  labelStyles,
  required,
}: FileInputProps<T, TName>) {
  const [files, setFiles] = useState<File[]>([]);
  const [localError, setLocalError] = useState<string | null>(null);

  const hasValue = files.length > 0;

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
          <div className={cn("w-full pb-1 mb-2 group", className)}>
            <input
              id={String(name)}
              type="file"
              multiple={multiple}
              accept={accept}
              className="hidden"
              onChange={handleSelect}
            />

            <div
              className={cn(
                "relative w-full rounded-md border",
                "bg-white dark:bg-(--bg-secondary_dark)",
                "border-gray-300 dark:border-(--clr-borderDark)",
                (error || localError) && "border-red-500",
              )}
            >
              {/* Floating label */}
              {label && (
                <label
                  htmlFor={String(name)}
                  className={cn(labelStyles, sharedStyles.formLabel)}
                >
                  <span className="flex items-baseline gap-1 bg-white dark:bg-(--bg-primary_dark)">
                    <span>{label}</span>
                    {required && <span className="text-red-500">*</span>}
                  </span>
                </label>
              )}

              <label
                htmlFor={String(name)}
                className={cn(
                  "flex w-full cursor-pointer flex-col",
                  "rounded-md px-2 py-2",
                  "text-xs",
                  "hover:bg-gray-50 dark:hover:bg-[#34466e]",
                  hasValue
                    ? "text-gray-900 dark:text-gray-100"
                    : "text-gray-400 dark:text-gray-500",
                )}
              >
                {/* Placeholder */}
                {!hasValue && (
                  <span className="min-h-6 flex items-center">
                    {placeholder ?? "Add images"}
                  </span>
                )}

                {/* Selected files */}
                {hasValue && (
                  <ul className="flex flex-col gap-1 max-h-28 overflow-y-auto">
                    {files.map((file, index) => (
                      <li
                        key={`${file.name}-${index}`}
                        className="flex items-center justify-between gap-2 rounded px-1 py-0.5 hover:bg-gray-200 dark:hover:bg-[#34466e]"
                      >
                        <span className="truncate text-xs">{file.name}</span>

                        <button
                          type="button"
                          aria-label={`Remove ${file.name}`}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            removeFile(index);
                          }}
                          className="shrink-0 text-red-500 hover:underline"
                        >
                          <Trash2 size="12" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </label>
            </div>
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
