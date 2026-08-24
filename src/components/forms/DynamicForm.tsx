// DynamicForm.tsx
// A generic, config-driven form component powered by React Hook Form + Zod.
// Pass a `fields` config array to declaratively render any form layout.

import {
  type FieldValues,
  type Path,
  type FieldError,
  type Control,
  type DefaultValues,
  type UseFormReturn,
} from "react-hook-form";

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

  /**
   * Optional field-level loading state.
   *
   * Unlike DynamicForm's `isLoading` prop, this only affects
   * this individual field.
   *
   * Useful for async/cascading fields such as:
   *
   * Location → Area → Equipment → Asset ID
   */
  isLoading?: boolean;

  /**
   * Optional field-level disabled state.
   *
   * Useful when a field depends on another field being selected.
   *
   * Example:
   *
   * Area is disabled until Location has been selected.
   */
  disabled?: boolean;
};

export type InputField<T extends FieldValues> = BaseField<T> & {
  fieldType: "input";
  type?: React.HTMLInputTypeAttribute;
};

export type SelectField<T extends FieldValues> = BaseField<T> & {
  fieldType: "select";

  /**
   * Static list of options — use this when options don't depend on
   * other fields.
   *
   * For dynamic/cascading selects, derive `options` in your form
   * wrapper and pass in an updated config array.
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

type DynamicFormBaseProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  fields: DynamicFormField<T>[];
  className?: string;
  gridClassName?: string;
  submitText?: string;
  cancelText?: string;
  onCancel?: () => void;

  isPending?: boolean;
  defaultValues?: DefaultValues<T>;
  formHeading?: string;
  isLoading?: boolean;
  redirect?: boolean;
  redirectTo?: string;
  formId?: string;
  /**
   * Controls whether DynamicForm renders FormActionButtons
   * inside its own form container.
   *
   * Defaults to true to preserve existing forms.
   *
   * Set to false when the action buttons need to be rendered
   * elsewhere, such as below a dynamic useFieldArray.
   */
  renderActions?: boolean;
};

/**
 * Normal DynamicForm mode.
 *
 * DynamicForm owns the <form> and can optionally render
 * FormActionButtons internally.
 *
 * `onSubmit` is always required when DynamicForm owns
 * the <form>, regardless of whether the action buttons are
 * rendered internally.
 */
type DynamicFormSubmitProps<T extends FieldValues> = {
  renderFieldsOnly?: false;
  renderActions?: boolean;
  onSubmit: (values: T) => void | Promise<void>;
};

/**
 * Field-only DynamicForm mode.
 *
 * DynamicForm is embedded inside another form and therefore
 * does not own submission.
 */
type DynamicFormFieldsOnlyProps = {
  renderFieldsOnly: true;
  onSubmit?: never;
};

export type DynamicFormProps<T extends FieldValues> = DynamicFormBaseProps<T> &
  (DynamicFormSubmitProps<T> | DynamicFormFieldsOnlyProps);

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
  formId,

  // $ Existing whole-form loading behaviour.
  isLoading = false,
  formHeading,
  renderFieldsOnly = false,
  redirectTo,
  redirect,
  renderActions = true,
}: DynamicFormProps<T>) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = form;

  // FieldErrors<T>[Path<T>] is a wide union type; narrow it to
  // FieldError for the individual input components.
  const fieldError = (name: Path<T>): FieldError | undefined =>
    errors[name] as FieldError | undefined;

  // Control<T, any> → Control<T> mismatch:
  // cast once here, use typed local.
  const typedControl = control as Control<T>;

  // ─── Field Renderer ─────────────────────────────────────────────

  const renderField = (field: DynamicFormField<T>) => {
    switch (field.fieldType) {
      // ======================================================================
      // INPUT
      // ======================================================================

      case "input":
        return (
          <FormRowInput
            key={field.name}
            type={field.type ?? "text"}
            name={field.name}
            label={field.label}
            placeholder={field.placeholder}
            register={register}
            control={control}
            error={fieldError(field.name)}
            className={field.className}
            required={field.required}
            // $ Optional field-level state
            isLoading={field.isLoading}
            disabled={field.disabled}
          />
        );

      // ======================================================================
      // SELECT
      // ======================================================================

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
            // $ Optional field-level state
            isLoading={field.isLoading}
            disabled={field.disabled}
          />
        );

      // ======================================================================
      // TEXTAREA
      // ======================================================================

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
            required={field.required}
            // $ Optional field-level state
            isLoading={field.isLoading}
            disabled={field.disabled}
          />
        );

      // ======================================================================
      // FILE
      // ======================================================================

      case "file":
        return (
          <FileInput
            key={field.name}
            name={field.name}
            control={typedControl}
            label={field.label}
            multiple={field.multiple}
            placeholder={field.placeholder}
            className={field.className}
            error={fieldError(field.name)}
            required={field.required}
            // $ Optional field-level state
            isLoading={field.isLoading}
            disabled={field.disabled}
          />
        );

      // ======================================================================
      // CONTROLLER
      // ======================================================================

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

      // ======================================================================
      // RADIO
      // ======================================================================

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
            // $ Optional field-level state
            isLoading={field.isLoading}
            disabled={field.disabled}
          />
        );

      default:
        return null;
    }
  };

  // ─── Whole Form Loading ─────────────────────────────────────────

  /*
   * IMPORTANT:
   *
   * This is the original DynamicForm-level loading behaviour.
   *
   * If an implementation passes:
   *
   *     <DynamicForm isLoading />
   *
   * the complete form is replaced by FormSkeleton.
   *
   * Field-level `isLoading` does NOT come through here.
   */

  if (isLoading) {
    return (
      <div className={cn(sharedStyles.form, className)}>
        <FormSkeleton />
      </div>
    );
  }

  if (renderFieldsOnly) {
    return (
      <div className={cn(sharedStyles.formParent, gridClassName)}>
        {fields.map(renderField)}
      </div>
    );
  }

  const handleFormSubmit = handleSubmit(
    async (values) => {
      if (onSubmit) {
        await onSubmit(values);
      }
    },

    (validationErrors) => {
      console.error("Form validation failed:", validationErrors);
    },
  );

  // ─── Form ──────────────────────────────────────────────────────

  return (
    <>
      <FormHeading
        className={cn(sharedStyles.headingForm, "px-0")}
        heading={formHeading ?? "Form"}
        redirect={redirect}
        redirectTo={redirectTo}
      />

      <form
        id={formId}
        className={cn(sharedStyles.form, className)}
        onSubmit={handleFormSubmit}
        noValidate
      >
        <div className={cn(sharedStyles.formParent, gridClassName)}>
          {fields.map(renderField)}
        </div>

        {renderActions && (
          <FormActionButtons
            submitText={submitText}
            cancelText={cancelText}
            onCancel={onCancel}
            isPending={isPending}
          />
        )}
      </form>
    </>
  );
}

export default DynamicForm;

export const DynamicFormActions = ({
  formId,
  submitText = "Submit",
  cancelText = "Cancel",
  onCancel,
  isPending = false,
}: {
  formId?: string;
  submitText?: string;
  cancelText?: string;
  onCancel?: () => void;
  isPending?: boolean;
}) => {
  return (
    <FormActionButtons
      formId={formId}
      submitText={submitText}
      cancelText={cancelText}
      onCancel={onCancel}
      isPending={isPending}
    />
  );
};
