import { Dialog, DialogTitle, DialogContent } from "@/components/ui/dialog";

import useGlobalContext from "@/context/useGlobalContext";
import FormHeading from "../../../customComponents/FormHeading";
import RejectRequestForm from "@/components/requests_approvals/RejectRequestForm";

function RejectRequestDialog() {
  const { showRejectRequestDialog, setShowRejectRequestDialog } =
    useGlobalContext();
  return (
    <Dialog
      open={showRejectRequestDialog}
      onOpenChange={setShowRejectRequestDialog}
    >
      <DialogContent className="sm:max-w-[625px] bg-white z-3000 dark:bg-(--bg-primary_dark) dark:text-gray-100 dark:border-gray-700/50">
        <DialogTitle>
          <FormHeading
            arial-label="Reject Job Request"
            h2={true}
            className="font-normal text-md md:text-2xl text-center"
            heading="Reject Job Request"
          />
        </DialogTitle>
        <RejectRequestForm />
      </DialogContent>
    </Dialog>
  );
}

export default RejectRequestDialog;
