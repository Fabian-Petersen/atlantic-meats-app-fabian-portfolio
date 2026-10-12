import { useModalState } from "@/context/useModalState";
import { lazy, Suspense, useEffect } from "react";

const modalLoaders = [
  () => import("./UpdateRequestDialog"),
  () => import("./DeleteItemModal"),
  () => import("./UpdateAssetDialog"),
  () => import("./UpdateUserDialog"),
  () => import("./ActionRequestDialog"),
  () => import("./RequestRejectedDialog"),
  () => import("./ApproveRequestDialog"),
  () => import("./CreateUserDialog"),
  () => import("./ApproveTransferRequestDialog"),
  () => import("./RejectRequestDialogGeneric"),
  () => import("./ManualVerificationDialog"),
] as const;

const UpdateRequestDialog = lazy(modalLoaders[0]);
const DeleteItemModal = lazy(modalLoaders[1]);
const UpdateAssetDialog = lazy(modalLoaders[2]);
const UpdateUserDialog = lazy(modalLoaders[3]);
const ActionRequestDialog = lazy(modalLoaders[4]);
const RequestRejectedDialog = lazy(modalLoaders[5]);
const ApproveRequestDialog = lazy(modalLoaders[6]);
const CreateUserDialog = lazy(modalLoaders[7]);
const ApproveTransferRequestDialog = lazy(modalLoaders[8]);
const RejectRequestDialogGeneric = lazy(modalLoaders[9]);
const ManualVerificationDialog = lazy(modalLoaders[10]);

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
  } = useModalState();

  useEffect(() => {
    let cancelled = false;
    let idleCallbackId: number | undefined;
    let timeoutId: number | undefined;
    const idleWindow = window as unknown as {
      requestIdleCallback?: typeof window.requestIdleCallback;
      cancelIdleCallback?: typeof window.cancelIdleCallback;
    };

    const preloadNext = (index: number) => {
      if (cancelled || index >= modalLoaders.length) return;

      const preload = () => {
        void modalLoaders[index]().finally(() => preloadNext(index + 1));
      };

      if (idleWindow.requestIdleCallback) {
        idleCallbackId = idleWindow.requestIdleCallback(preload, {
          timeout: 2000,
        });
      } else {
        timeoutId = window.setTimeout(preload, 200);
      }
    };

    preloadNext(0);

    return () => {
      cancelled = true;
      if (idleCallbackId !== undefined) {
        idleWindow.cancelIdleCallback?.(idleCallbackId);
      }
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, []);
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
