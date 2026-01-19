import useGlobalContext from "@/context/useGlobalContext";
import UpdateRequestDialog from "./UpdateRequestDialog";
import DeleteItemModal from "./DeleteItemModal";
import UpdateAssetDialog from "./UpdateAssetDialog";
import UpdateUserDialog from "./UpdateUserDialog";

const ModalManager = () => {
  const {
    showUpdateMaintenanceDialog,
    showDeleteDialog,
    showUpdateAssetDialog,
    showUserProfileDialog,
  } = useGlobalContext();

  const isAnyModalOpen =
    showUpdateMaintenanceDialog ||
    showDeleteDialog ||
    showUpdateAssetDialog ||
    showUserProfileDialog;
  // console.log("ModalManager state:", {
  //   showUpdateMaintenanceDialog,
  //   showDeleteDialog,
  //   showUpdateAssetDialog,
  //   isAnyModalOpen,
  // });
  if (!isAnyModalOpen) return null;

  return (
    <div className="fixed inset-0 w-full h-screen p-4 z-2000 bg-black/40 flex items-center justify-center">
      {showUpdateMaintenanceDialog && <UpdateRequestDialog />}
      {showDeleteDialog && <DeleteItemModal />}
      {showUpdateAssetDialog && <UpdateAssetDialog />}
      {showUserProfileDialog && <UpdateUserDialog />}
    </div>
  );
};

export default ModalManager;
