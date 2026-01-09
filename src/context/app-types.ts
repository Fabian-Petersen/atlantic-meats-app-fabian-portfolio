import type { Dispatch, SetStateAction } from "react";
import type { AssetFormValues, CreateJobFormValues } from "../schemas";

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
  showUpdateDialog: boolean;
  setShowUpdateDialog: Dispatch<SetStateAction<boolean>>;
  showActionDialog: boolean;
  setShowActionDialog: Dispatch<SetStateAction<boolean>>;
  showDeleteDialog: boolean;
  setShowDeleteDialog: Dispatch<SetStateAction<boolean>>;

  // $ Data
  data: CreateJobFormValues | undefined;
  setData: Dispatch<SetStateAction<CreateJobFormValues | undefined>>;

  assetsData: AssetFormValues | undefined;
  setAssetsData: Dispatch<SetStateAction<AssetFormValues | undefined>>;
};
