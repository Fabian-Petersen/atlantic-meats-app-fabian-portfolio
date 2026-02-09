import type { Dispatch, SetStateAction } from "react";
import type { GlobalData, PendingTableAction } from "../schemas";

import type { Resource } from "@/utils/api";

// $ The config passed to the modal to delete an asset or maintenance item.
export type DeleteConfig = {
  resourcePath: Resource;
  queryKey: readonly unknown[];
} | null;

export type AppContextType = {
  //$ Error State
  hasError: boolean;
  setHasError: Dispatch<SetStateAction<boolean>>;

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

  // $ Modals and Dialog
  showUpdateMaintenanceDialog: boolean;
  setShowUpdateMaintenanceDialog: (v: boolean) => void;
  showActionDialog: boolean;
  setShowActionDialog: (v: boolean) => void;
  setShowUpdateAssetDialog: (v: boolean) => void;
  showUpdateAssetDialog: boolean;
  showUserProfileDialog: boolean;
  setShowUserProfileDialog: (v: boolean) => void;

  // $ TableMenuItems
  setSelectedRowId: (v: string) => void;
  selectedRowId: string | null;

  // $ Delete Modal
  showDeleteDialog: boolean;
  setShowDeleteDialog: (v: boolean) => void;
  setDeleteConfig: (config: DeleteConfig) => void;
  deleteConfig: DeleteConfig | null;

  openDeleteDialog: (id: string, config: DeleteConfig) => void;
  closeDeleteDialog: () => void;

  // deletePayload: DeleteModalPayload | null;
  // setDeletePayload: (payload: DeleteModalPayload | null) => void;

  // $ Data
  genericData: GlobalData | undefined;
  setGenericData<T extends GlobalData>(data: T): void;

  // $ State for the Maintennace and Assets Table Ations (delete, update and edit item)
  pendingTableAction: PendingTableAction;
  setPendingTableAction: Dispatch<SetStateAction<PendingTableAction | null>>;
};

export type DeleteModalPayload = {
  id: string;
  resourcePath: string;
  queryKey: string[];
  title?: string;
  successMessage?: string;
};
