import useGlobalContext from "@/context/useGlobalContext";
import { lazy, Suspense } from "react";

const UpdateRequestDialog = lazy(() => import("./UpdateRequestDialog"));
const DeleteItemModal = lazy(() => import("./DeleteItemModal"));
const UpdateAssetDialog = lazy(() => import("./UpdateAssetDialog"));
const UpdateUserDialog = lazy(() => import("./UpdateUserDialog"));
const ActionRequestDialog = lazy(() => import("./ActionRequestDialog"));
const RequestRejectedDialog = lazy(
  () => import("./RequestRejectedDialog"),
);
const ApproveRequestDialog = lazy(() => import("./ApproveRequestDialog"));
const CreateUserDialog = lazy(() => import("./CreateUserDialog"));
const ApproveTransferRequestDialog = lazy(
  () => import("./ApproveTransferRequestDialog"),
);
const RejectRequestDialogGeneric = lazy(
  () => import("./RejectRequestDialogGeneric"),
);
const ManualVerificationDialog = lazy(
  () => import("./ManualVerificationDialog"),
);

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
    showManualVerificationDialog,
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
    showCreateUserDialog ||
    showManualVerificationDialog;
  if (!isAnyModalOpen) return null;

  return (
    <Suspense fallback={null}>
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
      {showManualVerificationDialog && <ManualVerificationDialog />}
    </Suspense>
  );
};

export default ModalManager;
