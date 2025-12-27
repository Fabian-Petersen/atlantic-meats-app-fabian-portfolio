// $ This component renders the page for the assets register in a table format.
// $ The list is from a Get request to the getAssetsRegister.py lambda function.

import FormHeading from "@/components/customComponents/FormHeading";
import { AssetsOverviewTable } from "@/components/assets/AssetsOverviewTable";
import { useMaintenanceRequests } from "@/utils/maintenanceRequests";
import { PageLoadingSpinner } from "@/components/features/PageLoadingSpinner";

const MaintenanceRequestList = () => {
  const { data, isLoading, isError } = useMaintenanceRequests();
  if (isLoading) return <PageLoadingSpinner />;
  if (isError) return <p>Error retrieving asset data...</p>;

  return (
    <div className="flex w-full p-4 h-auto">
      <div className="bg-white flex flex-col gap-4 w-full rounded-xl shadow-lg p-4 h-auto">
        <FormHeading className="mx-auto" heading="Assets Register" />
        <AssetsOverviewTable data={data ?? []} />
      </div>
    </div>
  );
};

export default MaintenanceRequestList;
