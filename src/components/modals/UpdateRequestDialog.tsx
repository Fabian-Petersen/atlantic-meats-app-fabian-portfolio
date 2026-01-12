import {
  Dialog,
  DialogTitle,
  // DialogClose,
  DialogContent,
  // DialogFooter,
} from "@/components/ui/dialog";

import MaintenanceUpdateForm from "../maintenance/MaintenanceUpdateForm";

import useGlobalContext from "@/context/useGlobalContext";
import FormHeading from "../customComponents/FormHeading";

function UpdateRequestDialog() {
  const { showUpdateMaintenanceDialog, setShowUpdateMaintenanceDialog } =
    useGlobalContext();
  return (
    <Dialog
      open={showUpdateMaintenanceDialog}
      onOpenChange={setShowUpdateMaintenanceDialog}
    >
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
