import React from "react";
import axios from "axios";
import { AlertTriangle } from "lucide-react";
import useGlobalContext from "@/context/useGlobalContext";
import FormHeading from "../../../customComponents/FormHeading";
import { toast } from "sonner";
import { useDeleteItem, type Resource } from "@/utils/api";
import { Spinner } from "../ui/spinner";

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
    <form
      onSubmit={handleDelete}
      className="fixed inset-0 z-50 flex items-center justify-center px-2"
    >
      <div className="max-w-lg rounded-md bg-white px-4 py-6 md:p-6 shadow-xl backdrop-blur-xl dark:bg-(--bg-primary_dark) dark:border-gray-700/60 dark:border">
        {/* Header */}
        <div className="flex flex-col items-center gap-3 justify-center w-full">
          <div className="rounded-full p-4 text-red-500 bg-red-500/20">
            <AlertTriangle size={36} />
          </div>
          <div className="text-center">
            <FormHeading
              heading="Confirm Delete"
              className="text-md md:text-lg"
            />
          </div>
        </div>

        {/* Body */}
        <p className="mt-2 text-xs md:text-sm text-gray-600 dark:text-gray-300 text-center">
          {`Are you sure you want to delete the ${config.resourceName}?
          This action cannot be undone.`}
        </p>

        {/* Actions */}
        <div className="mt-6 flex gap-4 lg:flex-row justify-end">
          <button
            type="button"
            // disabled={isPending}
            onClick={() => setShowDeleteDialog(false)}
            className="flex-1 py-2 text-xs font-medium rounded-lg dark:bg-green/20 bg-orange-500/10 border-green/20 hover:bg-orange-500/90 hover:shadow-md text-orange-500 border dark:border-green/30 transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isPending}
            className="flex-1 py-2 text-xs font-medium rounded-lg border border-red-400 dark:border-red-500 text-red-600 bg-red-500/20 dark:bg-red-300/20 dark:text-red-300 hover:bg-gray-50 dark:hover:bg-red/5 transition-colors"
          >
            {isPending ? (
              <div className="w-full flex items-center justify-center text-white">
                <Spinner className="size-6 md:size-8 text-red-500" />
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
