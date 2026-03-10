import useGlobalContext from "@/context/useGlobalContext";
import UpdateRequestDialog from "./UpdateRequestDialog";
import DeleteItemModal from "./DeleteItemModal";
import UpdateAssetDialog from "./UpdateAssetDialog";
import UpdateUserDialog from "./UpdateUserDialog";
import ActionRequestDialog from "./ActionRequestDialog";
import RequestRejectedDialog from "./RequestRejectedDialog";
import ApproveRequestDialog from "./ApproveRequestDialog";

const ModalManager = () => {
  const {
    showUpdateMaintenanceDialog,
    showDeleteDialog,
    showActionDialog,
    showUpdateAssetDialog,
    showUserProfileDialog,
    showRejectRequestDialog,
    showApproveRequestDialog,
  } = useGlobalContext();
  // console.log(showUpdateAssetDialog);
  const isAnyModalOpen =
    showUpdateMaintenanceDialog ||
    showDeleteDialog ||
    showUpdateAssetDialog ||
    showUserProfileDialog ||
    showActionDialog ||
    showRejectRequestDialog ||
    showApproveRequestDialog;
  // console.log("ModalManager state:", {
  //   showUpdateMaintenanceDialog,
  //   showDeleteDialog,
  //   showUpdateAssetDialog,
  //   isAnyModalOpen,

  // showRejectRequestDialog,
  // });
  if (!isAnyModalOpen) return null;

  return (
    <div className="fixed inset-0 w-full h-screen p-4 z-2000 bg-black/40 flex items-center justify-center overflow-y-auto">
      <div className="min-h-dvh flex items-start justify-center p-4">
        {showUpdateMaintenanceDialog && <UpdateRequestDialog />}
        {showDeleteDialog && <DeleteItemModal />}
        {showUpdateAssetDialog && <UpdateAssetDialog />}
        {showUserProfileDialog && <UpdateUserDialog />}
        {showActionDialog && <ActionRequestDialog />}
        {showRejectRequestDialog && <RequestRejectedDialog />}
        {showApproveRequestDialog && <ApproveRequestDialog />}
      </div>
    </div>
  );
};

export default ModalManager;
