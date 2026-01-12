import * as z from "zod";

//$ import types
import { ROOT_CAUSES } from "@/data/maintenanceAction";

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
  id: z.string().optional(), // used by the mobile accordion list
  createdAt: z.string().optional(), // used by the mobile accordion list
  equipment: z.string().min(1, { message: "Please select equipment" }),
  store: z.string().min(1, { message: "Please select a store" }),
  type: z.string().min(1, { message: "Please select maintenance type" }),
  impact: z.string().min(1, { message: "Please select impact" }),
  priority: z.string().min(1, { message: "Please select a priority" }),
  additional_notes: z.string().optional().default(""),
  images: z.array(z.instanceof(File)).default([]).optional(),
});

export const actionJobSchema = z.object({
  start_time: z
    .string()
    .min(1, "Start time required")
    .refine((val) => !Number.isNaN(Date.parse(val)), "Invalid date/time"),
  end_time: z
    .string()
    .min(1, "End time required")
    .refine((val) => !Number.isNaN(Date.parse(val)), "Invalid date/time"),
  start_km: z
    .string()
    .min(1, { message: "Start km is required" })
    .refine(
      (val) => {
        const num = Number(val);
        return Number.isFinite(num) && num > 0;
      },
      { message: "Start km must be a greater than zero" }
    ),
  end_km: z
    .string()
    .min(1, { message: "End km is required" })
    .refine(
      (val) => {
        const num = Number(val);
        return Number.isFinite(num) && num > 0;
      },
      { message: "End km must be a greater than zero" }
    ),
  work_completed: z.string().min(1, { message: "Please enter work completed" }),
  materials: z.string().optional(),
  materials_cost: z.string().min(1, { message: "Please select equipment" }),
  status: z.string().min(1, { message: "" }), // "pending", "in progress", "complete"
  root_cause: z.enum(ROOT_CAUSES, {
    message: "please select a root cause for breakdown",
  }),
  additional_notes: z.string().optional(),
  // images: z.array(z.instanceof(File)).default([]).optional(),

  //$ for the backend
  // id: z.string(),
  // request_id: z.string(),
  // createdAt: z.string().optional(),
  // userName: z.string().optional(),
});
//  description: "",
//       equipment: "",
//       assetID: "",
//       condition: "",
//       location: "",
//       //   warranty: "",
//       serialNumber: "",
//       manufacturer: "",
//       model: "",
//       images: [],

export const assetSchema = z.object({
  id: z.string().optional(),
  createdAt: z.string().optional(),
  business_unit: z.string().min(1, { message: "Business Unit Required" }),
  category: z.string().min(1, { message: "Asset Category Required" }),
  equipment: z.string().min(1, { message: "Please select a equipment" }),
  assetID: z.string().min(1, {
    message: "Please enter asset id",
  }),
  condition: z.string().min(1, { message: "Please select condition" }),
  location: z.string().min(1, { message: "Please select a location" }),
  serialNumber: z.string().optional(),
  additional_notes: z.string().optional(),
  images: z.array(z.instanceof(File)).default([]),
  // manufacturer: z.string().optional(),
  // model: z.string().optional(),
  // date_of_manufacture: z.date().optional(),
  // warranty_expire: z.date().optional(),
  // warranty: z.string().min(1, { message: "Please indicate if warranty valid" }),
  // status: z.string().min(1, { message: "Please select a status" }),
});

export type LoginFormValues = z.infer<typeof LoginSchema>;
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
export type CreateJobFormValues = z.infer<typeof createJobSchema>;
export type ActionJobFormValues = z.infer<typeof actionJobSchema>;
export type AssetFormValues = z.infer<typeof assetSchema>;

export type CreateAssetPayload = Omit<AssetFormValues, "images"> & {
  images: {
    filename: string;
    content_type: string;
  }[];
};

export type CreateJobPayload = Omit<CreateJobFormValues, "images"> & {
  images: {
    filename: string;
    content_type: string;
  }[];
};

export type PresignedUrlResponse = {
  filename?: string;
  url: string;
  key: string;
  content_type: string;
}[];
