// $ This component renders the page for the assets register in a table format.
// $ The list is from a Get request to the getAssetsRegister.py lambda function.

import FormHeading from "@/components/customComponents/FormHeading";
import { AssetsOverviewTable } from "@/components/assets/AssetsOverviewTable";
import { useAssetsList } from "@/utils/maintenanceRequests";
import { PageLoadingSpinner } from "@/components/features/PageLoadingSpinner";
import { MobileAssetsOverviewTable } from "@/components/mobile/MolbileAssetsOverviewTable";
import FilterContainer from "@/components/maintenanceRequestTable/FilterContainer";

import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";

import { getAssetColumns } from "../components/assets/columns";
import { getAssetTableMenuItems } from "@/data/TableMenuItems";
import useGlobalContext from "@/context/useGlobalContext";
import { useEffect, useState } from "react";

const AssetsOverviewPage = () => {
  const { data, isLoading, isError } = useAssetsList();
  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);

  const { setShowUpdateAssetDialog, setShowDeleteDialog } = useGlobalContext();

  const menuStateActions = getAssetTableMenuItems(
    setShowUpdateAssetDialog,
    setShowDeleteDialog
  );

  const columns = getAssetColumns(menuStateActions);

  const table = useReactTable({
    data: data ?? [],
    columns: columns,
    columnResizeMode: "onChange",
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  useEffect(() => {
    console.log(table.getState());
  }, [table]);

  if (isLoading) return <PageLoadingSpinner />;
  if (isError) return <p>Error retrieving asset data...</p>;
  // console.log("Asset Table Filter State:", table.getState().columnFilters); // Check if the filters are in runaway state

  return (
    <div className="flex w-full md:p-4 h-auto">
      <div className="bg-white dark:bg-[#1d2739] flex flex-col gap-4 w-full rounded-xl shadow-lg p-4 h-auto">
        <FormHeading className="mx-auto" heading="Assets Register" />
        <FilterContainer table={table} />
        <AssetsOverviewTable className="hidden lg:flex" table={table} />
        <MobileAssetsOverviewTable
          className="flex lg:hidden"
          data={table.getRowModel().rows}
        />
      </div>
    </div>
  );
};

export default AssetsOverviewPage;
