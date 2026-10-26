import { Dialog, DialogTitle, DialogContent } from "@/components/ui/dialog";

import useGlobalContext from "@/context/useGlobalContext";
import { useModalState } from "@/context/useModalState";
import FormHeading from "../../../customComponents/FormHeading";
import UserProfileUpdateForm from "../users/UserProfileUpdateForm";
import { DialogDescription } from "@radix-ui/react-dialog";

function UpdateUserDialog() {
  const { setShowUserProfileDialog } = useGlobalContext();
  const { showUserProfileDialog } = useModalState();

  return (
    <Dialog
      open={showUserProfileDialog}
      onOpenChange={setShowUserProfileDialog}
    >
      <DialogContent
        className="sm:max-w-156.5 bg-white z-3000"
        aria-label="update-user-details-modal"
      >
        <div className="flex gap-2 flex-col">
          <DialogTitle className="">
            <FormHeading
              className="font-normal"
              heading="Update User Details"
            />
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Update your personal information and save changes.
          </DialogDescription>
        </div>

        <UserProfileUpdateForm />
      </DialogContent>
    </Dialog>
  );
}

export default UpdateUserDialog;
