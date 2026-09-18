import { useState } from "react";
import type {
  Control,
  FieldError,
  FieldValues,
  Path,
  PathValue,
} from "react-hook-form";
import { Controller } from "react-hook-form";
import { Eye, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { sharedStyles } from "@/styles/shared";
import { SkeletonInput } from "@/components/skeletons/SkeletonInput";
import FullscreenImageModal from "@/components/modals/FullscreenImageModal";

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
  isLoading?: boolean;
  disabled?: boolean;
  existingFiles?: { key: string; filename: string; url: string }[];
  onRemoveExisting?: (file: {
    key: string;
    filename: string;
    url: string;
  }) => void;
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
  isLoading,
  disabled,
  existingFiles = [],
  onRemoveExisting,
}: FileInputProps<T, TName>) {
  const [files, setFiles] = useState<File[]>([]);
  const [localError, setLocalError] = useState<string | null>(null);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

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

          if (existingFiles.length + files.length + selected.length > MAX_FILES) {
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

        return isLoading ? (
          <SkeletonInput />
        ) : (
          <div className={cn("w-full pb-1 mb-2 group", className)}>
            {existingFiles.length > 0 && (
              <div className="mb-6 rounded-md border border-gray-200 bg-gray-50 p-2 dark:border-gray-700 dark:bg-gray-800/50">
                <p className="mb-2 text-xs font-medium text-gray-600 dark:text-gray-300">
                  Existing images ({existingFiles.length})
                </p>
                <ul className="flex max-h-36 flex-col gap-1 overflow-y-auto">
                  {existingFiles.map((file, index) => (
                    <li
                      key={`${file.filename}-${file.url}`}
                      className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-2 py-1.5 dark:border-gray-700 dark:bg-gray-900"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewIndex(index);
                          setIsPreviewOpen(true);
                        }}
                        className="flex min-w-0 flex-1 items-center gap-2 text-xs text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                        title={`View ${file.filename}`}
                      >
                        <Eye className="size-4 shrink-0" aria-hidden="true" />
                        <span className="truncate">{file.filename}</span>
                      </button>
                      {onRemoveExisting && (
                        <button
                          type="button"
                          aria-label={`Delete ${file.filename}`}
                          onClick={() => onRemoveExisting(file)}
                          className="flex size-7 shrink-0 items-center justify-center rounded-md text-red-500 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/40"
                        >
                          <Trash2 size="14" />
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <input
              id={String(name)}
              type="file"
              multiple={multiple}
              accept={accept}
              className="hidden"
              onChange={handleSelect}
              disabled={disabled}
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
                  <span className={cn(sharedStyles.formLabelRequired)}>
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
            {isPreviewOpen && (
              <FullscreenImageModal
                images={existingFiles.map((file) => file.url)}
                activeIndex={previewIndex}
                setIsOpen={setIsPreviewOpen}
              />
            )}
          </div>
        );
      }}
    />
  );
}

export default FileInput;
