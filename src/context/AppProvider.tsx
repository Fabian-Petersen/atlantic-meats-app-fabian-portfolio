import { useState } from "react";
import { AppContext } from "./app-context";
import type { GlobalData, PendingTableAction } from "../schemas";
import type { DeleteConfig } from "./app-types";

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  // $ [Step 3]: Create the state and set the initial state value

  // $ Error State to show the Error Page
  const [hasError, setHasError] = useState<boolean>(false);

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
  const [showUserProfileDialog, setShowUserProfileDialog] =
    useState<boolean>(false);
  const [showUpdateAssetDialog, setShowUpdateAssetDialog] =
    useState<boolean>(false);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfig, setDeleteConfig] = useState<DeleteConfig | null>(null);
  const openDeleteDialog = (id: string, config: DeleteConfig) => {
    setSelectedRowId(id);
    setDeleteConfig(config);
    setShowDeleteDialog(true);
  };

  const closeDeleteDialog = () => {
    setShowDeleteDialog(false);
    setSelectedRowId(null);
    setDeleteConfig(null);
  };

  // $ State for the TableMenuItems
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  // $ State for the data to update/delete an items
  const [genericData, setGenericData] = useState<GlobalData | undefined>(
    undefined,
  ); // Set the generic data

  // $ State handling the actions for the tables (delete, update, edit)
  const [pendingTableAction, setPendingTableAction] =
    useState<PendingTableAction | null>(null);

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
        showUserProfileDialog,
        setShowUserProfileDialog,
        genericData,
        setGenericData,
        hasError,
        setHasError,
        pendingTableAction,
        setPendingTableAction,
        selectedRowId,
        setSelectedRowId,
        deleteConfig,
        setDeleteConfig,
        openDeleteDialog,
        closeDeleteDialog,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
