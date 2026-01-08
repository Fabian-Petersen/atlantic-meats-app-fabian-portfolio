import type { Dispatch, SetStateAction } from "react";
import type { CreateJobFormValues } from "../schemas";

export type Theme = "light" | "dark";

export type T = {
  navOpen: boolean;
  setNavOpen: Dispatch<SetStateAction<boolean>>;
  // theme: Theme;
  // setTheme: Dispatch<SetStateAction<Theme>>;
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
  // Action Data
  // actionData: CreateJobFormValues;
  // setActionData: Dispatch<SetStateAction<CreateJobFormValues | null>>;
};
