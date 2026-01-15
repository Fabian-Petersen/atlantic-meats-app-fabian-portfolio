import type { Dispatch, SetStateAction } from "react";
import type { GlobalData } from "../schemas";

export type AppContextType = {
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

  // $ Delete Modal
  showDeleteDialog: boolean;
  setShowDeleteDialog: (v: boolean) => void;
  deletePayload: DeleteModalPayload | null;
  setDeletePayload: (payload: DeleteModalPayload | null) => void;

  // $ Data
  genericData: GlobalData | undefined;
  setGenericData<T extends GlobalData>(data: T): void;
};

export type DeleteModalPayload = {
  id: string;
  endpoint: string;
  queryKey: string[];
  title?: string;
  successMessage?: string;
};
