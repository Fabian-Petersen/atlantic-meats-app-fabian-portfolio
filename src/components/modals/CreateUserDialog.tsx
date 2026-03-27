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

function CreateUserDialog() {
  const { showCreateUserDialog, setShowCreateUserDialog } = useGlobalContext();
  return (
    <Dialog open={showCreateUserDialog} onOpenChange={setShowCreateUserDialog}>
      <DialogContent
        aria-describedby="create new user dialog"
        aria-label="create user"
        className="sm:max-w-[625px] bg-white z-3000 dark:bg-(--bg-primary_dark) border-none dark:text-gray-100 dark:border-gray-700/50"
      >
        <DialogTitle className="py-4">
          <FormHeading
            arial-label="create new user modal"
            className="font-normal"
            heading="Create User"
          />
        </DialogTitle>
        <CreateUserForm />
      </DialogContent>
    </Dialog>
  );
}

export default CreateUserDialog;
