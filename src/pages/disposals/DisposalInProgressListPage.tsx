// // $ This component renders the page for the disposals register in a table format.
// // $ The list is from a Get request to the getDisposalsRegister.py lambda function.

// import FormHeading from "../../../customComponents/FormHeading";
// import { useGetAll } from "@/utils/api";
// import { PageLoadingSpinner } from "@/components/features/PageLoadingSpinner";

// import { useNavigate } from "react-router-dom";

// /* -------------------------------------------------------------------------- */
// /*                   Make this the disposals completed page                   */
// /* -------------------------------------------------------------------------- */

// // $ Import Tanstack Table
// import {
//   getCoreRowModel,
//   getFilteredRowModel,
//   getSortedRowModel,
//   useReactTable,
//   getPaginationRowModel,
//   type SortingState,
//   type PaginationState,
// } from "@tanstack/react-table";

// import useGlobalContext from "@/context/useGlobalContext";
// import { useMemo, useState } from "react";
// import type { DisposalWorkflowResponse } from "@/schemas/disposalsSchemas";
// import { TableGeneric } from "@/components/features/tables/TableGeneric";
// import { SearchInput } from "@/components/features/SearchInput";
// import EmptyMobilePlaceholder from "@/components/features/EmptyMobilePlaceholder";
// import { cn } from "@/lib/utils";
// import { sharedStyles } from "@/styles/shared";
// import { getTransferTransitColumns } from "@/components/tableColumns/TransferTransitColumns";
// import { flattenTransfersData } from "@/utils/flattenTranferData";
// import MobileTransfersTransitList from "@/components/mobile/transfers/MobileTransfersTransitList";

// const DisposalInProgressListPage = () => {
//   const navigate = useNavigate();

//   /* -------------------------------------------------------------------------- */
//   /*                                    DATA                                    */
//   /* -------------------------------------------------------------------------- */
//   const { data, isPending, isError } = useGetAll<DisposalWorkflowResponse[]>({
//     resourcePath: "api/disposals/requests",
//     queryKey: ["disposals", "in-progress-list"],
//     params: {
//       status: "in-progress",
//     },
//   });

//   console.log("in-progress-data:", data);

//   /**
//    * Convert the rows have the data in the root object and not nested using the util
//    * function flattenTransfersData
//    */
//   const rows = useMemo(
//     () => flattenTransfersData(data, ["in-progress"]),
//     [data],
//   );

//   /* -------------------------------------------------------------------------- */
//   /*                                   SORTING                                  */
//   /* -------------------------------------------------------------------------- */
//   const [sorting, setSorting] = useState<SortingState>([
//     { id: "dateCreated", desc: true },
//   ]);

//   /* -------------------------------------------------------------------------- */
//   /*                                   FILTERING                                */
//   /* -------------------------------------------------------------------------- */

//   const [globalFilter, setGlobalFilter] = useState("");

//   const [pagination, setPagination] = useState<PaginationState>({
//     pageIndex: 0,
//     pageSize: 10, // 👈 this controls "10 items per page"
//   });

//   const { setShowUpdateAssetDialog, setSelectedRowId, openDeleteDialog } =
//     useGlobalContext();

//   /* -------------------------------------------------------------------------- */
//   /*                                   COLUMNS                                  */
//   /* -------------------------------------------------------------------------- */

//   const columns = getTransferTransitColumns(
//     setShowUpdateAssetDialog,
//     setSelectedRowId,
//     openDeleteDialog,
//     navigate,
//   );

//   /* -------------------------------------------------------------------------- */
//   /*                                    TABLE                                   */
//   /* -------------------------------------------------------------------------- */

//   // $ This data is passed into the mobile component
//   const table = useReactTable({
//     data: rows,
//     columns: columns,
//     columnResizeMode: "onChange",
//     state: { sorting, pagination, globalFilter },
//     onSortingChange: setSorting,
//     onPaginationChange: setPagination,
//     getCoreRowModel: getCoreRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//   });

//   /* -------------------------------------------------------------------------- */
//   /*                                  LOADING STATE                             */
//   /* -------------------------------------------------------------------------- */

//   if (isPending) return <PageLoadingSpinner />;
//   if (isError) return <p>There was an error loading the transfer requests</p>;
//   if (!data) {
//     return <p>There was an error loading the transfer requests</p>;
//   }

//   return (
//     <div className="flex flex-col w-full md:p-4 h-auto gap-2">
//       <div className="bg-white dark:bg-(--bg-primary_dark) lg:flex flex-col gap-1 w-full rounded-xl shadow-lg p-4 h-auto hidden">
//         <TableGeneric
//           data={rows}
//           columns={columns}
//           rowPath="disposals"
//           addButton={true}
//           addFilter={true}
//           addButtonPath="/disposals/create-new-disposal"
//           pageSize={10}
//           addPagination={true}
//           addPageSelector={true}
//           tableHeading="Disposals - In Progress"
//         />
//       </div>
//       {/* // $ Mobile View */}
//       <div className="grid lg:hidden gap-2 w-full p-2">
//         <SearchInput
//           enableMobile={true}
//           value={globalFilter}
//           onChange={setGlobalFilter}
//           placeholder="Search Assets"
//         />{" "}
//         {data.length === 0 ? (
//           <EmptyMobilePlaceholder message="No disposal requests available yet" />
//         ) : table.getRowModel().rows.length === 0 ? (
//           <EmptyMobilePlaceholder
//             message={`No results for "${globalFilter}"`}
//           />
//         ) : (
//           <div className="grid gap-2">
//             <FormHeading
//               className={cn(sharedStyles.headingForm, "px-0")}
//               heading="Disposals - In Progress"
//               redirect={true}
//               redirectTo="/dashboard"
//             />
//             <MobileTransfersTransitList
//               className="flex lg:hidden"
//               data={table.getRowModel().rows}
//               setShowUpdateAssetDialog={setShowUpdateAssetDialog}
//               setSelectedRowId={setSelectedRowId}
//               openDeleteDialog={openDeleteDialog}
//             />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default DisposalInProgressListPage;
