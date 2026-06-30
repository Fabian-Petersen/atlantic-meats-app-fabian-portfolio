// DynamicForm.tsx
// A generic, config-driven form component powered by React Hook Form + Zod.
// Pass a `fields` config array to declaratively render any form layout.

import {
  // useForm,
  type FieldValues,
  type Path,
  type FieldError,
  type Control,
  // type Resolver,
  type DefaultValues,
  type UseFormReturn,
} from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import FormRowInput from "../../../customComponents/FormRowInput";
import FormRowSelect from "../../../customComponents/FormRowSelect";
import TextAreaInput from "../../../customComponents/TextAreaInput";
import FileInput from "../../../customComponents/FileInput";
import FormRowRadio from "../../../customComponents/FormRowRadio";
import FormActionButtons from "../features/FormActionButtons";
import { sharedStyles } from "@/styles/shared";
import { FormSkeleton } from "./FormSkeleton";
import FormHeading from "../../../customComponents/FormHeading";
import {
  Controller,
  type ControllerRenderProps,
  type ControllerFieldState,
} from "react-hook-form";

// Bridge the Zod v4 ↔ @hookform/resolvers (Zod v3) type gap without `any`.
// Parameters<...>[0] extracts exactly the schema type zodResolver expects,
// so the cast below is fully grounded in the library's own types.
// type ZodResolverSchema = Parameters<typeof zodResolver>[0];

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

export type RadioField<T extends FieldValues> = BaseField<T> & {
  fieldType: "radio";
  options: { label: string; value: string }[];
  orientation?: "row" | "column";
};

export type ControllerField<T extends FieldValues> = BaseField<T> & {
  fieldType: "controller";
  render: (props: {
    field: ControllerRenderProps<T, Path<T>>;
    fieldState: ControllerFieldState;
  }) => React.ReactElement | null;
};

export type DynamicFormField<T extends FieldValues> =
  | InputField<T>
  | SelectField<T>
  | TextAreaField<T>
  | RadioField<T>
  | FileField<T>
  | ControllerField<T>;

// ─── DynamicForm Props ────────────────────────────────────────────────────────
export type DynamicFormProps<T extends FieldValues> = {
  /** Zod schema used for validation */
  form: UseFormReturn<T>;
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
  /** Form heading */
  formHeading?: string;
  /**
   * When true the form renders skeleton placeholders instead of
   * interactive inputs. Pass this while your async data (e.g. `assets`)
   * is still loading so that option arrays are never undefined at render
   * time inside child components.
   */
  isLoading?: boolean;
  redirect?: boolean;
  redirectTo?: string;
};

// ─── Component ────────────────────────────────────────────────────────────────

function DynamicForm<T extends FieldValues>({
  form,
  fields,
  onSubmit,
  className,
  gridClassName,
  submitText = "Submit",
  cancelText = "Cancel",
  onCancel,
  isPending = false,
  isLoading = false, // from the loading state of the query that fetches data for select options
  formHeading,
  redirectTo,
  redirect,
}: DynamicFormProps<T>) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = form;

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
      case "controller":
        return (
          <Controller
            key={field.name}
            name={field.name}
            control={typedControl}
            render={({ field: controllerField, fieldState }) =>
              field.render({
                field: controllerField,
                fieldState,
              }) as React.ReactElement
            }
          />
        );

      case "radio":
        return (
          <FormRowRadio
            key={field.name}
            name={field.name}
            label={field.label}
            register={register}
            options={field.options}
            error={fieldError(field.name)}
            className={field.className}
            required={field.required}
            orientation={field.orientation}
          />
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className={cn(sharedStyles.form, className)}>
        <FormSkeleton />
      </div>
    );
  }

  return (
    <>
      <FormHeading
        className={cn(sharedStyles.headingForm, "px-0")}
        heading={formHeading ?? "Form"}
        redirect={redirect}
        redirectTo={redirectTo}
      />
      <form
        className={cn(sharedStyles.form, className)}
        onSubmit={handleSubmit(onSubmit, (validationErrors) => {
          console.error("Form validation failed:", validationErrors);
        })}
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
    </>
  );
}

export default DynamicForm;
