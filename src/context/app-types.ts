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
  showDeleteDialog: boolean;
  setShowDeleteDialog: (v: boolean) => void;
  showUpdateAssetDialog: boolean;
  setShowUpdateAssetDialog: (v: boolean) => void;

  // $ Data
  genericData: GlobalData | undefined;
  setGenericData<T extends GlobalData>(data: T): void;
};
