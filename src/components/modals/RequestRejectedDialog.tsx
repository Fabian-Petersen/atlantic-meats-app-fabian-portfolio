import { Dialog, DialogTitle, DialogContent } from "@/components/ui/dialog";

import useGlobalContext from "@/context/useGlobalContext";
import FormHeading from "../../../customComponents/FormHeading";
import RejectRequestForm from "@/components/modal_request_actions/RejectRequestForm";
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
      <DialogContent className="sm:max-w-lg bg-white z-10000 dark:bg-(--bg-primary_dark) dark:text-(--clr-textDark) dark:border-gray-700/50 px-2 py-2 md:py-4 h-auto">
        <div className={cn(sharedStyles.modalParent)}>
          <div className="flex justify-center items-center">
            <div className="rounded-full p-4 text-red-500 bg-red-500/20">
              <OctagonX className="size-12 md:size-16" />
            </div>
          </div>
          <DialogTitle>
            <FormHeading
              arial-label="Reject Request"
              heading="Reject Job Request"
              className={cn(
                sharedStyles.headingForm,
                "text-center font-normal",
              )}
              headingStyles="justify-center"
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
