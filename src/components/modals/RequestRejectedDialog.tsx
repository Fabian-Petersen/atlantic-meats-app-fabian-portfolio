import { Dialog, DialogTitle, DialogContent } from "@/components/ui/dialog";

import useGlobalContext from "@/context/useGlobalContext";
import FormHeading from "../../../customComponents/FormHeading";
import RequestRejectedForm from "@/components/requests_approvals/RequestRejectedForm";

function RequestRejectedDialog() {
  const { showRejectRequestDialog, setShowRejectRequestDialog } =
    useGlobalContext();
  return (
    <Dialog
      open={showRejectRequestDialog}
      onOpenChange={setShowRejectRequestDialog}
    >
      <DialogContent className="sm:max-w-[625px] bg-white z-3000 dark:bg-[#1d2739] border-none dark:text-gray-100 dark:border-gray-700/50">
        <DialogTitle className="">
          <FormHeading
            arial-label="Reject Job Request"
            className="font-normal"
            heading="Reject Job Request"
          />
        </DialogTitle>
        <RequestRejectedForm />
      </DialogContent>
    </Dialog>
  );
}

export default RequestRejectedDialog;
