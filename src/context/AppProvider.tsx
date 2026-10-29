import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useLocation } from "react-router-dom";
import { AppContext } from "./app-context";
import { ModalStateContext } from "./modal-context";
import type {
  GlobalData,
  PendingTableAction,
  UsersAPIResponse,
} from "../schemas";
import type {
  DeleteConfig,
  ErrorConfig,
  SuccessConfig,
  RejectConfig,
  AssetRegisterTableState,
} from "./app-types";

const createDefaultAssetRegisterTableState = (): AssetRegisterTableState => ({
  globalFilter: "",
  columnFilters: [],
  desktopSorting: [],
  desktopPagination: { pageIndex: 0, pageSize: 10 },
  mobileSorting: [{ id: "createdAt", desc: true }],
  mobilePagination: { pageIndex: 0, pageSize: 10 },
});

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const { pathname } = useLocation();
  // $ [Step 3]: Create the state and set the initial state value

  // $ State for the Error and Success Components
  const [showError, setShowError] = useState<boolean>(false);
  const [errorConfig, setErrorConfig] = useState<ErrorConfig | null>(null);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [successConfig, setSuccessConfig] = useState<SuccessConfig | null>(
    null,
  );
  const [rejectConfig, setRejectConfig] = useState<RejectConfig | null>(null);

  // $ State for the theme mode
  // ? The isDarkTheme is used to set the theme in the 'useSetDarkTheme' hook.
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // $ State for the sidebar behavior
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);

  // $ State for the Comments Sidebar behavior
  const [openChatSidebar, setOpenChatSidebarState] = useState<boolean>(false);

  // $ State for the Notifications Sidebar behavior
  const [openNotificationSidebar, setOpenNotificationSidebarState] =
    useState<boolean>(false);

  const setOpenChatSidebar = useCallback<
    Dispatch<SetStateAction<boolean>>
  >((value) => {
    if (value === true) setOpenNotificationSidebarState(false);
    setOpenChatSidebarState(value);
  }, []);

  const setOpenNotificationSidebar = useCallback<
    Dispatch<SetStateAction<boolean>>
  >((value) => {
    if (value === true) setOpenChatSidebarState(false);
    setOpenNotificationSidebarState(value);
  }, []);

  // $ State for the Search Input behavior
  const [openSearchInput, setOpenSearchInput] = useState<boolean>(false);

  // $ State for the dialogs (modals)
  const [showUpdateMaintenanceDialog, setShowUpdateMaintenanceDialog] =
    useState<boolean>(false);
  const [showActionDialog, setShowActionDialog] = useState<boolean>(false);
  const [showUserProfileDialog, setShowUserProfileDialog] =
    useState<boolean>(false);
  const [showUpdateAssetDialog, setShowUpdateAssetDialog] =
    useState<boolean>(false);
  const [showManualVerificationDialog, setShowManualVerificationDialog] =
    useState<boolean>(false);

  // $ Reject Request Modal
  const [showRejectRequestDialog, setShowRejectRequestDialog] = useState(false);
  const [showRejectRequestDialogGeneric, setShowRejectRequestDialogGeneric] =
    useState(false);

  // $ Approve Request Modal
  const [showApproveRequestDialog, setShowApproveRequestDialog] =
    useState(false);

  // $ Approve Transfer Request Modal
  const [showApproveTransferDialog, setShowApproveTransferDialog] =
    useState(false);

  // $ Create User Modal
  const [showCreateUserDialog, setShowCreateUserDialog] = useState(false);

  // $ State for the TableMenuItems
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  // $ Delete Modal
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfig, setDeleteConfig] = useState<DeleteConfig | null>(null);
  const openDeleteDialog = useCallback((id: string, config: DeleteConfig) => {
    setSelectedRowId(id);
    setDeleteConfig(config);
    setShowDeleteDialog(true);
  }, []);

  const closeDeleteDialog = useCallback(() => {
    setShowDeleteDialog(false);
    setSelectedRowId(null);
    setDeleteConfig(null);
  }, []);

  // $ State for the data to update/delete an items
  const [genericData, setGenericData] = useState<GlobalData | undefined>(
    undefined,
  ); // Set the generic data

  // $ State handling the actions for the tables (delete, update, edit)
  const [pendingTableAction, setPendingTableAction] =
    useState<PendingTableAction | null>(null);

  const [globalFilter, setGlobalFilter] = useState("");
  const [assetRegisterTableState, setAssetRegisterTableState] =
    useState<AssetRegisterTableState>(createDefaultAssetRegisterTableState);
  const wasInAssetsModule = useRef(pathname.startsWith("/assets"));

  useEffect(() => {
    const isInAssetsModule = pathname.startsWith("/assets");

    if (wasInAssetsModule.current && !isInAssetsModule) {
      setAssetRegisterTableState(createDefaultAssetRegisterTableState());
    }

    wasInAssetsModule.current = isInAssetsModule;
  }, [pathname]);

  // $ State for the User
  const [userId, setUserId] = useState<string | null>(null);
  const [user, setUser] = useState<UsersAPIResponse | null>(null);

  const modalState = useMemo(
    () => ({
      showUpdateMaintenanceDialog,
      showActionDialog,
      showUpdateAssetDialog,
      showManualVerificationDialog,
      showUserProfileDialog,
      showCreateUserDialog,
      showDeleteDialog,
      showRejectRequestDialog,
      showRejectRequestDialogGeneric,
      showApproveRequestDialog,
      showApproveTransferDialog,
      selectedRowId,
      deleteConfig,
      rejectConfig,
    }),
    [
      showUpdateMaintenanceDialog,
      showActionDialog,
      showUpdateAssetDialog,
      showManualVerificationDialog,
      showUserProfileDialog,
      showCreateUserDialog,
      showDeleteDialog,
      showRejectRequestDialog,
      showRejectRequestDialogGeneric,
      showApproveRequestDialog,
      showApproveTransferDialog,
      selectedRowId,
      deleteConfig,
      rejectConfig,
    ],
  );

  const appContextValue = useMemo(
    () => ({
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
      setShowUpdateMaintenanceDialog,
      setShowUpdateAssetDialog,
      setShowManualVerificationDialog,
      setShowActionDialog,
      setShowDeleteDialog,
      setShowUserProfileDialog,
      genericData,
      setGenericData,
      showError,
      setShowError,
      showSuccess,
      setShowSuccess,
      pendingTableAction,
      setPendingTableAction,
      setSelectedRowId,
      setDeleteConfig,
      openDeleteDialog,
      closeDeleteDialog,
      openChatSidebar,
      setOpenChatSidebar,
      setShowRejectRequestDialog,
      setShowApproveRequestDialog,
      successConfig,
      setSuccessConfig,
      globalFilter,
      setGlobalFilter,
      assetRegisterTableState,
      setAssetRegisterTableState,
      setShowCreateUserDialog,
      openNotificationSidebar,
      setOpenNotificationSidebar,
      user,
      setUser,
      userId,
      setUserId,
      errorConfig,
      setErrorConfig,
      openSearchInput,
      setOpenSearchInput,
      setShowApproveTransferDialog,
      setRejectConfig,
      setShowRejectRequestDialogGeneric,
    }),
    [
      theme,
      isDarkTheme,
      isOpen,
      isActive,
      activeItem,
      genericData,
      showError,
      showSuccess,
      pendingTableAction,
      openDeleteDialog,
      closeDeleteDialog,
      openChatSidebar,
      setOpenChatSidebar,
      successConfig,
      globalFilter,
      assetRegisterTableState,
      openNotificationSidebar,
      setOpenNotificationSidebar,
      user,
      userId,
      errorConfig,
      openSearchInput,
    ],
  );

  return (
    <AppContext.Provider value={appContextValue}>
      <ModalStateContext.Provider value={modalState}>
        {children}
      </ModalStateContext.Provider>
    </AppContext.Provider>
  );
};

export default AppProvider;
