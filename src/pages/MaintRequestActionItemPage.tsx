// $ This is the maintence request page with the maintenance request form. The user can create a maintenance job/action from this page.

import FormHeading from "@/components/customComponents/FormHeading";
// import Separator from "@/components/dashboardSidebar/Seperator";
// import Seperator from "@/components/ui/separator";
import MaintenanceActionForm from "@/components/maintenance/MaintenanceActionForm";
import useGlobalContext from "@/context/useGlobalContext";

const MaintRequestActionPage = () => {
  const { genericData: requestData } = useGlobalContext();
  console.log("Data from the request on parent:", requestData);
  return (
    <div className="flex items-center justify-center w-full h-full p-4 dark:bg-bgdark bg-gray-100 max-w-6xl">
      <div className="bg-white flex flex-col gap-6 lg:gap-4 w-full max-w-xl lg:max-w-3xl h-auto rounded-xl shadow-lg p-4 dark:bg-[#1d2739] dark:text-gray-100 dark:border-gray-700/50 dark:border">
        <FormHeading
          heading="Action Maintenance Request"
          className="text-center w-full border border-red-500"
        />
        <ul className="px-2 h-12 items-center border-b border-b-gray-300 lg:pb-1 w-full flex lg:gap-2 justify-between text-xs bg-transparent">
          {/* <li className="flex gap-1">
            <span>Store:</span>
            <span>{requestData?.store}</span>
          </li> */}
          <li className="flex gap-1">
            <span>Date:</span>
            <span>{requestData?.createdAt}</span>
          </li>
        </ul>
        {/* <Separator width="100%" className="pb-4 border-gray-400 h-4" /> */}
        {/* <Seperator className="pb-4 border-gray-200/20 h-2" /> */}
        <MaintenanceActionForm />
      </div>
    </div>
  );
};

export default MaintRequestActionPage;
