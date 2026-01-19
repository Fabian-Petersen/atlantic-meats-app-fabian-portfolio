import {
  Dialog,
  DialogTitle,
  // DialogClose,
  DialogContent,
  // DialogFooter,
} from "@/components/ui/dialog";

import useGlobalContext from "@/context/useGlobalContext";
import FormHeading from "../../../customComponents/FormHeading";
import UpdateAssetForm from "../assets/UpdateAssetForm";

function UpdateAssetDialog() {
  const { showUpdateAssetDialog, setShowUpdateAssetDialog } =
    useGlobalContext();
  return (
    <Dialog
      open={showUpdateAssetDialog}
      onOpenChange={setShowUpdateAssetDialog}
    >
      <DialogContent className="sm:max-w-[625px] bg-white z-3000">
        <DialogTitle className="py-4">
          <FormHeading className="font-normal" heading="Update Asset" />
        </DialogTitle>
        <UpdateAssetForm />
      </DialogContent>
    </Dialog>
  );
}

export default UpdateAssetDialog;
