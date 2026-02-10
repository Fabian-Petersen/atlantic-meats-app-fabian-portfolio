// $ This is the maintence request page with the maintenance request form. The user can create a maintenance job/action from this page. The Page is used on mobile and a dialog on desktop.

import FormHeading from "../../customComponents/FormHeading";
import MaintenanceActionForm from "@/components/maintenance/MaintenanceActionForm";
import { useNavigate } from "react-router-dom";

const MaintRequestActionPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center w-full h-full p-4 dark:bg-bgdark bg-gray-100 max-w-6xl">
      <div className="bg-white flex flex-col gap-6 lg:gap-4 w-full max-w-xl lg:max-w-3xl h-auto rounded-xl shadow-lg p-4 dark:bg-[#1d2739] dark:text-gray-100 dark:border-gray-700/50 dark:border">
        <FormHeading
          heading="Action Maintenance Request"
          className="text-center w-full"
        />
        <MaintenanceActionForm onCancel={() => navigate("/maintenance-list")} />
      </div>
    </div>
  );
};

export default MaintRequestActionPage;
