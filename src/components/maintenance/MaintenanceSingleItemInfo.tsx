//$ This component display detailed information of the the maintenance request created and actioned data.

import Separator from "@/components/dashboardSidebar/Seperator";
import type { JobAPIResponse } from "@/schemas";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import useGlobalContext from "@/context/useGlobalContext";
import { useById } from "@/utils/api";
// import { PageLoadingSpinner } from "../features/PageLoadingSpinner";
import { ErrorPage } from "../features/Error";
import { PageLoadingSpinner } from "../features/PageLoadingSpinner";

// type Props = {
//   item: JobRequestFormValues;
// };

function MaintenanceSingleItemInfo() {
  const { selectedRowId } = useGlobalContext();

  const { data: item, isPending } = useById<JobAPIResponse>({
    id: selectedRowId ?? "",
    queryKey: ["MAINTENANCE-REQUEST-ITEM"],
    resourcePath: "maintenance-request",
  });
  // console.log("resource", selectedRowId);
  const navigate = useNavigate();

  if (isPending) {
    return <PageLoadingSpinner />;
  }

  // fallback UI if timeout reached
  if (!item) {
    return (
      <ErrorPage
        title="Error loading maintenance request!!"
        message="Please check your connection and try again."
      />
    );
  }

  return (
    <div className="flex gap flex-col gap-2 text-font dark:text-gray-100 rounded-md p-4 md:p-2 dark:border-gray-700/50">
      <h1 className="text-lg md:text-2xl">Asset : {item?.equipment}</h1>
      <Separator width="100%" className="mt-2 mb-4" />
      <ul className="flex flex-col gap-4 md:text-md text-sm">
        <li className="capitalize flex gap-2">
          <span className="">Jobcard No : </span>
          <span>{item?.jobcardNumber}</span>
        </li>
        <li className="capitalize flex gap-2">
          <span className="">Asset ID : </span>
          <span>{item?.assetID}</span>
        </li>
        <li className="capitalize flex gap-2">
          <span>Location : </span>
          <span>{item?.location}</span>
        </li>
        <li className="capitalize flex gap-2">
          <span>Description : </span>
          <span>{item?.description}</span>
        </li>
        <li className="capitalize flex gap-2">
          <span>Type : </span>
          <span>{item?.type}</span>
        </li>
        <li className="capitalize flex gap-2">
          <span>Impact : </span>
          <span>{item?.impact}</span>
        </li>
        <li className="capitalize flex gap-2">
          <span>Priority : </span>
          <span>{item?.priority}</span>
        </li>
        <li className="capitalize flex gap-2">
          <span>Additional Notes : </span>
          <span>{item?.jobComments}</span>
        </li>
      </ul>
      <div className="flex w-full justify-end pt-6">
        <div className="flex gap-4 w-1/2">
          <Button
            type="button"
            onClick={() => {
              navigate("/maintenance-list");
            }}
            variant="cancel"
            size="xl"
            className="flex-1 hover:bg-red-500/90 hover:cursor-pointer hover:text-white"
          >
            Back
          </Button>
          <Button
            type="button"
            variant="submit"
            size="xl"
            className="flex-1"
            onClick={() => {
              navigate(`/maintenance-action/${item?.id}`);
            }}
          >
            Action
          </Button>
        </div>
      </div>
    </div>
  );
}

export default MaintenanceSingleItemInfo;
