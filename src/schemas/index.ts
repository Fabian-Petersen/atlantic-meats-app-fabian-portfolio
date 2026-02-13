import * as z from "zod";

//$ import types
import { ROOT_CAUSES } from "@/data/maintenanceAction";

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

export const createJobSchema = z.object({
  id: z.string().optional(), // used by the mobile accordion list
  createdAt: z.string().optional(), // used by the mobile accordion list
  description: z
    .string()
    .min(1, { message: "Give a brief description of works request" }),
  location: z.string().min(1, { message: "Please select a location" }),
  equipment: z.string().min(1, { message: "Please select equipment" }),
  assetID: z.string().optional(),
  type: z.string().min(1, { message: "Please select maintenance type" }),
  impact: z.string().min(1, { message: "Please select impact" }),
  priority: z.string().min(1, { message: "Please select a priority" }),
  additional_notes: z.string().optional().default(""),
  images: z.array(z.instanceof(File)).default([]).optional(),
});

// $ Schema for the Response from the database when fetching the maintenance requests
export const jobResponseSchema = createJobSchema.extend({
  id: z.string(),
  createdAt: z.string(),
  jobCardNumber: z.string(),
  status: z.string(),
});

// $ Schema for the Maintenance Table Menu
export const maintenanceTableRowSchema = createJobSchema.extend({
  id: z.string(),
  createdAt: z.string(),
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
  total_km: z
    .string()
    .min(1, { message: "Total km is required" })
    .refine(
      (val) => {
        const num = Number(val);
        return Number.isFinite(num) && num > 0;
      },
      { message: "Start km must be a greater than zero" },
    ),
  works_order_number: z.string().optional(),
  work_completed: z.string().min(1, { message: "Please enter work completed" }),
  // materials: z.string().optional(),
  // materials_cost: z.string().min(1, { message: "Please select equipment" }),
  status: z.string().min(1, { message: "" }), // "pending", "in progress", "complete"
  root_cause: z.enum(ROOT_CAUSES, {
    message: "please select a root cause for breakdown",
  }),
  findings: z.string().optional(),
  images: z.array(z.instanceof(File)).default([]).optional(),
  signtuture: z.string().optional(),
});

export const assetSchema = z.object({
  id: z.string().optional(),
  createdAt: z.string().optional(),
  business_unit: z.string().min(1, { message: "Business unit required" }),
  area: z.string().min(1, { message: "Area is required" }),
  equipment: z.string().min(1, { message: "Please select a equipment" }),
  assetID: z.string().min(1, {
    message: "Please enter asset id",
  }),
  condition: z.string().min(1, { message: "Please select condition" }),
  location: z.string().min(1, { message: "Please select a location" }),
  serialNumber: z.string().optional(),
  additional_notes: z.string().optional(),
  images: z.array(z.instanceof(File)).default([]),
});

// $ Schema for the Asset Table Menu
export const assetTableRowSchema = assetSchema.extend({
  id: z.string(),
  createdAt: z.string(),
});

// GlobalContext.ts
export type GlobalData = CreateJobFormValues | AssetFormValues;

export type LoginFormValues = z.infer<typeof LoginSchema>;

export type ForgotFormValues = z.infer<typeof forgotPasswordSchema>;
export type VerifyPinFormValues = z.infer<typeof verifyPinSchema>;

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
export type CreateJobFormValues = z.infer<typeof createJobSchema>;
export type JobAPIResponse = z.infer<typeof jobResponseSchema>;
export type MaintenanceTableRow = z.infer<typeof maintenanceTableRowSchema>;
export type ActionJobFormValues = z.infer<typeof actionJobSchema>;
export type AssetFormValues = z.infer<typeof assetSchema>;
export type UserAttributesFormValues = z.infer<typeof userAttributesSchema>;
export type AssetTableRow = z.infer<typeof assetTableRowSchema>;

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

// $ Schema for the Maintenance Action Table Menu
export type CreateActionPayload = Omit<ActionJobFormValues, "images"> & {
  images: {
    filename: string;
    content_type: string;
  }[];
  signature?: string | null; // base64 PNG
  selectedRowId: string;
  jobCardNumber?: string; // ID of the maintenance request being actioned
};

export type PresignedUrlResponse = {
  filename?: string;
  url: string;
  key: string;
  content_type: string;
}[];

// $ Type handling the table menu actions (delete, update, edit, download)
export type PendingTableAction = {
  id: string;
  action: (id: string) => Promise<void>;
} | null;

// $ User Profile type returned from Cognito.
export type UserAttributes = Partial<Record<string, string>>;
