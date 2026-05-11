// import type { FieldError, UseFormRegister, Control } from "react-hook-form";
import type { FieldError } from "react-hook-form";

type SelectOption = string | { label: string; value: string };

export type FormFieldConfig<T> = {
  fieldType: "input" | "select" | "textarea" | "file";
  type?: string; // for input fields
  name: keyof T;
  placeholder?: string;
  options?: SelectOption[];
  className?: string;
  rows?: number;
  multiple?: boolean;
  onChange?: (value: string) => void;
  error?: FieldError;
};
