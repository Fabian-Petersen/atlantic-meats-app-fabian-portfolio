import { AlertTriangle } from "lucide-react";
import useGlobalContext from "@/context/useGlobalContext";
import FormHeading from "../../../customComponents/FormHeading";
import { cn } from "@/lib/utils";
import { sharedStyles } from "@/styles/shared";
import { Dialog, DialogContent } from "../ui/dialog";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import DeleteItemForm from "../features/DeleteItemForm";
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
      <DialogContent className={cn(sharedStyles.modal)}>
        <div className={cn(sharedStyles.modalParent)}>
          {/* Header */}
          <div className="flex justify-center items-center">
            <div className="rounded-full p-4 text-red-500 bg-red-500/20">
              <AlertTriangle className="size-12 md:size-16" />
            </div>
          </div>
          <DialogTitle>
            <FormHeading
              heading="Confirm Delete"
              className={cn(sharedStyles.headingForm, "md:text-center")}
            />
          </DialogTitle>

          {/* Body */}
          <DialogDescription>
            <p className="w-3/4 md:mt-2 text-cxs md:text-xs text-gray-600 dark:text-gray-300 text-center mx-auto">
              Are you sure you want to delete the{" "}
              <span className="capitalize">{config.resourceName}</span>? This
              action cannot be undone.
            </p>
          </DialogDescription>
          <DeleteItemForm />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteItemModal;
