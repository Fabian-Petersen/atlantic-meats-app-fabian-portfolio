import { createContext } from "react";
import type { DeleteConfig, RejectConfig } from "./app-types";

export type ModalStateContextType = {
  showUpdateMaintenanceDialog: boolean;
  showActionDialog: boolean;
  showUpdateAssetDialog: boolean;
  showManualVerificationDialog: boolean;
  showUserProfileDialog: boolean;
  showCreateUserDialog: boolean;
  showDeleteDialog: boolean;
  showRejectRequestDialog: boolean;
  showRejectRequestDialogGeneric: boolean;
  showApproveRequestDialog: boolean;
  showApproveTransferDialog: boolean;
  selectedRowId: string | null;
  deleteConfig: DeleteConfig | null;
  rejectConfig: RejectConfig | null;
};

export const ModalStateContext = createContext<ModalStateContextType | null>(
  null,
);
