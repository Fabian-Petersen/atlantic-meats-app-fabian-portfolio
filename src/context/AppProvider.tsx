import { useState } from "react";
import { AppContext } from "./app-context";
import type { GlobalData } from "../schemas";
import type { DeleteModalPayload } from "./app-types";

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
  const [showUpdateMaintenanceDialog, setShowUpdateMaintenanceDialog] =
    useState<boolean>(false);
  const [showActionDialog, setShowActionDialog] = useState<boolean>(false);
  const [showUpdateAssetDialog, setShowUpdateAssetDialog] =
    useState<boolean>(false);

  const [deletePayload, setDeletePayload] = useState<DeleteModalPayload | null>(
    null
  );

  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);

  // $ State for the data to update/delete an item
  const [genericData, setGenericData] = useState<GlobalData | undefined>(
    undefined
  ); // Set the generic data

  // const [assetsData, setAssetsData] = useState<AssetFormValues | undefined>(
  //   undefined
  // ); // Set the data for Assets

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
        showUpdateMaintenanceDialog,
        setShowUpdateMaintenanceDialog,
        showUpdateAssetDialog,
        setShowUpdateAssetDialog,
        showActionDialog,
        setShowActionDialog,
        showDeleteDialog,
        setShowDeleteDialog,
        deletePayload,
        setDeletePayload,
        genericData,
        setGenericData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
