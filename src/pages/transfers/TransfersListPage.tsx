// // $ This component renders the page for the assets register in a table format.
// // $ The list is from a Get request to the getAssetsRegister.py lambda function.

// import FormHeading from "../../customComponents/FormHeading";
// import { useGetAll } from "@/utils/api";
// import { PageLoadingSpinner } from "@/components/features/PageLoadingSpinner";
// // import { MobileAssetsOverviewTable } from "@/components/mobile/MolbileAssetsOverviewTable";

// import { useNavigate } from "react-router-dom";

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
// import { useState } from "react";
// import type { TransferResponseValues } from "@/schemas";
// // import { Error } from "@/components/features/Error";
// import { TableGeneric } from "@/components/features/TableGeneric";
// import { SearchInput } from "@/components/features/SearchInput";
// import EmptyMobilePlaceholder from "@/components/features/EmptyMobilePlaceholder";
// import { cn } from "@/lib/utils";
// import { sharedStyles } from "@/styles/shared";
// import { getTransferColumns } from "@/components/tableColumns/TransferColumns";

// const TransfersListPage = () => {
//   const navigate = useNavigate();
//   const { data, isPending, isError } = useGetAll<TransferResponseValues[]>({
//     resourcePath: "api/transfers",
//     queryKey: ["transfers", "transfers-list"],
//   });

//   console.log("TransfersListPage data:", data);

//   const [sorting, setSorting] = useState<SortingState>([
//     { id: "transferCreated", desc: true },
//   ]);

//   const [globalFilter, setGlobalFilter] = useState("");

//   const [pagination, setPagination] = useState<PaginationState>({
//     pageIndex: 0,
//     pageSize: 10, // 👈 this controls "10 items per page"
//   });

//   const { setShowUpdateAssetDialog, setSelectedRowId, openDeleteDialog } =
//     useGlobalContext();

//   // $ Map through the data returned to match the TableRow Data Schema
//   // const rows: TransferResponseValues[] = useMemo(() =>
//   //   (data ?? []).map(
//   //     (item) => ({
//   //       assetID: item.assetID,
//   //       area: item.area,
//   //       equipment: item.equipment,
//   //       locationFrom: item.locationFrom,
//   //       locationTo: item.locationTo,
//   //       description: item.description,
//   //       expectedTransferDate: item.expectedTransferDate,
//   //       transferReason: item.transferReason,
//   //       id: item.id,
//   //       transferCreated: item.transferCreated,
//   //       status: item.status,
//   //       requested_by: item.requested_by,
//   //       requestor_name: item.requestor_name,
//   //       requestor_email: item.requestor_email,
//   //       requestor_sub: item.requestor_sub,
//   //     }),
//   //     [data],
//   //   ),
//   // );

//   const columns = getTransferColumns(
//     setShowUpdateAssetDialog,
//     setSelectedRowId,
//     openDeleteDialog,
//     navigate,
//   );
//   // $ This data is passed into the mobile component
//   const table = useReactTable({
//     data: data ?? [],
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

//   if (isPending) return <PageLoadingSpinner />;
//   if (isError) return <p>There was an error loading the transfer requests</p>;

//   if (!data) {
//     return <p>There was an error loading the transfer requests</p>;
//   }

//   return (
//     <div className="flex flex-col w-full md:p-4 h-auto gap-2">
//       <div className="bg-white dark:bg-(--bg-primary_dark) lg:flex flex-col gap-1 w-full rounded-xl shadow-lg p-4 h-auto hidden">
//         <TableGeneric
//           data={data}
//           columns={columns}
//           rowPath="transfers"
//           addButton={true}
//           addFilter={true}
//           addButtonPath="/transfers/create-new-transfer"
//           pageSize={10}
//           addPagination={true}
//           addPageSelector={true}
//           tableHeading="Transfers Register"
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
//           <EmptyMobilePlaceholder message="No transfers requests available yet" />
//         ) : table.getRowModel().rows.length === 0 ? (
//           <EmptyMobilePlaceholder
//             message={`No results for "${globalFilter}"`}
//           />
//         ) : (
//           <div className="grid gap-2">
//             <FormHeading
//               className={cn(sharedStyles.headingForm, "px-0")}
//               heading="Transfers Register"
//               redirect={true}
//               redirectTo="/dashboard"
//             />
//             {/* <MobileAssetsOverviewTable
//               className="flex lg:hidden"
//               data={table.getRowModel().rows}
//             /> */}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TransfersListPage;
