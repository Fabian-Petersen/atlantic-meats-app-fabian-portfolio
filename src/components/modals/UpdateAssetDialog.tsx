import {
  Dialog,
  DialogTitle,
  // DialogClose,
  DialogContent,
  // DialogFooter,
} from "@/components/ui/dialog";

import useGlobalContext from "@/context/useGlobalContext";
import { useModalState } from "@/context/useModalState";
import FormHeading from "../../../customComponents/FormHeading";
import UpdateAssetForm from "../assets/UpdateAssetForm";

function UpdateAssetDialog() {
  const { setShowUpdateAssetDialog } = useGlobalContext();
  const { showUpdateAssetDialog } = useModalState();
  return (
    <Dialog
      open={showUpdateAssetDialog}
      onOpenChange={setShowUpdateAssetDialog}
    >
      <DialogContent className="sm:max-w-[625px] bg-white z-3000 dark:bg-[#1d2739] border-none dark:text-gray-100 dark:border-gray-700/50">
        <DialogTitle className="py-4">
          <FormHeading
            arial-label="update asset modal"
            className="font-normal"
            heading="Update Asset"
          />
        </DialogTitle>
        <UpdateAssetForm />
      </DialogContent>
    </Dialog>
  );
}

export default UpdateAssetDialog;
