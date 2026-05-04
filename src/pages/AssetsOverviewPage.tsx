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
// import { Error } from "@/components/features/Error";
import { GenericTable } from "@/components/dashboard/GenericTable";
import { SearchInput } from "@/components/features/SearchInput";
import EmptyMobilePlaceholder from "@/components/features/EmptyMobilePlaceholder";

const AssetsOverviewPage = () => {
  const { data, isPending, isError } = useGetAll<AssetAPIResponse[]>({
    resourcePath: "assets-data",
    queryKey: ["getAssetsList", "assetsList"],
  });

  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10, // 👈 this controls "10 items per page"
  });

  const [globalFilter, setGlobalFilter] = useState("");

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
    globalFilterFn: "includesString",
  });

  if (isPending) return <PageLoadingSpinner />;
  if (isError) return <p>There was an error loading the assets</p>;

  if (!data) {
    return <p>There was an error loading the assets</p>;
  }

  return (
    <div className="flex w-full md:p-4 h-auto">
      <div className="bg-white dark:bg-(--bg-primary_dark) lg:flex flex-col gap-1 w-full rounded-xl shadow-lg p-4 h-auto hidden">
        <GenericTable
          data={data}
          columns={columns}
          rowPath="/assets"
          addButton={true}
          addButtonPath="/assets"
          pageSize={10}
          addPagination={true}
          addPageSelector={true}
          tableHeading="Assets Register"
        />
      </div>
      {/* // $ Mobile View */}
      <div className="grid lg:hidden gap-2 w-full p-2">
        <SearchInput
          value={globalFilter}
          onChange={setGlobalFilter}
          placeholder="Search Assets"
        />{" "}
        {data.length === 0 ? (
          <EmptyMobilePlaceholder message="No Assets available yet" />
        ) : table.getRowModel().rows.length === 0 ? (
          <EmptyMobilePlaceholder
            message={`No results for "${globalFilter}"`}
          />
        ) : (
          <div className="grid gap-2">
            <FormHeading
              className="mx-auto dark:text-gray-100"
              heading="Assets Register"
            />
            <MobileAssetsOverviewTable
              className="flex lg:hidden"
              data={table.getRowModel().rows}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AssetsOverviewPage;
