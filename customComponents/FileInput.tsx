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

// import { useState } from "react";
// import type {
//   Control,
//   FieldError,
//   FieldValues,
//   Path,
//   PathValue,
// } from "react-hook-form";
// import { Controller } from "react-hook-form";
// import clsx from "clsx";

// type FileInputProps<T extends FieldValues, TName extends Path<T>> = {
//   name: TName;
//   control: Control<T>;
//   label?: string;
//   multiple?: boolean;
//   accept?: string;
//   className?: string;
//   error?: FieldError;
// };

// function FileInput<T extends FieldValues, TName extends Path<T>>({
//   name,
//   control,
//   // label,
//   multiple = false,
//   accept = "image/*",
//   className,
//   error,
// }: FileInputProps<T, TName>) {
//   const [files, setFiles] = useState<File[]>([]);

//   return (
//     <Controller<T, TName>
//       name={name}
//       control={control}
//       render={({ field }) => {
//         type Value = NonNullable<PathValue<T, TName>>;

//         return (
//           <div className={clsx("w-full space-y-2", className)}>
//             {/* {label && (
//               <label className="block text-sm font-medium text-gray-600 dark:text-gray-200">
//                 {label}
//               </label>
//             )} */}

//             {/* Hidden native input */}
//             <input
//               id={String(name)}
//               type="file"
//               multiple={multiple}
//               accept={accept}
//               className="hidden"
//               onChange={(e) => {
//                 const selected = Array.from(e.target.files ?? []);
//                 setFiles(selected);
//                 field.onChange(selected as Value);
//               }}
//             />

//             {/* Custom button */}
//             <label
//               htmlFor={String(name)}
//               className={clsx(
//                 "inline-flex cursor-pointer rounded-md border px-4 py-2 text-sm",
//                 "border rounded border-gray-300 text-xs py-3 px-2 dark:bg-[#2b3a5c] dark:text-gray-100 w-full",
//                 // "bg-white hover:bg-gray-50",
//                 // "dark:bg-[#2b3a5c] dark:hover:bg-[#34466e] dark:text-gray-100",
//                 error && "border-red-500",
//               )}
//             >
//               Select images
//             </label>

//             {/* Selected filenames */}
//             {files.length > 0 && (
//               <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300 w-full border border-red-500">
//                 {files.map((file) => (
//                   <li key={file.name} className="truncate">
//                     • {file.name}
//                   </li>
//                 ))}
//               </ul>
//             )}

//             {/* Error */}
//             {error && <p className="text-sm text-red-500">{error.message}</p>}
//           </div>
//         );
//       }}
//     />
//   );
// }

// export default FileInput;

// import type {
//   Control,
//   FieldError,
//   FieldValues,
//   Path,
//   PathValue,
// } from "react-hook-form";
// import { Controller } from "react-hook-form";
// import clsx from "clsx";

// type FileInputProps<T extends FieldValues, TName extends Path<T>> = {
//   name: TName;
//   control: Control<T>; // react-hook-form control
//   label?: string;
//   multiple?: boolean;
//   accept?: string;
//   className?: string;
//   error?: FieldError;
// };

// function FileInput<T extends FieldValues, TName extends Path<T>>({
//   name,
//   control,
//   label,
//   multiple = false,
//   accept = "image/*",
//   className,
//   error,
// }: FileInputProps<T, TName>) {
//   return (
//     <Controller<T, TName>
//       name={name}
//       control={control}
//       render={({ field }) => {
//         type Value = NonNullable<PathValue<T, TName>>;
//         return (
//           <div className={`relative w-full mb-2 ${className}`}>
//             {label && (
//               <label
//                 htmlFor={String(name)}
//                 className={clsx(
//                   "absolute text-sm -top-5 left-0 px-2 transition-all duration-300 tracking-wider",
//                   "text-gray-400 dark:text-white",
//                   "peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-600 dark:peer-placeholder-shown:text-gray-100",
//                   "peer-focus:-top-5 peer-focus:text-sm peer-focus:text-gray-600 dark:peer-focus:text-gray-200"
//                 )}
//               >
//                 {label}
//               </label>
//             )}
//             <input
//               id={String(name)}
//               type="file"
//               multiple={multiple}
//               accept={accept}
//               title={label ?? String(name)}
//               aria-label={label ?? String(name)}
//               onChange={(e) => {
//                 const files = Array.from(e.target.files ?? []) as Value;
//                 field.onChange(files);
//               }}
//               className="border rounded text-sm py-3 px-2 dark:bg-[#2b3a5c] dark:text-gray-100 w-full"
//             />
//             {error && (
//               <span className="text-red-500 text-sm">{error.message}</span>
//             )}
//           </div>
//         );
//       }}
//     />
//   );
// }

// export default FileInput;
