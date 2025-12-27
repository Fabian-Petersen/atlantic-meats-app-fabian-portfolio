// $ This component renders the page for the maintenance requests in a table format.
// $ The list is from a Get request to the getMaintenanceRequest.py lambda function.

import FormHeading from "@/components/customComponents/FormHeading";
import { MaintenanceRequestsTable } from "@/components/maintenanceRequestTable/MaintenanceRequestsTable";
import { useMaintenanceRequests } from "@/utils/maintenanceRequests";

import { PageLoadingSpinner } from "@/components/features/PageLoadingSpinner";

const MaintenanceRequestList = () => {
  const { data, isLoading, error } = useMaintenanceRequests();

  if (isLoading) return <PageLoadingSpinner />;

  if (error) return <p>Error Loading maintenance requests</p>;

  return (
    <div className="flex w-full p-4 h-auto">
      <div className="bg-white flex flex-col gap-4 w-full rounded-xl shadow-lg p-4 h-auto">
        <FormHeading className="mx-auto" heading="Maintenance Request List" />
        <MaintenanceRequestsTable data={data ?? []} />
      </div>
    </div>
  );
};

export default MaintenanceRequestList;
