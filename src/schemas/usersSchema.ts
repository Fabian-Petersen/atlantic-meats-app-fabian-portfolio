import * as z from "zod";

export const usersRequestSchema = z.object({
  email: z.email().min(1, "email is required"),
  group: z.string().min(1, "user group is required"),
  family_name: z.string().min(1, { message: "surname is required" }),
  name: z.string().min(1, { message: "name is required" }),
  location: z.string().min(1, { message: "the user location is required" }),
});

// item = {
//     "id": user_attrs["sub"],
//     "email": user_attrs.get("email", ""),
//     "name": user_attrs.get("name", ""),
//     "family_name": user_attrs.get("family_name", ""),
//     "username": event.get("userName", user_attrs["sub"]),
//     "email_verified": user_attrs.get("email_verified", "false").lower() == "true",
//     "status": "CONFIRMED",
//     "groups": [],
//     "location": "",
//     "createdAt": to_human_date(now),
//     "updatedAt": to_human_date(now),
// }

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
