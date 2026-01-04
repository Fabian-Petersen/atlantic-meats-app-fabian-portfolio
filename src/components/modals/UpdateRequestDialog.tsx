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
      <DialogContent className="sm:max-w-[625px] bg-white z-1000">
        <DialogTitle>
          <FormHeading heading="Update maintenance request" />
        </DialogTitle>
        <MaintenanceUpdateForm />
        {/* <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="outline"
              className="border-0 bg-red-500 text-white hover:cursor-pointer hover:bg-red-600"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            className="border-0 bg-yellow-500 text-white hover:cursor-pointer"
          >
            Update
          </Button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
}

export default UpdateRequestDialog;
