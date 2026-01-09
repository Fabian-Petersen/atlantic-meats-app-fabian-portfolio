import { useState } from "react";
import { AppContext } from "./app-context";
import type { CreateJobFormValues } from "../schemas";

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  // $ [Step 3]: Create the state and set the initial state value

  // $ State for the theme mode
  // ? The isDarkTheme is used to set the theme in the 'useSetDarkTheme' hook.
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // $ State for the sidebar behavior
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);

  // $ State for the dialogs (modals)
  const [showUpdateDialog, setShowUpdateDialog] = useState<boolean>(false);
  const [showActionDialog, setShowActionDialog] = useState<boolean>(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false); // Delete confirmation dialog

  // $ State for the data to update/delete an item
  const [data, setData] = useState<CreateJobFormValues | undefined>(undefined); // Stet the data in state for maintenance request to update/delete

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        isDarkTheme,
        setIsDarkTheme,
        isOpen,
        setIsOpen,
        isActive,
        setIsActive,
        activeItem,
        setActiveItem,
        showUpdateDialog,
        setShowUpdateDialog,
        showActionDialog,
        setShowActionDialog,
        showDeleteDialog,
        setShowDeleteDialog,
        data,
        setData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
