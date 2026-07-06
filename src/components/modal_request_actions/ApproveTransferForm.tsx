import axios from "axios";

// $ API hooks
import { usePOST, type Resource } from "@/utils/api";

import { toast } from "sonner";
import { Spinner } from "../ui/spinner";

// $ Context
import useGlobalContext from "@/context/useGlobalContext";
import { sharedStyles } from "@/styles/shared";
import { cn } from "@/lib/utils";

const ApproveTransferForm = () => {
  const {
    setShowApproveTransferDialog,
    selectedRowId,
    setShowSuccess,
    showApproveTransferDialog,
    setSuccessConfig,
  } = useGlobalContext();

  const { mutateAsync: approveItem, isPending } = usePOST({
    id: selectedRowId ?? "",
    resourcePath: "api/transfers" as Resource,
    queryKey: ["transfers", "action: approve request", selectedRowId] as const,
    action: "approve",
  });

  if (!showApproveTransferDialog || !selectedRowId) return null;

  // console.log("technicians:", technicians);
  const handleApprove = async () => {
    try {
      const payload = {
        status: "approved",
        selectedRowId: selectedRowId,
      };
      // $ Send payload to the backend
      await approveItem(payload);
      // console.log("payload:", payload);
      // console.log(approveItem);

      // $ Close the modal
      setShowApproveTransferDialog(false);
      setSuccessConfig({
        title: "Success",
        message: "The Request was Successfully Approved!!!",
        redirectPath: "transfers/in-transit",
      });
      setShowSuccess(true);

      // toast.success("The item was sucessfully assigned");
    } catch (error) {
      console.log(error);
      console.error("Approve Request failed:", error);

      if (axios.isAxiosError<{ message: string }>(error)) {
        // The error returned is AxiosError hence to access response the type must be handled as such
        toast.error(error?.response?.data?.message); // Pass the message from the backend to the user to inform user what must be done
      } else toast.error("Failed to assign item");
    }
  };

  return (
    <form onSubmit={handleApprove} className={cn(sharedStyles.modalForm)}>
      {/* Actions */}
      <div className={cn(sharedStyles.btnParent, sharedStyles.modalBtnParent)}>
        <button
          type="button"
          disabled={isPending}
          onClick={() => setShowApproveTransferDialog(false)}
          className={cn(sharedStyles.btnCancel, sharedStyles.btn)}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className={cn(sharedStyles.btnSubmit, sharedStyles.btn)}
        >
          {isPending ? (
            <div className="flex gap-4 items-center justify-center">
              <Spinner data-icon="inline-start" className="size-6" />
            </div>
          ) : (
            "Submit"
          )}
        </button>
      </div>
    </form>
  );
};

export default ApproveTransferForm;
