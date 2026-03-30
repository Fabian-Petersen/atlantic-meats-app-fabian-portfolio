// $ This component renders the page for the list of users using a generic table.
// $ The list is from a Get request to the getUsersList.py lambda function.

// import FormHeading from "../../customComponents/FormHeading";
// import { MaintenanceRequestsTable } from "@/components/maintenanceRequestTable/MaintenanceRequestsTable";
// import { useDownloadPdf, useGetAll } from "@/utils/api";
import { useGetAll } from "@/utils/api";

import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";

import { PageLoadingSpinner } from "@/components/features/PageLoadingSpinner";
import useGlobalContext from "@/context/useGlobalContext";
import { getUserColumns } from "@/components/tableColumns/UserColulmns";
import { useState } from "react";
import { ErrorPage } from "@/components/features/Error";
import type { UsersAPIResponse } from "@/schemas";
import { GenericTable } from "@/components/dashboard/GenericTable";
import FormHeading from "@/../customComponents/FormHeading";
import EmptyMobilePlaceholder from "@/components/features/EmptyMobilePlaceholder";
import { SearchInput } from "@/components/features/SearchInput";
import { MobileUsersContainer } from "@/components/mobile/MobileUsersContainer";

const UsersListPage = () => {
  const {
    data: users = [],
    isError,
    refetch,
    isPending,
  } = useGetAll<UsersAPIResponse[]>({
    resourcePath: "admin/users",
    queryKey: ["userRequests"],
  });
  // console.log("users:", users);

  const [sorting, setSorting] = useState<SortingState>([
    { id: "userCreated", desc: false },
  ]);

  const {
    setShowActionDialog,
    setSelectedRowId,
    openDeleteDialog,
    globalFilter,
    setGlobalFilter,
    setShowCreateUserDialog,
  } = useGlobalContext();

  // $ Pass the props to the function generating the columns to be used in the table
  const columns = getUserColumns(
    setShowActionDialog,
    setSelectedRowId,
    openDeleteDialog,
  );

  const table = useReactTable({
    data: users ?? [],
    columns: columns,
    onGlobalFilterChange: setGlobalFilter,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: "includesString",
  });

  if (isPending) return <PageLoadingSpinner />;
  if (isError)
    return (
      <ErrorPage
        title="Failed to load users"
        message="Please check your connection and try again."
        onRetry={refetch}
        redirect="/admin/users"
      />
    );

  return (
    <div className="flex w-full lg:p-4 h-auto">
      <div className="bg-white dark:bg-(--clr-bgDark) lg:flex flex-col gap-4 w-full rounded-xl shadow-lg p-4 h-auto hidden">
        <FormHeading className="mx-auto dark:text-gray-100" heading="Users" />
        <GenericTable
          data={users}
          columns={columns}
          rowPath={`/admin/users`}
          className="hidden md:flex flex-col gap-2"
          searchPlaceholderText="search users"
          emptyTablePlaceholderText="No users listed"
          addButton={true}
          openDialog={setShowCreateUserDialog}
        />
      </div>
      {/* // $ Mobile View */}
      <div className="grid lg:hidden gap-2 w-full p-2">
        <SearchInput
          value={globalFilter}
          onChange={setGlobalFilter}
          placeholder="Search Users"
        />
        {users.length === 0 ? (
          <EmptyMobilePlaceholder message="No users listed" />
        ) : table.getRowModel().rows.length === 0 ? (
          <EmptyMobilePlaceholder
            message={`No results for "${globalFilter}"`}
          />
        ) : (
          <div className="grid gap-2">
            <FormHeading
              className="mx-auto dark:text-gray-100"
              heading="Users"
            />
            <MobileUsersContainer
              className="flex md:hidden"
              data={table.getRowModel().rows}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersListPage;
