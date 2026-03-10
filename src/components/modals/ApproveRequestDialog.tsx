import { Dialog, DialogTitle, DialogContent } from "@/components/ui/dialog";

import useGlobalContext from "@/context/useGlobalContext";
import FormHeading from "../../../customComponents/FormHeading";
import ApproveRequestForm from "@/components/requests_approvals/ApproveRequestForm";

function ApproveRequestDialog() {
  const { showApproveRequestDialog, setShowApproveRequestDialog } =
    useGlobalContext();
  return (
    <Dialog
      open={showApproveRequestDialog}
      onOpenChange={setShowApproveRequestDialog}
    >
      <DialogContent className="sm:max-w-[625px] bg-white z-3000 dark:bg-[#1d2739] border-none dark:text-gray-100 dark:border-gray-700/50">
        <DialogTitle className="">
          <FormHeading
            arial-label="Approve Job Request"
            className="font-normal"
            heading="Approve Job Request"
          />
        </DialogTitle>
        <ApproveRequestForm />
      </DialogContent>
    </Dialog>
  );
}

export default ApproveRequestDialog;
