import useGlobalContext from "@/context/useGlobalContext";
import UpdateRequestDialog from "./UpdateRequestDialog";
import DeleteItemModal from "./DeleteItemModal";

const ModalManager = () => {
  const { showUpdateDialog, showDeleteDialog } = useGlobalContext();

  const isAnyModalOpen = showUpdateDialog || showDeleteDialog;
  // console.log("ModalManager state:", {
  //   showUpdateDialog,
  //   showDeleteDialog,
  //   isAnyModalOpen,
  // });
  if (!isAnyModalOpen) return null;

  return (
    <div className="fixed inset-0 w-full h-screen p-4 z-2000 bg-black/40 flex items-center justify-center">
      {showUpdateDialog && <UpdateRequestDialog />}
      {showDeleteDialog && <DeleteItemModal />}
    </div>
  );
};

export default ModalManager;
