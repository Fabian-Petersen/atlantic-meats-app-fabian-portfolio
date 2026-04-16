import useGlobalContext from "@/context/useGlobalContext";
import UpdateRequestDialog from "./UpdateRequestDialog";
import DeleteItemModal from "./DeleteItemModal";
import UpdateAssetDialog from "./UpdateAssetDialog";
import UpdateUserDialog from "./UpdateUserDialog";
import ActionRequestDialog from "./ActionRequestDialog";
import RequestRejectedDialog from "./RequestRejectedDialog";
import ApproveRequestDialog from "./ApproveRequestDialog";
import CreateUserDialog from "./CreateUserDialog";

// $ Styles
// import { sharedStyles } from "@/styles/shared";
// import { cn } from "@/lib/utils";

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
    <>
      {showUpdateMaintenanceDialog && <UpdateRequestDialog />}
      {showDeleteDialog && <DeleteItemModal />}
      {showUpdateAssetDialog && <UpdateAssetDialog />}
      {showUserProfileDialog && <UpdateUserDialog />}
      {showActionDialog && <ActionRequestDialog />}
      {showRejectRequestDialog && <RequestRejectedDialog />}
      {showApproveRequestDialog && <ApproveRequestDialog />}
      {showCreateUserDialog && <CreateUserDialog />}
    </>
  );
};

export default ModalManager;
