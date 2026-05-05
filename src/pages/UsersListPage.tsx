// $ This component renders the page for the list of users using a generic table.
// $ The list is from a Get request to the getUsersList.py lambda function.

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
import { getUserColumns } from "@/components/tableColumns/UserColumns";
import { useMemo, useState } from "react";
import { Error } from "@/components/features/Error";
import type { UsersAPIResponse } from "@/schemas";

import { TableGeneric } from "@/components/features/TableGeneric";
import FormHeading from "@/../customComponents/FormHeading";
import EmptyMobilePlaceholder from "@/components/features/EmptyMobilePlaceholder";
import { SearchInput } from "@/components/features/SearchInput";
import { MobileUsersContainer } from "@/components/mobile/MobileUsersContainer";
import { useResendTemporaryPassword } from "@/utils/useResendTemporaryPassword";
import { PlusCircle } from "lucide-react";

const UsersListPage = () => {
  // $ Opt out of React Compiler memoization — useReactTable returns unstable
  // $ function references that cannot be safely memoized by the compiler.
  "use no memo";

  const {
    data: users = [],
    isError,
    isPending,
  } = useGetAll<UsersAPIResponse[]>({
    resourcePath: "users",
    queryKey: ["userRequests"],
  });

  const [sorting, setSorting] = useState<SortingState>([
    { id: "userCreated", desc: false },
  ]);

  const {
    setShowCreateUserDialog,
    setSelectedRowId,
    openDeleteDialog,
    globalFilter,
    setGlobalFilter,
    setShowSuccess,
    setSuccessConfig,
    selectedRowId,
  } = useGlobalContext();

  const { resend, isPending: pendingResendPassword } =
    useResendTemporaryPassword(selectedRowId ?? "");

  // $ Pass the props to the function generating the columns to be used in the table
  // $ Memoize columns so getUserColumns() isn't called on every render.
  // $ The setter functions from useGlobalContext are stable references so
  // $ they are safe to use as dependencies.
  const columns = useMemo(
    () =>
      getUserColumns(
        setShowCreateUserDialog,
        setSelectedRowId,
        openDeleteDialog,
        resend,
        setShowSuccess,
        setSuccessConfig,
      ),
    [
      setShowCreateUserDialog,
      setSelectedRowId,
      openDeleteDialog,
      resend,
      setShowSuccess,
      setSuccessConfig,
    ],
  );

  const table = useReactTable({
    data: users ?? [],
    columns,
    onGlobalFilterChange: setGlobalFilter,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: "includesString",
  });

  if (pendingResendPassword) return <PageLoadingSpinner />;
  if (isPending) return <PageLoadingSpinner />;
  if (isError) return <Error />;

  return (
    <div className="flex w-full md:p-4 min-h-0">
      {/* // $ Desktop View */}
      <div className="bg-white dark:bg-(--bg-primary_dark) lg:flex flex-col gap-1 w-full rounded-xl shadow-lg p-4 h-auto hidden">
        <TableGeneric
          data={users}
          columns={columns}
          rowPath={`/users`}
          className="hidden md:flex flex-col gap-2"
          searchPlaceholderText="search users"
          emptyTablePlaceholderText="No users listed"
          addButton={true}
          openDialog={setShowCreateUserDialog}
          tableHeading="Users"
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
            <div className="flex justify-between items-center text-primary w-full">
              <FormHeading
                className="mx-auto dark:text-gray-100"
                heading="Users"
              />
              <button
                type="button"
                aria-label="create new user"
                onClick={() => setShowCreateUserDialog(true)}
              >
                <PlusCircle />
              </button>
            </div>

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
