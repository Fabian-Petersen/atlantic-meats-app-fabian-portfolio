// $ This component renders the page for the maintenance requests to be approved in a table format.
// $ The list is from a Get request to the getJobsList.py lambda function.

// $ ———————— React Hooks ———————————————————————————————————————————————————————————————
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// $ ———————— Tanstack Table ————————————————————————————————————————————————————————————
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";

// $ ———————— Data, Context & Types —————————————————————————————————————————————————————
import { useGetAll } from "@/utils/api";
import type { JobApprovedAPIResponse } from "@/schemas/jobSchemas";
import useGlobalContext from "@/context/useGlobalContext";

// $ ———————— Helper Functions  —————————————————————————————————————————————————————————
import { isTargetDateOverdue } from "@/lib/isTargetDateOverdue";

// $ ———————— Columns ———————————————————————————————————————————————————————————————————
import { getInProgressColumns } from "@/components/tableColumns/InProgressColumns";

// $ ———————— Components ————————————————————————————————————————————————————————————————
import { TableGeneric } from "@/components/features/TableGeneric";
import { SearchInput } from "@/components/features/SearchInput";
import { MobileJobsInProgressContainer } from "@/components/mobile/MobileJobsInProgressContainer";
import FormHeading from "@/../customComponents/FormHeading";
import { Error } from "@/components/features/Error";
import { PageLoadingSpinner } from "@/components/features/PageLoadingSpinner";
import EmptyMobilePlaceholder from "@/components/features/EmptyMobilePlaceholder";

/**
 * JobsInProgressListPage
 * Path:/jobs/in-progress
 *
 * This page component is responsible for displaying all maintenance jobs
 * that are currently in progress (approved and active).
 *
 * Data Fetching:
 * - Uses the `useGetAll` hook to retrieve job requests from the backend.
 * - Filters results by `status: "in progress"`.
 * - Handles loading and error states with dedicated UI components.
 *
 * Table Functionality (Desktop):
 * - Uses `@tanstack/react-table` to manage:
 *   - Sorting (default sorted by `jobCreated`)
 *   - Global filtering (search across all rows)
 * - Column definitions are generated via `getInProgressColumns`, allowing
 *   dynamic injection of actions such as:
 *     - Updating a job
 *     - Navigating to job details
 *     - Deleting a job
 *     - Opening chat sidebar
 * - Renders data using the `TableGeneric` component.
 * - Applies conditional row styling:
 *   - Overdue jobs (based on `targetDate`) are highlighted in red.
 *
 * Mobile View:
 * - Displays a simplified layout optimized for smaller screens.
 * - Includes a `SearchInput` for filtering jobs.
 * - Uses `MobileJobsInProgressContainer` to render job items.
 * - Each job is displayed in a clickable accordian card item.
 * - Handles empty states:
 *   - No jobs available
 *   - No results matching the search query
 *
 * Global State Integration:
 * - Uses `useGlobalContext` to manage:
 *   - Selected row ID
 *   - Dialog visibility (update, delete)
 *   - Chat sidebar state
 *   - Global search filter
 *
 * Navigation:
 * - Uses `react-router-dom` navigation for routing between pages.
 *
 * UX Considerations:
 * - Displays a loading spinner while fetching data.
 * - Provides retry functionality on API failure.
 * - Separates desktop and mobile layouts for better responsiveness.
 *
 * Dependencies:
 * - Data fetching: `useGetAll`
 * - Table management: `@tanstack/react-table`
 * - UI components: `TableGeneric`, `FormHeading`, `SearchInput`,
 *   `MobileJobsInProgressContainer`, `EmptyMobilePlaceholder`
 * - Utilities: `isTargetDateOverdue`
 *
 * Notes:
 * - This component focuses on orchestration (data + UI composition).
 * - Business logic such as column actions and date validation is delegated
 *   to helper functions and external modules for better separation of concerns.
 */

const JobsInProgressListPage = () => {
  const { data, isError, isPending } = useGetAll<JobApprovedAPIResponse[]>({
    resourcePath: "jobs/requests",
    queryKey: ["jobs", "in_progress"],
    params: {
      status: "in progress",
    },
  });
  const navigate = useNavigate();

  // console.log("data:", data);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "jobCreated", desc: false },
    { id: "targetDate", desc: false },
  ]);

  const {
    setShowUpdateMaintenanceDialog,
    setSelectedRowId,
    openDeleteDialog,
    setOpenChatSidebar,
    globalFilter,
    setGlobalFilter,
  } = useGlobalContext();

  // $ Pass the props to the function generating the columns to be used in the table
  const columns = getInProgressColumns(
    setShowUpdateMaintenanceDialog,
    navigate,
    setSelectedRowId,
    openDeleteDialog,
    setOpenChatSidebar,
  );

  const table = useReactTable({
    data: data ?? [],
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

  if (isError) return <Error />;

  return (
    <div className="flex w-full lg:p-4 h-auto">
      <div className="bg-white dark:bg-(--bg-primary_dark) lg:flex flex-col gap-4 w-full rounded-xl shadow-lg p-4 h-auto hidden">
        <TableGeneric
          data={data}
          columns={columns}
          rowPath="jobs"
          action="action"
          tableHeading="Jobs - In Progress"
          className="hidden md:flex flex-col gap-2"
          searchPlaceholderText="search jobs"
          rowClassName={(row) => {
            return isTargetDateOverdue(row.targetDate)
              ? "text-red-500"
              : "text-(--clr-textLight) dark:text-(--clr-textDark)";
          }}
        />
      </div>
      {/* // $ Mobile View */}
      <div className="grid lg:hidden gap-2 w-full p-2">
        <SearchInput
          value={globalFilter}
          onChange={setGlobalFilter}
          placeholder="Search Jobs"
        />
        {data.length === 0 ? (
          <EmptyMobilePlaceholder message="No Maintenance requests yet" />
        ) : table.getRowModel().rows.length === 0 ? (
          <EmptyMobilePlaceholder
            message={`No results for "${globalFilter}"`}
          />
        ) : (
          <div className="grid gap-2">
            <FormHeading
              className="mx-auto dark:text-gray-100"
              heading="Jobs - In Progress"
            />
            <MobileJobsInProgressContainer
              className="flex md:hidden"
              data={table.getRowModel().rows}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsInProgressListPage;
