import type { Dispatch, SetStateAction } from "react";
import type { GlobalData, PendingTableAction } from "../schemas";

import type { Resource, RedirectResource } from "@/utils/api";

// $ The config passed to the modal to delete an asset or maintenance item.

/**
 * DeleteConfig: The config passed to the modal to delete an asset or maintenance item. It includes the resourcePath to specify the backend resource to send the delete request to, the queryKey to invalidate after deletion to ensure the UI is updated, and an optional resourceName to display in the modal text.
 * resourcePath: backend resource path e.g. "asset" or "jobs" - used to construct the endpoint to send the delete request to the backend
 *
 * queryKey: to invalidate after deletion e.g. ["assets"] or ["maintenanceRequests", "pending"] - used to invalidate the relevant queries in the react-query cache to ensure the UI is updated after deletion
 *
 * resourceName: e.g. "asset" or "maintenance request" - used to display in the modal text
 */

export type DeleteConfig = {
  /**
   * resourcePath: backend resource path e.g. "asset" or "jobs" - used to construct the endpoint to send the delete request to the backend
   *
   */
  resourcePath: Resource;
  /**
   * queryKey: to invalidate after deletion e.g. ["assets"] or ["maintenanceRequests", "pending"] - used to invalidate the relevant queries in the react-query cache to ensure the UI is updated after deletion
   *
   */

  queryKey: readonly unknown[];
  /** ResourceName: e.g. "asset" or "maintenance request" - used to display in the modal text*/
  resourceName?: string;
};

/**
 * SuccessConfig: The config passed to the success toast after a successful action such as deletion, creation, update, approval or rejection of a maintenance request or asset. It includes an optional title and message to display in the toast, as well as an optional redirectPath to navigate the user to a relevant page after the action is completed.
 *
 * title: The title to display in the success toast after a successful action.
 *
 * message: The message to display in the success toast after a successful action.
 *
 * redirectPath: to redirect after successful action e.g. "assets/list" or "jobs/pending-approval" - used to navigate the user to a relevant page after a successful action, such as deletion, creation, update, approval or rejection of a maintenance request or asset.
 *
 *
 */
export type SuccessConfig = {
  title?: string;
  message?: string;
  /**
   * redirectPath: to redirect after successful action e.g. "assets/list" or "jobs/pending-approval" - used to navigate the user to a relevant page after a successful action, such as deletion, creation, update, approval or rejection of a maintenance request or asset.
   */
  redirectPath?: RedirectResource | null;
} | null;

export type AppContextType = {
  //$ Error State
  showError: boolean;
  setShowError: Dispatch<SetStateAction<boolean>>;

  //$ Success State
  showSuccess: boolean;
  setShowSuccess: Dispatch<SetStateAction<boolean>>;
  setSuccessConfig: (config: SuccessConfig) => void;
  successConfig: SuccessConfig | null;

  //$ Theme State
  theme: "light" | "dark";
  setTheme: Dispatch<SetStateAction<"light" | "dark">>;
  isDarkTheme: boolean;
  setIsDarkTheme: Dispatch<SetStateAction<boolean>>;

  // $ Sidebar State
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  isActive: boolean;
  setIsActive: Dispatch<SetStateAction<boolean>>;
  activeItem: string | null;
  setActiveItem: Dispatch<SetStateAction<string | null>>;

  // $ Comments Sidebar State
  openChatSidebar: boolean;
  setOpenChatSidebar: Dispatch<SetStateAction<boolean>>;

  // $ Notifications Sidebar State
  openNotificationSidebar: boolean;
  setOpenNotificationSidebar: Dispatch<SetStateAction<boolean>>;

  // $ Modals and Dialog
  showUpdateMaintenanceDialog: boolean;
  setShowUpdateMaintenanceDialog: (v: boolean) => void;
  showActionDialog: boolean;
  setShowActionDialog: (v: boolean) => void;
  setShowUpdateAssetDialog: (v: boolean) => void;
  showUpdateAssetDialog: boolean;
  showUserProfileDialog: boolean;
  setShowUserProfileDialog: (v: boolean) => void;

  // $ Create User Dialog
  showCreateUserDialog: boolean;
  setShowCreateUserDialog: (v: boolean) => void;

  // $ TableMenuItems
  setSelectedRowId: (v: string) => void;
  selectedRowId: string | null;

  // $ Delete Modal
  showDeleteDialog: boolean;
  setShowDeleteDialog: (v: boolean) => void;
  setDeleteConfig: (config: DeleteConfig) => void;
  deleteConfig: DeleteConfig | null;

  // $ Reject Request Modal
  showRejectRequestDialog: boolean;
  setShowRejectRequestDialog: (v: boolean) => void;

  // $ Approve Request Modal
  showApproveRequestDialog: boolean;
  setShowApproveRequestDialog: (v: boolean) => void;

  openDeleteDialog: (id: string, config: DeleteConfig) => void;
  closeDeleteDialog: () => void;

  // deletePayload: DeleteModalPayload | null;
  // setDeletePayload: (payload: DeleteModalPayload | null) => void;

  // $ Data
  genericData: GlobalData | undefined;
  setGenericData<T extends GlobalData>(data: T): void;

  // $ Table Search State
  globalFilter: string;
  setGlobalFilter: Dispatch<SetStateAction<string>>;

  // $ State for the Maintennace and Assets Table Ations (delete, update and edit item)
  pendingTableAction: PendingTableAction;
  setPendingTableAction: Dispatch<SetStateAction<PendingTableAction | null>>;

  // $ User
  setUserId: (v: string) => void;
  userId: string | null;
};

export type DeleteModalPayload = {
  id: string;
  resourcePath: string;
  queryKey: string[];
  title?: string;
  successMessage?: string;
};
