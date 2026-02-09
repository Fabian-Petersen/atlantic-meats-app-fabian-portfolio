// $ This component renders the action request dialog, which is used to update and closeout a maintenance job. It uses the MaintenanceUpdateForm component to render the form inside the dialog.

import {
  Dialog,
  DialogTitle,
  // DialogClose,
  DialogContent,
  // DialogFooter,
} from "@/components/ui/dialog";

import MaintenanceActionForm from "../maintenance/MaintenanceActionForm";

import useGlobalContext from "@/context/useGlobalContext";
import FormHeading from "../../../customComponents/FormHeading";

function ActionRequestDialog() {
  const { showActionDialog, setShowActionDialog } = useGlobalContext();
  return (
    <Dialog open={showActionDialog} onOpenChange={setShowActionDialog}>
      <DialogContent className="sm:max-w-[625px] bg-white z-3000 border-none max-h-[90dvh]">
        <DialogTitle className="py-4">
          <FormHeading
            className="font-normal"
            heading="Action Maintenance Request"
          />
        </DialogTitle>
        <MaintenanceActionForm onCancel={() => setShowActionDialog(false)} />
      </DialogContent>
    </Dialog>
  );
}

export default ActionRequestDialog;
