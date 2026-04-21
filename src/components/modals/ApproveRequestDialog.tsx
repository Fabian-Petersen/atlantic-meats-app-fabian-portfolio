import { Dialog, DialogTitle, DialogContent } from "@/components/ui/dialog";

import useGlobalContext from "@/context/useGlobalContext";
import FormHeading from "../../../customComponents/FormHeading";
import ApproveRequestForm from "@/components/requests_approvals/ApproveRequestForm";
import { cn } from "@/lib/utils";
import { sharedStyles } from "@/styles/shared";

function ApproveRequestDialog() {
  const { showApproveRequestDialog, setShowApproveRequestDialog } =
    useGlobalContext();
  return (
    <Dialog
      open={showApproveRequestDialog}
      onOpenChange={setShowApproveRequestDialog}
    >
      <DialogContent className="sm:max-w-[625px] bg-white z-3000 dark:bg-(--bg-primary_dark) dark:text-(--clr-textDark) dark:border-gray-700/50 px-2 py-2 md:py-4 h-auto">
        <DialogTitle className="">
          <FormHeading
            arial-label="Approve Job Request"
            className={cn(
              sharedStyles.headingForm,
              "md:text-center font-normal",
            )}
            heading="Approve Job Request"
          />
        </DialogTitle>
        <ApproveRequestForm />
      </DialogContent>
    </Dialog>
  );
}

export default ApproveRequestDialog;
