import { Dialog, DialogTitle, DialogContent } from "@/components/ui/dialog";

import useGlobalContext from "@/context/useGlobalContext";
import FormHeading from "../../../customComponents/FormHeading";
import RejectRequestForm from "@/components/requests_approvals/RejectRequestForm";
import { cn } from "@/lib/utils";
import { sharedStyles } from "@/styles/shared";
import { OctagonX } from "lucide-react";
import { DialogDescription } from "@radix-ui/react-dialog";

function RejectRequestDialog() {
  const { showRejectRequestDialog, setShowRejectRequestDialog } =
    useGlobalContext();
  return (
    <Dialog
      open={showRejectRequestDialog}
      onOpenChange={setShowRejectRequestDialog}
    >
      <DialogContent className={cn(sharedStyles.modal)}>
        <div className={cn(sharedStyles.modalParent)}>
          <div className="flex justify-center items-center">
            <div className="rounded-full p-4 text-red-500 bg-red-500/20">
              <OctagonX className="size-12 md:size-16" />
            </div>
          </div>
          <DialogTitle>
            <FormHeading
              heading="Reject Request"
              className={cn(
                sharedStyles.headingForm,
                "md:text-center font-normal",
              )}
            />
          </DialogTitle>
          <DialogDescription>
            <p className="text-cxs md:text-xs text-gray-600 dark:text-gray-300 text-center w-3/4 mx-auto">
              Are you sure you want to reject this item? This action cannot be
              undone.
            </p>
          </DialogDescription>
          <RejectRequestForm />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default RejectRequestDialog;
