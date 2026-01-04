import { useGlobalContext } from "@/useGlobalContext";
import UpdateRequestDialog from "./UpdateRequestDialog";

const ModalManager = () => {
  const { showUpdateDialog } = useGlobalContext();

  const isAnyModalOpen = showUpdateDialog;
  if (!isAnyModalOpen) return null;

  return (
    <div className="fixed inset-0 w-full h-screen p-4 z-3000">
      {showUpdateDialog && <UpdateRequestDialog />}
      {/* {isDeleteModalOpen && (
        <DialogConfirmDeleteModal closeModal={setIsDeleteModalOpen} />
      )} */}
    </div>
  );
};

export default ModalManager;
