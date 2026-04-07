// # Import Schemas
import {
  loginSchema,
  changePasswordSchema,
  userAttributesSchema,
  verifyPinSchema,
  forgotPasswordSchema,
} from "./authSchemas";
import { jobRequestSchema } from "./jobSchemas";
import { actionRequestSchema } from "./actionSchemas";
import { assetRequestSchema } from "./assetSchemas";
import { commentRequestSchema, commentResponseSchema } from "./commentSchemas";
import { usersResponseSchema, usersRequestSchema } from "./usersSchema";

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
  usersResponseSchema,
  usersRequestSchema,
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
  JobTableRow,
} from "./jobSchemas";

// % Action Maintenance Request Types
import type {
  ActionRequestPayload,
  ActionAPIResponse,
  ActionRequestFormValues,
  ActionTableRow,
} from "./actionSchemas";

// % Assets Types
import type {
  AssetRequestFormValues,
  AssetTableRow,
  CreateAssetPayload,
  AssetAPIResponse,
  PresignedURL,
} from "./assetSchemas";

// % Comment Types
import type {
  CommentRequestFormValues,
  CommentPayload,
  CommentAPIResponse,
} from "./commentSchemas";

// % Dashboard Types
import type {
  PendingJobCardItem,
  ApprovedJobCardItem,
  OverdueJobCardItem,
  AssetCardItem,
  AssetMetrics,
  ActionMetrics,
} from "./dashboardSchema";

// % Dashboard Types
import type {
  UsersAPIResponse,
  UsersRequestFormValues,
  UserUpdateRequest,
} from "./usersSchema";

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
  JobTableRow,
  // Maintenance Action Types
  ActionRequestFormValues,
  ActionAPIResponse,
  ActionRequestPayload,
  ActionTableRow,
  //Asset Types
  AssetRequestFormValues,
  AssetTableRow,
  CreateAssetPayload,
  AssetAPIResponse,
  // Comment
  CommentAPIResponse,
  CommentRequestFormValues,
  CommentPayload,
  //Images
  PresignedURL,
  //Dashboard
  AssetCardItem,
  PendingJobCardItem,
  ApprovedJobCardItem,
  OverdueJobCardItem,
  ActionMetrics,
  AssetMetrics,
  // Users
  UsersAPIResponse,
  UsersRequestFormValues,
  UserUpdateRequest,
};

// GlobalContext.ts
export type GlobalData = JobRequestFormValues | AssetRequestFormValues;

export type PresignedUrlResponse = {
  filename?: string;
  url: string;
  key: string;
  content_type: string;
}[];

export type JobcardPresignedUrlResponse = {
  jobcard_url: string;
};

// $ Generic Table schema for the Rows and Columns
export type TableRows = AssetTableRow | JobTableRow;
export type APIData = JobAPIResponse | AssetAPIResponse;

// $ Type handling the table menu actions (delete, update, edit, download)
export type PendingTableAction = {
  id: string;
  action: (id: string) => Promise<void>;
} | null;
