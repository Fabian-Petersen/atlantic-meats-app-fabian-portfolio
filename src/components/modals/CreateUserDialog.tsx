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
import clsx from "clsx";

function CreateUserDialog() {
  const { showCreateUserDialog, setShowCreateUserDialog } = useGlobalContext();
  return (
    <Dialog open={showCreateUserDialog} onOpenChange={setShowCreateUserDialog}>
      <div className="flex items-center justify-center w-full">
        <DialogContent
          aria-describedby="create new user dialog"
          aria-label="create user"
          className={clsx(
            "overflow-y-scroll md:overflow-y-hidden w-full md:max-w-[625px] bg-white z-3000 p-2",
            "dark:bg-(--bg-primary_dark) dark:text-gray-100 dark:border-gray-700/50",
            "border border-dashed border-yellow-500",
          )}
        >
          <DialogTitle className="py-2 md:py-4">
            <FormHeading
              arial-label="create new user modal"
              className="font-normal text-md md:text-2xl text-center"
              heading="Create User"
            />
          </DialogTitle>
          <CreateUserForm />
        </DialogContent>
      </div>
    </Dialog>
  );
}

export default CreateUserDialog;
