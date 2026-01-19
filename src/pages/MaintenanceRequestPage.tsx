// $ This is the maintence request page with the maintenance request form. The user can create a maintenance job/action from this page.

import FormHeading from "../../customComponents/FormHeading";
import { ErrorPage } from "@/components/features/Error";
import MaintenanceRequestForm from "@/components/maintenance/MaintenanceRequestForm";
import useGlobalContext from "@/context/useGlobalContext";

const MaintenanceRequestPage = () => {
  const { hasError } = useGlobalContext();

  if (hasError) {
    <ErrorPage />;
  }

  return (
    <div className="flex items-center justify-center w-full h-full p-4 dark:bg-bgdark bg-gray-100">
      <div className="bg-white flex flex-col gap-4 w-full lg:max-w-3xl h-auto rounded-xl shadow-lg p-4 dark:bg-[#1d2739] dark:text-gray-100 dark:border-gray-700/50 dark:border">
        <FormHeading className="py-4" heading="Maintenance Request" />
        <MaintenanceRequestForm />
      </div>
    </div>
  );
};

export default MaintenanceRequestPage;
