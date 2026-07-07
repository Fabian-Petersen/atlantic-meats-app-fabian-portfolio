import { Dialog, DialogTitle, DialogContent } from "@/components/ui/dialog";

import useGlobalContext from "@/context/useGlobalContext";
import FormHeading from "../../../customComponents/FormHeading";
import ApproveTransferForm from "@/components/modal_request_actions/ApproveTransferForm";
import { cn } from "@/lib/utils";
import { sharedStyles } from "@/styles/shared";
// import { DialogDescription } from "@radix-ui/react-dialog";
import { CheckCircle } from "lucide-react";

function ApproveTransferRequestDialog() {
  const { showApproveTransferDialog, setShowApproveTransferDialog } =
    useGlobalContext();
  return (
    <Dialog
      open={showApproveTransferDialog}
      onOpenChange={setShowApproveTransferDialog}
    >
      <DialogContent className={cn(sharedStyles.modal)}>
        <div className={cn(sharedStyles.modalParent)}>
          {/* Header */}
          <div className="flex justify-center items-center">
            <div className="rounded-full p-6 text-green-500 bg-green-500/10">
              <CheckCircle className="size-12 md:size-16" />
            </div>
          </div>
          <DialogTitle className="">
            <FormHeading
              heading="Approve Asset Transfer Request"
              arial-label="Approve Transfer Request"
              className={cn(
                sharedStyles.headingForm,
                "md:flex md:justify-center font-normal w-full",
              )}
            />
          </DialogTitle>
          {/* <DialogDescription /> */}
          <ApproveTransferForm />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ApproveTransferRequestDialog;
