import * as z from "zod";

export type UserGroup =
  | "admin"
  | "technician"
  | "manager"
  | "user"
  | "contractor";

export const usersRequestSchema = z.object({
  email: z.email().min(1, "Email is required"),
  group: z.string().min(1, "User group is required"), // admin, technician, contractor, manager, user
  family_name: z.string().min(1, { message: "Surname is required" }),
  name: z.string().min(1, { message: "Name is required" }),
  location: z.string().min(1, { message: "User location is required" }),
  mobile: z
    .string()
    .min(1, { message: "Mobile number is required" })
    .regex(/^0[6-8][0-9]{8}$/, {
      message: "Invalid south african mobile number",
    }),
});

// % Schema expected from the backend
export const usersResponseSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  family_name: z.string(),
  username: z.string(),
  email_verified: z.string(), //Check if database return boolean
  status: z.string(),
  group: z.string(),
  location: z.string(),
  userCreated: z.string(),
  updatedAt: z.string(),
  mobile: z.string(),
});

// $ Type for sending the Action to the backend excluding the images (the images is not included with the initial request). Backend will send a presignURL for the images
export type ActionRequestPayload = Omit<UsersRequestFormValues, "images"> & {
  images: {
    filename: string;
    content_type: string;
  }[];
  signature?: string | null; // base64 PNG
  selectedRowId: string;
  jobCardNumber?: string; // ID of the maintenance request being actioned
};

export type UsersRequestFormValues = z.infer<typeof usersRequestSchema>;
export type UsersAPIResponse = z.infer<typeof usersResponseSchema>;
export type UserUpdateRequest = Partial<Record<string, string>>;
