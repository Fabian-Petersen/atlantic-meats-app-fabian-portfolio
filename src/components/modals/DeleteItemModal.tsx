import React from "react";
import axios from "axios";
import { AlertTriangle } from "lucide-react";
import useGlobalContext from "@/context/useGlobalContext";
import FormHeading from "../../../customComponents/FormHeading";
import { toast } from "sonner";
import { useDeleteItem, type Resource } from "@/utils/api";
import { Spinner } from "../ui/spinner";
import { cn } from "@/lib/utils";
import { sharedStyles } from "@/styles/shared";

const DeleteItemModal = () => {
  const {
    setShowDeleteDialog,
    selectedRowId,
    deleteConfig,
    showDeleteDialog,
    closeDeleteDialog,
  } = useGlobalContext();

  const config = deleteConfig ?? {
    resourcePath: "asset" as Resource,
    queryKey: ["assetRequests"] as const,
    resourceName: "item",
  };

  const { mutateAsync: deleteItem, isPending } = useDeleteItem(config);

  if (!showDeleteDialog || !selectedRowId) return null;

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("selectedRowId:", selectedRowId);
    try {
      await deleteItem(selectedRowId);
      closeDeleteDialog();
      toast.success("The itemm was sucessfully deleted");
    } catch (error) {
      console.log(error);
      console.error("Delete failed:", error);

      if (axios.isAxiosError<{ message: string }>(error)) {
        // The error returned is AxiosError hence to access response the type must be handled as such
        toast.error(error?.response?.data?.message); // Pass the message from the backend to the user to inform user what must be done
      } else toast.error("Failed to delete item");
    }
  };

  return (
    <form onSubmit={handleDelete} className={cn(sharedStyles.modalForm)}>
      <div className={cn(sharedStyles.modalParent)}>
        {/* Header */}
        <div className="flex flex-col items-center md:gap-3 justify-center w-full">
          <div className="rounded-full p-4 text-red-500 bg-red-500/20">
            <AlertTriangle className="size-12 md:size-16" />
          </div>
          <FormHeading
            heading="Confirm Delete"
            className={cn(sharedStyles.headingForm, "md:text-center")}
          />
        </div>

        {/* Body */}
        <p className="w-3/4 md:mt-2 text-cxs md:text-xs text-gray-600 dark:text-gray-300 text-center mx-auto">
          {`Are you sure you want to delete the ${config.resourceName}? This action cannot be undone.`}
        </p>

        {/* Actions */}
        <div
          className={cn(sharedStyles.btnParent, sharedStyles.modalBtnParent)}
        >
          <button
            type="button"
            // disabled={isPending}
            onClick={() => setShowDeleteDialog(false)}
            className={cn(sharedStyles.btnCancel, sharedStyles.btn)}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isPending}
            className={cn(sharedStyles.btnDelete, sharedStyles.btn, "py-1")}
          >
            {!isPending ? (
              <div className="w-full flex items-center justify-center text-white">
                <Spinner className="size-6 md:size-6 text-red-500" />
              </div>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default DeleteItemModal;
