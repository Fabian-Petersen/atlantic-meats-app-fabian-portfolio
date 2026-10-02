import { AlertTriangle } from "lucide-react";
import useGlobalContext from "@/context/useGlobalContext";
import FormHeading from "../../../customComponents/FormHeading";
import { cn } from "@/lib/utils";
import { sharedStyles } from "@/styles/shared";
import { Dialog, DialogContent } from "../ui/dialog";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import DeleteItemForm from "@/components/modal_request_actions/DeleteItemForm";
import type { Resource } from "@/utils/api";

const DeleteItemModal = () => {
  const { setShowDeleteDialog, deleteConfig, showDeleteDialog } =
    useGlobalContext();

  const config = deleteConfig ?? {
    resourcePath: "asset" as Resource,
    queryKey: ["assetRequests"] as const,
    resourceName: "item",
  };

  // const { mutateAsync: deleteItem, isPending } = useDeleteItem(config);

  // if (!showDeleteDialog || !selectedRowId) return null;

  // const handleDelete = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   console.log("selectedRowId:", selectedRowId);
  //   try {
  //     await deleteItem(selectedRowId);
  //     closeDeleteDialog();
  //     toast.success("The itemm was sucessfully deleted");
  //   } catch (error) {
  //     console.log(error);
  //     console.error("Delete failed:", error);

  //     if (axios.isAxiosError<{ message: string }>(error)) {
  //       // The error returned is AxiosError hence to access response the type must be handled as such
  //       toast.error(error?.response?.data?.message); // Pass the message from the backend to the user to inform user what must be done
  //     } else toast.error("Failed to delete item");
  //   }
  // };

  return (
    <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
      <DialogContent
        className={cn(
          sharedStyles.modal,
          "w-[calc(100vw-2rem)] max-w-sm overflow-hidden sm:w-sm sm:max-w-md",
        )}
      >
        <div
          className={cn(
            sharedStyles.modalParent,
            "bg-transparent p-0 shadow-none dark:bg-transparent",
          )}
        >
          {/* Header */}
          <div className="flex justify-center items-center">
            <div className="rounded-full p-4 text-red-500 bg-red-500/20">
              <AlertTriangle className="size-12 md:size-16" />
            </div>
          </div>
          <DialogTitle className="text-center">
            <FormHeading
              heading="Confirm Delete"
              className={cn(
                sharedStyles.headingForm,
                "px-0 text-center font-normal",
              )}
              headingStyles="justify-center"
            />
          </DialogTitle>

          {/* Body */}
          <DialogDescription className="mx-auto w-3/4 text-center text-cxs text-gray-600 md:mt-2 md:text-xs dark:text-gray-300">
            Are you sure you want to delete the{" "}
            <span className="capitalize">{config.resourceName}</span>? This
            action cannot be undone.
          </DialogDescription>
          <DeleteItemForm />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteItemModal;
