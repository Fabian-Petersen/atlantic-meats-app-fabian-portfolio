import { useState } from "react";
import type { ZodSchema } from "zod";

type FormErrors = {
  [key: string]: string;
};

export const useValidateFormZod = (
  formData: Record<string, unknown>,
  formSchema: ZodSchema
) => {
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [formStatus, setFormStatus] = useState<"idle" | "error" | "success">(
    "idle"
  );

  const validateForm = () => {
    const result = formSchema.safeParse(formData);
    if (!result.success) {
      const errors: FormErrors = {};
      result.error.issues.forEach((error) => {
        if (error.path && error.path.length > 0) {
          errors[String(error.path[0])] = error.message;
        }
      });
      setFormErrors(errors);
      setFormStatus("error");
      return false;
    } else {
      setFormErrors({});
      setFormStatus("success");
      return true;
    }
  };

  // $ Styling for the different form statuses,..
  const getInputStyle = (fieldName: string) => {
    const baseStyle =
      "w-full p-2 rounded outline-none transition-all duration-200";

    if (formErrors[fieldName]) {
      return (
        baseStyle +
        "border-1 border-red-500 focus:ring-2 focus:ring-red-500 bg-red-50 outline-1"
      );
    }

    if (formStatus === "success") {
      return (
        baseStyle +
        "border-1 border-green-500 focus:ring-2 focus:ring-green-500"
      );
    }

    return (
      baseStyle +
      "border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 bg-gray-200 dark:bg-gray-700"
    );
  };

  return {
    formErrors,
    formStatus,
    setFormErrors,
    setFormStatus,
    validateForm,
    getInputStyle,
  };
};
