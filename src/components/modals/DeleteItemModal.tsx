// import React from "react";
// import { AlertTriangle } from "lucide-react";
// import { useDelete } from "@/app/hooks/useFetchDataHook";
// import { ResourceType } from "@/app/utils/api";
// import { toaster } from "@/components/ui/toaster";
// import { useGlobalContext } from "@/app/contexts/useGlobalContext";

// type ModalDeleteItemProps = {
//   closeModal: (isOpen: boolean) => void;
// };

// const DeleteItemModal = ({ closeModal }: ModalDeleteItemProps) => {
//   const { setIsDeleteModalOpen, itemToDelete, resourceTypeToDelete } =
//     useGlobalContext();

//   const deleteItem = useDelete(resourceTypeToDelete as ResourceType);

//   const handleDelete = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!itemToDelete?.id) {
//       toaster.create({
//         title: "Error",
//         description: "Item ID is missing",
//         type: "error",
//         duration: 3000,
//       });
//       return;
//     }

//     try {
//       await deleteItem.mutateAsync(itemToDelete.id);

//       toaster.create({
//         title: "Success",
//         description: `${
//           resourceTypeToDelete === "projects"
//             ? "Project"
//             : resourceTypeToDelete === "tasks"
//             ? "Task"
//             : "Job application"
//         } deleted successfully`,
//         type: "success",
//         duration: 3000,
//       });

//       setIsDeleteModalOpen(false);
//     } catch (error) {
//       toaster.create({
//         title: "Error",
//         description: `Failed to delete ${
//           resourceTypeToDelete === "projects" ? "project" : "job application"
//         }`,
//         type: "error",
//         duration: 3000,
//       });
//       console.error(`Error deleting ${resourceTypeToDelete}:`, error);
//     }
//   };

//   return (
//     <form
//       onSubmit={handleDelete}
//       className="fixed inset-0 z-50 flex items-center justify-center"
//     >
//       <div className="w-full max-w-lg rounded-md bg-white p-6 shadow-xl backdrop-blur-xl dark:bg-[#1d2739]">
//         {/* Header */}
//         <div className="flex items-center gap-3">
//           <div className="rounded-md p-2 text-red-500">
//             <AlertTriangle size={36} />
//           </div>
//           <h2 className="text-base font-bold text-blue-500 lg:text-xl">
//             Confirm Delete
//           </h2>
//         </div>

//         {/* Body */}
//         <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
//           Are you sure you want to delete this{" "}
//           {resourceTypeToDelete === "projects" ? "project" : "job application"}?
//           This action cannot be undone.
//         </p>

//         {/* Actions */}
//         <div className="mt-6 flex flex-col gap-4 lg:flex-row">
//           <button
//             type="button"
//             disabled={deleteItem.isPending}
//             onClick={() => closeModal(false)}
//             className="w-full rounded-full border border-yellow-400 px-6 py-2 text-gray-600 transition hover:bg-red-300 hover:text-white disabled:opacity-50 dark:text-gray-200 lg:w-32"
//           >
//             Cancel
//           </button>

//           <button
//             type="submit"
//             disabled={deleteItem.isPending}
//             className="w-full rounded-full bg-teal-600 px-6 py-2 text-white transition hover:bg-teal-700 disabled:opacity-50 lg:w-32"
//           >
//             {deleteItem.isPending ? "Deleting…" : "Delete"}
//           </button>
//         </div>
//       </div>
//     </form>
//   );
// };

// export default DeleteItemModal;
