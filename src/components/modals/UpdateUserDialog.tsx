import { Dialog, DialogTitle, DialogContent } from "@/components/ui/dialog";

import useGlobalContext from "@/context/useGlobalContext";
import FormHeading from "../../../customComponents/FormHeading";
import UserProfileUpdateForm from "../userProfile/UserProfileUpdateForm";
import { DialogDescription } from "@radix-ui/react-dialog";

function UpdateUserDialog() {
  const { showUserProfileDialog, setShowUserProfileDialog } =
    useGlobalContext();

  return (
    <Dialog
      open={showUserProfileDialog}
      onOpenChange={setShowUserProfileDialog}
    >
      <DialogContent
        className="sm:max-w-[625px] bg-white z-3000"
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
