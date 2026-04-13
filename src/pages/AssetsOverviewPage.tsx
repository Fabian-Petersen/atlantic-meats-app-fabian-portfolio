// $ This component renders the page for the assets register in a table format.
// $ The list is from a Get request to the getAssetsRegister.py lambda function.

import FormHeading from "../../customComponents/FormHeading";
import { useGetAll } from "@/utils/api";
import { PageLoadingSpinner } from "@/components/features/PageLoadingSpinner";
import { MobileAssetsOverviewTable } from "@/components/mobile/MolbileAssetsOverviewTable";

// $ Import Tanstack Table
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  getPaginationRowModel,
  type SortingState,
  type PaginationState,
} from "@tanstack/react-table";

import { getAssetColumns } from "../components/tableColumns/AssetColumns";
import useGlobalContext from "@/context/useGlobalContext";
import { useState, useMemo } from "react";
import type { AssetAPIResponse, AssetTableRow } from "@/schemas";
import { ErrorPage } from "@/components/features/Error";
import { GenericTable } from "@/components/dashboard/GenericTable";

const AssetsOverviewPage = () => {
  const { data, isPending, isError, refetch } = useGetAll<AssetAPIResponse[]>({
    resourcePath: "assets",
    queryKey: ["getAssetsList", "assetsList"],
  });

  console.log("Assets data:", data);

  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10, // 👈 this controls "10 items per page"
  });

  const { setShowUpdateAssetDialog, setSelectedRowId, openDeleteDialog } =
    useGlobalContext();

  // $ Map through the data returned to match the TableRow Data Schema
  const rows: AssetTableRow[] = useMemo(
    () =>
      (data ?? []).map((asset) => ({
        id: asset.id,
        createdAt: asset.createdAt,
        location: asset.location,
        area: asset.area,
        equipment: asset.equipment,
        assetID: asset.assetID,
        serialNumber: asset.serialNumber,
        condition: asset.condition,
      })),
    [data],
  );

  const columns = getAssetColumns(
    setShowUpdateAssetDialog,
    setSelectedRowId,
    openDeleteDialog,
  );
  // $ This data is passed into the mobile component
  const table = useReactTable({
    data: rows ?? [],
    columns: columns,
    columnResizeMode: "onChange",
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
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

  return (
    <div className="flex w-full md:p-4 min-h-0">
      <div className="bg-white dark:bg-[#1d2739] flex flex-col gap-4 w-full rounded-xl shadow-lg p-4 border-dashed min-h-0">
        <FormHeading className="mx-auto" heading="Assets Register" />
        <GenericTable
          data={data}
          columns={columns}
          rowPath="/assets"
          addButton={true}
          addButtonPath="/assets"
          pageSize={15}
          addPagination={true}
          addPageSelector={true}
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
