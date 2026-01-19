import { Dialog, DialogTitle, DialogContent } from "@/components/ui/dialog";

import useGlobalContext from "@/context/useGlobalContext";
import FormHeading from "../../../customComponents/FormHeading";
import UserProfileUpdateForm from "../userProfile/UserProfileUpdateForm";

function UpdateUserDialog() {
  const { showUserProfileDialog, setShowUserProfileDialog } =
    useGlobalContext();

  return (
    <Dialog
      open={showUserProfileDialog}
      onOpenChange={setShowUserProfileDialog}
    >
      <DialogContent className="sm:max-w-[625px] bg-white z-3000">
        <DialogTitle className="">
          <FormHeading className="font-normal" heading="Update User Details" />
        </DialogTitle>
        <UserProfileUpdateForm />
      </DialogContent>
    </Dialog>
  );
}

export default UpdateUserDialog;
