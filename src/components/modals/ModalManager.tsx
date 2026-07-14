import useGlobalContext from "@/context/useGlobalContext";
import UpdateRequestDialog from "./UpdateRequestDialog";
import DeleteItemModal from "./DeleteItemModal";
import UpdateAssetDialog from "./UpdateAssetDialog";
import UpdateUserDialog from "./UpdateUserDialog";
import ActionRequestDialog from "./ActionRequestDialog";
import RequestRejectedDialog from "./RequestRejectedDialog";
import ApproveRequestDialog from "./ApproveRequestDialog";
import CreateUserDialog from "./CreateUserDialog";
import ApproveTransferRequestDialog from "./ApproveTransferRequestDialog";
import RejectRequestDialogGeneric from "./RejectRequestDialogGeneric";

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
    showApproveTransferDialog,
    showCreateUserDialog,
    showRejectRequestDialogGeneric,
  } = useGlobalContext();
  // console.log(showUpdateAssetDialog);
  const isAnyModalOpen =
    showUpdateMaintenanceDialog ||
    showDeleteDialog ||
    showUpdateAssetDialog ||
    showUserProfileDialog ||
    showActionDialog ||
    showRejectRequestDialog ||
    showRejectRequestDialogGeneric ||
    showApproveRequestDialog ||
    showApproveTransferDialog ||
    showCreateUserDialog;
  if (!isAnyModalOpen) return null;

  return (
    <>
      {showUpdateMaintenanceDialog && <UpdateRequestDialog />}
      {showDeleteDialog && <DeleteItemModal />}
      {showUpdateAssetDialog && <UpdateAssetDialog />}
      {showUserProfileDialog && <UpdateUserDialog />}
      {showActionDialog && <ActionRequestDialog />}
      {showApproveRequestDialog && <ApproveRequestDialog />}
      {showApproveTransferDialog && <ApproveTransferRequestDialog />}
      {showCreateUserDialog && <CreateUserDialog />}
      {showRejectRequestDialog && <RequestRejectedDialog />}
      {showRejectRequestDialogGeneric && <RejectRequestDialogGeneric />}
    </>
  );
};

export default ModalManager;
