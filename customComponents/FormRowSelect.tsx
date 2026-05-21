import type {
  FieldError,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";

type SelectOption = string | { label: string; value: string };

type FormSelectProps<T extends FieldValues> = {
  name: Path<T>;
  register: UseFormRegister<T>;
  label?: string;
  className?: string;
  options: SelectOption[];
  error?: FieldError | undefined;
  placeholder?: string;
  defaultValues?: string | string[];
  onChange?: (selectedValues: string[]) => void;
  required?: boolean;
  multiple?: boolean;
  selectStyles?: string;
  labelStyles?: string;
};

import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "lucide-react";
import { sharedStyles } from "@/styles/shared";

function FormRowSelect<T extends FieldValues>({
  name,
  label,
  options = [],
  error,
  multiple,
  // placeholder,
  register,
  onChange,
  required,
  className,
  selectStyles,
  labelStyles,
}: FormSelectProps<T>) {
  const { onChange: rhfOnChange, ...restRegister } = register(name);

  // Normalise once here so the JSX below is always working with a flat
  //    string array. If options hasn't arrived yet, fall back to [].
  const normalised = options
    .filter(Boolean) // ⭐guards against sparse/undefined elements
    .map((option) =>
      typeof option === "string" ? { label: option, value: option } : option,
    );

  return (
    // ✅ `relative` on the wrapper lets the chevron icon be positioned
    //    absolutely over the select without living inside it.
    <div className={cn(className, "relative w-full mb-2 group")}>
      <select
        {...restRegister}
        id={String(name)}
        data-multiple={multiple || undefined}
        className={cn(
          selectStyles,
          sharedStyles.formInputDefault,
          sharedStyles.formSelect,
          error && "border-red-400",
          "base-select",
          // ✅ make room on the right for the chevron icon
          "pr-8",
        )}
        // ✅ Removed hardcoded defaultValue="".
        //    react-hook-form's register() sets the initial value from
        //    useForm({ defaultValues }), so we must not override it here.
        //    For multi-select an empty array default is fine via RHF too.
        multiple={multiple}
        onChange={(event) => {
          rhfOnChange(event); // ✅ keep RHF state in sync

          const selectedValues = multiple
            ? Array.from(event.target.selectedOptions, (o) => o.value)
            : [event.target.value];

          onChange?.(selectedValues); // ✅ optional caller callback
        }}
        required={required}
      >
        {/* Placeholder option — single-select only */}
        {!multiple && (
          <option value="" disabled>
            {/* {placeholder ?? ""} */}
          </option>
        )}

        {/* ✅ normalised is always an array so .map() never throws */}
        {normalised.map(({ value, label }, index) => (
          <option
            key={`${value}-${index}`}
            value={value}
            className="hover:cursor-pointer"
          >
            {label}
          </option>
        ))}
      </select>

      {/*
       * ✅ Chevron lives OUTSIDE the <select> element.
       *    A <button> (or any non-<option>/<optgroup>) inside <select>
       *    is invalid HTML and silently stripped by most browsers.
       *    pointer-events-none lets clicks pass through to the select.
       */}
      <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground dark:text-(--clr-textDark)">
        <ChevronDownIcon size={14} />
      </span>

      {label && (
        <label
          htmlFor={String(name)}
          className={cn(labelStyles, sharedStyles.formLabel)}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {error && (
        <span className={cn(sharedStyles.formError)}>{error.message}</span>
      )}
    </div>
  );
}

export default FormRowSelect;

/* // $  -------------------------- Old Select Component -------------------------- */

// //$ Have a union type for options that can take a array string and a json object with label and value
// import type {
//   FieldError,
//   FieldValues,
//   Path,
//   // Control,
//   UseFormRegister,
// } from "react-hook-form";

// type SelectOption = string | { label: string; value: string };

// type FormSelectProps<T extends FieldValues> = {
//   name: Path<T>;
//   register: UseFormRegister<T>;
//   label?: string;
//   className?: string;
//   options: SelectOption[];
//   error?: FieldError | undefined;
//   placeholder?: string;
//   defaultValues?: string | string[];
//   onChange?: (selectedValues: string[]) => void;
//   required?: boolean;
//   multiple?: boolean;
//   selectStyles?: string;
//   labelStyles?: string;
//   // control: Control<T>;
// };

// // import { useWatch } from "react-hook-form";
// import { cn } from "@/lib/utils";
// import { ChevronDownIcon } from "lucide-react";
// import { sharedStyles } from "@/styles/shared";

// function FormRowSelect<T extends FieldValues>({
//   name,
//   label,
//   options,
//   error,
//   defaultValues,
//   multiple,
//   placeholder,
//   register,
//   onChange,
//   required,
//   className,
//   selectStyles,
//   labelStyles,
// }: FormSelectProps<T>) {
//   const { onChange: rhfOnChange, ...restRegister } = register(name);

//   // $ Added the rhfOnChange to the onChange event of the select input. This will update the react-hook-form state when the user selects an option. The onChange prop is optional and can be used to perform additional actions when the user selects an option.
//   return (
//     <div className={cn(className, "relative w-full mb-2 group")}>
//       <select
//         {...restRegister}
//         id={String(name)}
//         data-multiple={multiple || undefined} // used to selectively apply the appearance styles in index.css
//         className={cn(
//           selectStyles,
//           // sharedStyles.formSelect,
//           sharedStyles.formInputDefault,
//           error && "border-red-400",
//           // "hover:cursor-pointer",
//           "base-select",
//         )}
//         defaultValue={multiple ? defaultValues || [] : ""}
//         onChange={(event) => {
//           rhfOnChange(event); // ✅ Update RHF state

//           const selectedOptions = multiple
//             ? Array.from(event.target.selectedOptions, (option) => option.value)
//             : [event.target.value];

//           if (onChange) onChange(selectedOptions); // ✅ Your custom logic
//         }}
//         required={required}
//       >
//         {/* Custom button slot — only renders in base-select capable browsers */}
//         <button
//           type="button"
//           className="w-full h-full flex justify-between items-center"
//         >
//           <selectedcontent />
//           <ChevronDownIcon size={14} />
//         </button>

//         {!multiple && (
//           <option value="" disabled hidden>
//             {placeholder}
//           </option>
//         )}
//         {options.map((option, index) => {
//           const value = typeof option === "string" ? option : option.value;
//           const label = typeof option === "string" ? option : option.label;

//           return (
//             <option
//               key={`${value}-${index}`}
//               value={value}
//               className="hover:cursor-pointer"
//             >
//               {label}
//             </option>
//           );
//         })}
//       </select>
//       {/* <span className={cn(sharedStyles.formSelectChevron)}>
//         <ChevronDownIcon size={16} />
//       </span> */}
//       {label && (
//         <label
//           htmlFor={String(name)}
//           className={cn(labelStyles, sharedStyles.formLabel)}
//         >
//           {label}
//           {required && <span className="text-red-500 ml-1">*</span>}
//         </label>
//       )}
//       {error && (
//         <span className={cn(sharedStyles.formError)}>{error.message}</span>
//       )}
//     </div>
//   );
// }

// export default FormRowSelect;
