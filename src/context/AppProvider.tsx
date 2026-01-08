import { useContext, useState } from "react";
import { AppContext } from "./app-context";
// export type Theme = "light" | "dark";
import type { CreateJobFormValues } from "../schemas";

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  // $ Step 3: Create the state and set the initial state value
  // ? The navOpen state toggles the navbar on and off on mobile devices
  const [navOpen, setNavOpen] = useState<boolean>(false);

  // ? The isDarkTheme is used to set the theme in the 'useSetDarkTheme' hook.
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(false);

  // $ Set state for the sidebar
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);

  // $ State for the dialogs (modals)
  const [showUpdateDialog, setShowUpdateDialog] = useState<boolean>(false); // update maintenance request modal
  const [showActionDialog, setShowActionDialog] = useState<boolean>(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);

  // $ State for the data to update/delete an item
  const [data, setData] = useState<CreateJobFormValues | undefined>(undefined);

  return (
    <AppContext.Provider
      value={{
        navOpen,
        setNavOpen,
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

export const useGlobalContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within AppProvider");
  }
  return context;
};

export default AppProvider;
