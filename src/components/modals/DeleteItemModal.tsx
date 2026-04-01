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
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="w-full max-w-lg rounded-md bg-white p-6 shadow-xl backdrop-blur-xl dark:bg-[#1d2739]">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="rounded-md p-2 text-red-500">
            <AlertTriangle size={36} />
          </div>
          <FormHeading heading="Confirm Delete" />
        </div>

        {/* Body */}
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          {`Are you sure you want to delete the ${config.resourceName}? This action cannot be
          undone.`}
        </p>

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-4 lg:flex-row justify-end">
          <button
            type="button"
            // disabled={isPending}
            onClick={() => setShowDeleteDialog(false)}
            className="w-full rounded-full bg-red-500 px-6 py-2 transition hover:bg-red-500/90 hover:cursor-pointer text-white disabled:opacity-50 dark:text-gray-200 lg:w-32"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-full bg-primary/90 px-6 py-2 text-white transition hover:bg-primary hover:cursor-pointer disabled:opacity-50 lg:w-32"
          >
            {isPending ? (
              <div className="w-full flex items-center justify-center text-white">
                <Spinner className="size-8" />
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
