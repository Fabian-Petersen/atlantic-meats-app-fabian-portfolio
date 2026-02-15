import * as z from "zod";

// $ Schema for the user attributes
export const userAttributesSchema = z.object({
  email: z.email({ message: "Please enter a valid email" }).optional(),
  name: z.string().min(1, { message: "Your name is required" }).optional(),
  surname: z
    .string()
    .min(1, { message: "Your surname is required" })
    .optional(),
  role: z.string().min(1, { message: "Your role is required" }),
  mobile: z.string().min(1, { message: "Your mobile is required" }).optional(),
  branch: z.string().min(1, { message: "Enter the branch" }),
  division: z.string().min(1, { message: "Enter your division" }),
});

// $ Schema for the Login Form
export const loginSchema = z.object({
  email: z.email({ message: "Please enter a valid email" }),
  password: z
    .string()
    .min(1, { message: "Please enter a valid password" })
    .refine(
      (value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(value),
      {
        message:
          "Password must be 8 characters with one uppercase letter, one lowercase letter and one number",
      },
    ),
});

// $ Schema for the Forgot Password Form
export const forgotPasswordSchema = z.object({
  email: z.email({ message: "Please enter a valid email" }),
});

// $ Schema for the Verify Password Form
export const verifyPinSchema = z.object({
  pin: z
    .string()
    .length(6, "PIN must be 6 digits")
    .regex(/^\d+$/, "PIN must contain only numbers"),
});

export const changePasswordSchema = z
  .object({
    email: z.email({ message: "Please enter a valid email" }),
    newPassword: z
      .string()
      .min(8)
      .regex(/(?=.*[a-z])/)
      .regex(/(?=.*[A-Z])/)
      .regex(/(?=.*\d)/),
    confirmPassword: z.string(),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

// $ User Profile type returned from Cognito.
export type UserAttributes = Partial<Record<string, string>>;
export type LoginFormValues = z.infer<typeof loginSchema>;
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
export type ForgotFormValues = z.infer<typeof forgotPasswordSchema>;
export type VerifyPinFormValues = z.infer<typeof verifyPinSchema>;
export type UserAttributesFormValues = z.infer<typeof userAttributesSchema>;
