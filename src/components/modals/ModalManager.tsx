// const ModalManager = () => {
//   const { isDeleteModalOpen, setIsDeleteModalOpen } = useGlobalContext();

//   const isAnyModalOpen = isDeleteModalOpen;
//   if (!isAnyModalOpen) return null;

//   return (
//     <div className="fixed inset-0 w-full h-screen p-4 z-50">
//       {isDeleteModalOpen && (
//         <DeleteItemModal closeModal={setIsDeleteModalOpen} />
//       )}
//       {isDeleteModalOpen && (
//         <DialogConfirmDeleteModal closeModal={setIsDeleteModalOpen} />
//       )}
//     </div>
//   );
// };

// export default ModalManager;
