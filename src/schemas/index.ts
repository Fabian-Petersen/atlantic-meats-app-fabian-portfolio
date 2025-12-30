import * as z from "zod";

// $ Schema for the Login Form
export const LoginSchema = z.object({
  email: z.email({ message: "Please enter a valid email" }),
  password: z
    .string()
    .min(1, { message: "Please enter a valid password" })
    .refine(
      (value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(value),
      {
        message:
          "Password must be 8 characters with one uppercase letter, one lowercase letter and one number",
      }
    ),
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

export const createJobSchema = z.object({
  description: z.string().min(1, {
    message: "Please enter a description",
  }),
  store: z.string().min(1, { message: "Please select a store" }),
  type: z.string().min(1, { message: "Please select maintenance type" }),
  impact: z.string().min(1, { message: "Please select impact" }),
  priority: z.string().min(1, { message: "Please select a priority" }),
  // status: z.string().min(1, { message: "Please select a status" }),
  // type: z.string().min(1, { message: "Please select a type" }),
  equipment: z.string().min(1, { message: "Please select equipment" }),
  id: z.string().optional(),
  createdAt: z.string().optional(),
  userName: z.string().optional(),
  // images: z.array(z.string()).default([]),
});

export const assetSchema = z.object({
  id: z.string().optional(),
  createdAt: z.string().optional(),
  description: z.string().min(1, {
    message: "Please enter a description",
  }),
  assetID: z.string().min(1, {
    message: "Please enter asset id",
  }),
  condition: z.string().min(1, { message: "Please select condition" }),
  location: z.string().min(1, { message: "Please select a location" }),
  warranty: z.boolean(),
  warranty_expire: z.date().optional(),
  serialNumber: z.string().optional(),
  manufacturer: z.string().optional(),
  date_of_manufacture: z.date().optional(),
  model: z.string().optional(),
  status: z.string().min(1, { message: "Please select a status" }),
  type: z.string().min(1, { message: "Please select a type" }),
  // images: z.array(z.string()).default([]),
});

export type LoginFormValues = z.infer<typeof LoginSchema>;
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
export type CreateJobFormValues = z.infer<typeof createJobSchema>;
export type AssetFormValues = z.infer<typeof assetSchema>;
