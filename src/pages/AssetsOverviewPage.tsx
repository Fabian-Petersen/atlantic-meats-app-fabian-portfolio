// $ This component renders the page for the assets register in a table format.
// $ The list is from a Get request to the getAssetsRegister.py lambda function.

import FormHeading from "../../customComponents/FormHeading";
import { AssetsOverviewTable } from "@/components/assets/AssetsOverviewTable";
import { useGetAll } from "@/utils/api";
import { PageLoadingSpinner } from "@/components/features/PageLoadingSpinner";
import { MobileAssetsOverviewTable } from "@/components/mobile/MolbileAssetsOverviewTable";
import FilterContainer from "@/components/features/FilterContainer";

// $ Import Tanstack Table
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  getPaginationRowModel,
  type SortingState,
  // type PaginationState,
} from "@tanstack/react-table";

import { getAssetColumns } from "../components/assets/columns";
// import { getAssetTableMenuItems } from "@/lib/TableMenuItemsActions";
import useGlobalContext from "@/context/useGlobalContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import type { AssetTableRow } from "@/schemas";
import { ErrorPage } from "@/components/features/Error";
import AddNewItemButton from "@/components/features/AddNewItemButton";

// import type { AssetFormValues } from "@/schemas";

const AssetsOverviewPage = () => {
  const navigate = useNavigate();

  const ASSETS_REQUESTS_KEY = ["assetRequests"];
  const { data, isPending, isError, refetch } = useGetAll<AssetTableRow[]>(
    "assets-list",
    ASSETS_REQUESTS_KEY,
  );

  console.log("Assets data:", data);

  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);

  const { setShowUpdateAssetDialog, setSelectedRowId, openDeleteDialog } =
    useGlobalContext();

  const columns = getAssetColumns(
    setShowUpdateAssetDialog,
    setSelectedRowId,
    openDeleteDialog,
  );

  const table = useReactTable({
    data: data ?? [],
    columns: columns,
    columnResizeMode: "onChange",
    state: { sorting },
    onSortingChange: setSorting,
    // onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (isPending) return <PageLoadingSpinner />;
  if (isError)
    return (
      <ErrorPage
        title="Failed to load assets"
        message="Please check your connection and try again."
        onRetry={refetch}
      />
    );

  if (!data) {
    return (
      <ErrorPage
        title="There are not assets to display!!"
        message="Create an asset to view the details."
      />
    );
  }

  const handleSubmit = () => {
    navigate("/asset");
  };

  return (
    <div className="flex w-full md:p-4 min-h-0">
      <div className="bg-white dark:bg-[#1d2739] flex flex-col gap-4 w-full rounded-xl shadow-lg p-4 border-dashed min-h-0">
        <FormHeading className="mx-auto" heading="Assets Register" />
        <div className="flex gap-4 items-end w-full">
          <FilterContainer table={table} className="" />
          <div className="hidden md:inline-block ml-auto">
            {/* <label className="text-sm md:text-md text-transparent">
              Create Asset
            </label> */}
            <AddNewItemButton
              title="Asset"
              className=""
              onClick={handleSubmit}
            />
          </div>
        </div>

        <AssetsOverviewTable
          className="hidden lg:flex table-fixed"
          table={table}
        />
        <MobileAssetsOverviewTable
          className="flex lg:hidden"
          data={table.getRowModel().rows}
        />
      </div>
    </div>
  );
};

export default AssetsOverviewPage;
