import useGlobalContext from "@/context/useGlobalContext";
import UpdateRequestDialog from "./UpdateRequestDialog";
import DeleteItemModal from "./DeleteItemModal";
import UpdateAssetDialog from "./UpdateAssetDialog";
import UpdateUserDialog from "./UpdateUserDialog";
import ActionRequestDialog from "./ActionRequestDialog";
import RequestRejectedDialog from "./RequestRejectedDialog";
import ApproveRequestDialog from "./ApproveRequestDialog";
import CreateUserDialog from "./CreateUserDialog";
import clsx from "clsx";

const ModalManager = () => {
  const {
    showUpdateMaintenanceDialog,
    showDeleteDialog,
    showActionDialog,
    showUpdateAssetDialog,
    showUserProfileDialog,
    showRejectRequestDialog,
    showApproveRequestDialog,
    showCreateUserDialog,
  } = useGlobalContext();
  // console.log(showUpdateAssetDialog);
  const isAnyModalOpen =
    showUpdateMaintenanceDialog ||
    showDeleteDialog ||
    showUpdateAssetDialog ||
    showUserProfileDialog ||
    showActionDialog ||
    showRejectRequestDialog ||
    showApproveRequestDialog ||
    showCreateUserDialog;
  // console.log("ModalManager state:", {
  //   showUpdateMaintenanceDialog,
  //   showDeleteDialog,
  //   showUpdateAssetDialog,
  //   isAnyModalOpen,

  // showRejectRequestDialog,
  // });
  if (!isAnyModalOpen) return null;

  return (
    <div
      className={clsx(
        "fixed left-0 right-0 bottom-0",
        "top-(--lg-navbarHeight)",
        "flex items-center justify-center w-full z-2000",
        "bg-black/40 dark:bg-black/30 backdrop-blur-xs",
        "overflow-y-auto",
      )}
    >
      <div className="min-h-[calc(100dvh-var(--lg-navbarHeight))] flex justify-center backdrop-blur-sm w-full">
        {showUpdateMaintenanceDialog && <UpdateRequestDialog />}
        {showDeleteDialog && <DeleteItemModal />}
        {showUpdateAssetDialog && <UpdateAssetDialog />}
        {showUserProfileDialog && <UpdateUserDialog />}
        {showActionDialog && <ActionRequestDialog />}
        {showRejectRequestDialog && <RequestRejectedDialog />}
        {showApproveRequestDialog && <ApproveRequestDialog />}
        {showCreateUserDialog && <CreateUserDialog />}
      </div>
    </div>
  );
};

export default ModalManager;
