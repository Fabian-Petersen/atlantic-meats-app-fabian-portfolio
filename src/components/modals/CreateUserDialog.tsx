import {
  Dialog,
  DialogTitle,
  // DialogClose,
  DialogContent,
  // DialogFooter,
} from "@/components/ui/dialog";

import useGlobalContext from "@/context/useGlobalContext";
import FormHeading from "../../../customComponents/FormHeading";
import CreateUserForm from "../users/CreateUserForm";
import { sharedStyles } from "@/styles/shared";
import { cn } from "@/lib/utils";

function CreateUserDialog() {
  const { showCreateUserDialog, setShowCreateUserDialog } = useGlobalContext();
  return (
    <Dialog open={showCreateUserDialog} onOpenChange={setShowCreateUserDialog}>
      <DialogContent
        aria-describedby="create new user dialog"
        aria-label="create user"
        className={cn(sharedStyles.modal)}
      >
        <DialogTitle>
          <FormHeading
            arial-label="create new user modal"
            className={cn(
              sharedStyles.headingForm,
              "md:text-center font-normal",
            )}
            heading="Create User"
          />
        </DialogTitle>
        <CreateUserForm />
      </DialogContent>
    </Dialog>
  );
}

export default CreateUserDialog;
