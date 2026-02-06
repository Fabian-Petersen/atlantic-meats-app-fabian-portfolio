// $ This component renders the page for the assets register in a table format.
// $ The list is from a Get request to the getAssetsRegister.py lambda function.

import FormHeading from "../../customComponents/FormHeading";
import { AssetsOverviewTable } from "@/components/assets/AssetsOverviewTable";
import { useDeleteItem, useGetAll } from "@/utils/api";
import { PageLoadingSpinner } from "@/components/features/PageLoadingSpinner";
import { MobileAssetsOverviewTable } from "@/components/mobile/MolbileAssetsOverviewTable";
import FilterContainer from "@/components/maintenanceRequestTable/FilterContainer";

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
import { getAssetTableMenuItems } from "@/data/TableMenuItems";
import useGlobalContext from "@/context/useGlobalContext";
import { useState } from "react";
import type { AssetFormValues } from "@/schemas";
import { ErrorPage } from "@/components/features/Error";

// import type { AssetFormValues } from "@/schemas";

const AssetsOverviewPage = () => {
  const ASSETS_REQUESTS_KEY = ["assetRequests"];
  const { data, isLoading, isError, refetch } = useGetAll<AssetFormValues>(
    "asset",
    ASSETS_REQUESTS_KEY,
  );

  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);

  // const [pagination, setPagination] = useState<PaginationState>({
  //   pageIndex: 0,
  //   pageSize: 5,
  // });

  // $ Logic to Delete an item from the table.
  const { mutateAsync: deleteItem } = useDeleteItem({
    resourcePath: "asset",
    queryKey: ["ASSETS_DELETE_KEY"],
  });

  const { setShowUpdateAssetDialog, setShowDeleteDialog } = useGlobalContext();

  const menuStateActions = getAssetTableMenuItems(
    setShowUpdateAssetDialog,
    setShowDeleteDialog,
    deleteItem,
  );

  const columns = getAssetColumns(menuStateActions);

  const table = useReactTable<AssetFormValues>({
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

  if (isLoading) return <PageLoadingSpinner />;
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

  return (
    <div className="flex w-full md:p-4 min-h-0">
      <div className="bg-white dark:bg-[#1d2739] flex flex-col gap-4 w-full rounded-xl shadow-lg p-4 border-dashed min-h-0">
        <FormHeading className="mx-auto" heading="Assets Register" />
        <FilterContainer table={table} />
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
