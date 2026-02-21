// # Import Schemas
import {
  loginSchema,
  changePasswordSchema,
  userAttributesSchema,
  verifyPinSchema,
  forgotPasswordSchema,
} from "./authSchemas";
import { jobRequestSchema } from "./maintenanceJobSchemas";
import { actionRequestSchema } from "./maintenanceActionSchemas";
import { assetRequestSchema } from "./assetSchemas";
import { commentRequestSchema, commentResponseSchema } from "./commentSchemas";

// #  Export Schemas
export {
  jobRequestSchema,
  actionRequestSchema,
  assetRequestSchema,
  loginSchema,
  changePasswordSchema,
  userAttributesSchema,
  verifyPinSchema,
  forgotPasswordSchema,
  commentRequestSchema,
  commentResponseSchema,
};

// ! Types
// % Authentication Types
import type {
  LoginFormValues,
  ForgotFormValues,
  VerifyPinFormValues,
  UserAttributesFormValues,
  ChangePasswordFormValues,
  UserAttributes,
} from "./authSchemas";

// % Create Request Types
import type {
  JobRequestFormValues,
  CreateJobPayload,
  JobAPIResponse,
  MaintenanceTableRow,
} from "./maintenanceJobSchemas";

// % Action Maintenance Request Types
import type {
  ActionRequestPayload,
  ActionAPIResponse,
  ActionRequestFormValues,
} from "./maintenanceActionSchemas";

// % Assets Types
import type {
  AssetRequestFormValues,
  AssetTableRow,
  CreateAssetPayload,
  AssetAPIResponse,
} from "./assetSchemas";

// % Comment Types
import type {
  CommentRequestFormValues,
  CommentPayload,
  CommentAPIResponse,
} from "./commentSchemas";

export type {
  // Auth Types
  LoginFormValues,
  ForgotFormValues,
  VerifyPinFormValues,
  UserAttributesFormValues,
  UserAttributes,
  // Maintenance Request Types
  ChangePasswordFormValues,
  JobRequestFormValues,
  CreateJobPayload,
  JobAPIResponse,
  MaintenanceTableRow,
  // Maintenance Action Types
  ActionRequestFormValues,
  ActionAPIResponse,
  ActionRequestPayload,
  //Asset Types
  AssetRequestFormValues,
  AssetTableRow,
  CreateAssetPayload,
  AssetAPIResponse,
  // Comment
  CommentAPIResponse,
  CommentRequestFormValues,
  CommentPayload,
};

// GlobalContext.ts
export type GlobalData = JobRequestFormValues | AssetRequestFormValues;

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
