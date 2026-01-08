import {
  Dialog,
  DialogTitle,
  // DialogClose,
  DialogContent,
  // DialogFooter,
} from "@/components/ui/dialog";

import MaintenanceUpdateForm from "../maintenance/MaintenanceUpdateForm";

import { useGlobalContext } from "@/useGlobalContext";
import FormHeading from "../customComponents/FormHeading";

function UpdateRequestDialog() {
  const { showUpdateDialog, setShowUpdateDialog } = useGlobalContext();
  return (
    <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
      <DialogContent className="sm:max-w-[625px] bg-white z-3000">
        <DialogTitle className="py-4">
          <FormHeading
            className="font-normal"
            heading="Update Maintenance request"
          />
        </DialogTitle>
        <MaintenanceUpdateForm />
      </DialogContent>
    </Dialog>
  );
}

export default UpdateRequestDialog;
