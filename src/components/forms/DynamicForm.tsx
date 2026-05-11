// DynamicForm.tsx
// A generic, config-driven form component powered by React Hook Form + Zod.
// Pass a `fields` config array to declaratively render any form layout.

import {
  useForm,
  // type Resolver,
  type FieldValues,
  type Path,
  type FieldError,
  type Control,
  type Resolver,
  type DefaultValues,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import FormRowInput from "../../../customComponents/FormRowInput";
import FormRowSelect from "../../../customComponents/FormRowSelect";
import TextAreaInput from "../../../customComponents/TextAreaInput";
import FileInput from "../../../customComponents/FileInput";
import FormActionButtons from "../features/FormActionButtons";
import { sharedStyles } from "@/styles/shared";

// Bridge the Zod v4 ↔ @hookform/resolvers (Zod v3) type gap without `any`.
// Parameters<...>[0] extracts exactly the schema type zodResolver expects,
// so the cast below is fully grounded in the library's own types.
type ZodResolverSchema = Parameters<typeof zodResolver>[0];

// ─── Field Config Types ───────────────────────────────────────────────────────

type BaseField<T extends FieldValues> = {
  /** Maps to react-hook-form field name */
  name: Path<T>;
  /** Optional label (passed through to the input component) */
  label?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Extra Tailwind classes for this field's wrapper */
  className?: string;
  /** Whether the field is required */
  required?: boolean;
};

export type InputField<T extends FieldValues> = BaseField<T> & {
  fieldType: "input";
  type?: React.HTMLInputTypeAttribute;
};

export type SelectField<T extends FieldValues> = BaseField<T> & {
  fieldType: "select";
  /**
   * Static list of options — use this when options don't depend on other fields.
   * For dynamic/cascading selects, derive `options` in your form wrapper and
   * pass in an updated config array.
   */
  options: string[];
  onChange?: (values: string[]) => void;
};

export type TextAreaField<T extends FieldValues> = BaseField<T> & {
  fieldType: "textarea";
  rows?: number;
};

export type FileField<T extends FieldValues> = BaseField<T> & {
  fieldType: "file";
  multiple?: boolean;
};

export type DynamicFormField<T extends FieldValues> =
  | InputField<T>
  | SelectField<T>
  | TextAreaField<T>
  | FileField<T>;

// ─── DynamicForm Props ────────────────────────────────────────────────────────

export type DynamicFormProps<T extends FieldValues> = {
  /** Zod schema used for validation */
  schema: ZodResolverSchema;
  /** Field configuration array — drives what the form renders */
  fields: DynamicFormField<T>[];
  /** Called with validated form values on submit */
  onSubmit: (values: T) => void | Promise<void>;
  /** Extra Tailwind classes applied to the <form> element */
  className?: string;
  /** Extra Tailwind classes applied to the grid wrapper div */
  gridClassName?: string;
  /** Label for the submit button */
  submitText?: string;
  /** Label for the cancel button */
  cancelText?: string;
  /** Called when cancel is clicked */
  onCancel?: () => void;
  /** Disables buttons while a submission is in flight */
  isPending?: boolean;
  /** Default values pre-populated into the form */
  defaultValues?: DefaultValues<T>;
  // control: Control<T>;
  // register: ReturnType<typeof useForm<T>>["register"];
  // errors: ReturnType<typeof useForm<T>>["formState"]["errors"];
  // handleSubmit: ReturnType<typeof useForm<T>>["handleSubmit"];
};

// ─── Component ────────────────────────────────────────────────────────────────

function DynamicForm<T extends FieldValues>({
  schema,
  fields,
  onSubmit,
  className,
  gridClassName,
  submitText = "Submit",
  cancelText = "Cancel",
  onCancel,
  isPending = false,
  defaultValues,
  // control,
  // register,
  // errors,
  // handleSubmit,
}: DynamicFormProps<T>) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<T>({
    resolver: zodResolver(schema) as unknown as Resolver<T>,
    defaultValues,
  });

  // FieldErrors<T>[Path<T>] is a wide union type; narrow it to FieldError for
  // the individual input components that expect FieldError | undefined.
  const fieldError = (name: Path<T>): FieldError | undefined =>
    errors[name] as FieldError | undefined;

  // Control<T, any> → Control<T> mismatch: cast once here, use typed local.
  const typedControl = control as Control<T>;

  const renderField = (field: DynamicFormField<T>) => {
    switch (field.fieldType) {
      case "input":
        return (
          <FormRowInput
            key={field.name}
            type={field.type ?? "text"}
            name={field.name}
            label={field.label}
            placeholder={field.placeholder}
            register={register}
            error={fieldError(field.name)}
            className={field.className}
            required={field.required}
          />
        );

      case "select":
        return (
          <FormRowSelect
            key={field.name}
            name={field.name}
            label={field.label}
            placeholder={field.placeholder}
            register={register}
            options={field.options}
            error={fieldError(field.name)}
            className={field.className}
            required={field.required}
            onChange={field.onChange}
          />
        );

      case "textarea":
        return (
          <TextAreaInput
            key={field.name}
            name={field.name}
            label={field.label}
            placeholder={field.placeholder}
            register={register}
            error={fieldError(field.name)}
            className={field.className}
            rows={field.rows}
          />
        );

      case "file":
        return (
          <FileInput
            key={field.name}
            name={field.name}
            control={typedControl}
            multiple={field.multiple}
          />
        );

      default:
        return null;
    }
  };

  return (
    <form
      className={cn(sharedStyles.form, className)}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div className={cn(sharedStyles.formParent, gridClassName)}>
        {fields.map(renderField)}
      </div>

      <FormActionButtons
        submitText={submitText}
        cancelText={cancelText}
        onCancel={onCancel}
        isPending={isPending}
      />
    </form>
  );
}

export default DynamicForm;
