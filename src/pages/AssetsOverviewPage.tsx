// $ This component renders the page for the assets register in a table format.
// $ The list is from a Get request to the getAssetsRegister.py lambda function.

import FormHeading from "../../customComponents/FormHeading";
import { useGetAll } from "@/utils/api";
import { PageLoadingSpinner } from "@/components/features/PageLoadingSpinner";
import { MobileAssetsOverviewTable } from "@/components/mobile/MolbileAssetsOverviewTable";

import { useNavigate } from "react-router-dom";

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
import { TableGeneric } from "@/components/features/TableGeneric";
import { SearchInput } from "@/components/features/SearchInput";
import EmptyMobilePlaceholder from "@/components/features/EmptyMobilePlaceholder";
import { Breadcrumbs } from "@/components/features/Breadcrumbs";
import { assetOverviewPageRouteConfig } from "@/lib/routeConfig";
import { cn } from "@/lib/utils";
import { sharedStyles } from "@/styles/shared";

const AssetsOverviewPage = () => {
  const navigate = useNavigate();
  const { data, isPending, isError } = useGetAll<AssetAPIResponse[]>({
    resourcePath: "api/assets",
    queryKey: ["assets", "list"],
  });

  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);

  const [globalFilter, setGlobalFilter] = useState("");

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
    navigate,
  );
  // $ This data is passed into the mobile component
  const table = useReactTable({
    data: rows ?? [],
    columns: columns,
    columnResizeMode: "onChange",
    state: { sorting, pagination, globalFilter },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (isPending) return <PageLoadingSpinner />;
  if (isError) return <p>There was an error loading the assets</p>;

  if (!data) {
    return <p>There was an error loading the assets</p>;
  }

  return (
    <div className="flex flex-col w-full md:p-4 h-auto gap-2">
      <Breadcrumbs
        routes={assetOverviewPageRouteConfig}
        className="hidden md:block"
      />
      <div className="bg-white dark:bg-(--bg-primary_dark) lg:flex flex-col gap-1 w-full rounded-xl shadow-lg p-4 h-auto hidden">
        <TableGeneric
          data={data}
          columns={columns}
          rowPath="assets"
          addButton={true}
          addFilter={true}
          addButtonPath="/assets/create-new-asset"
          pageSize={10}
          addPagination={true}
          addPageSelector={true}
          tableHeading="Assets Register"
        />
      </div>
      {/* // $ Mobile View */}
      <div className="grid lg:hidden gap-2 w-full p-2">
        <SearchInput
          enableMobile={true}
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
              className={cn(sharedStyles.headingForm, "px-0")}
              heading="Assets Register"
              redirect={true}
              redirectTo="/dashboard"
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
