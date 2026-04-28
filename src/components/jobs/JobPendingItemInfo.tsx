//$ This component display detailed information of the the maintenance request created and actioned data.

import Separator from "@/components/dashboardSidebar/Seperator";
import type { JobAPIResponse } from "@/schemas";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import useGlobalContext from "@/context/useGlobalContext";
import { useById } from "@/utils/api";
// import { PageLoadingSpinner } from "../features/PageLoadingSpinner";
import { Error } from "../features/Error";
import { PageLoadingSpinner } from "../features/PageLoadingSpinner";

// type Props = {
//   job: JobRequestFormValues;
// };

function JobPendingSingleItemInfo() {
  const { selectedRowId } = useGlobalContext();

  const { data: job, isPending } = useById<JobAPIResponse>({
    id: selectedRowId ?? "",
    queryKey: ["jobs", "pending-approval-job"],
    resourcePath: "jobs",
    params: {
      status: "pending",
    },
  });
  const navigate = useNavigate();

  if (isPending) {
    return <PageLoadingSpinner />;
  }

  // fallback UI if timeout reached
  if (!job) {
    return <Error />;
  }

  return (
    <div className="flex gap flex-col gap-2 text-font dark:text-gray-100 rounded-md p-4 dark:border-gray-700/50">
      <div className="flex flex-col gap-2">
        <h1 className="text-md md:text-xl capitalize">
          Request No : {job?.jobcardNumber}
        </h1>
        <div className="capitalize flex gap-2">
          <span className="">Asset : </span>
          <span>{job?.equipment}</span>
        </div>
        <div className="capitalize flex gap-2">
          <span className="">Asset No : </span>
          <span>{job?.assetID}</span>
        </div>
      </div>
      <Separator width="100%" className="mt-2 mb-4" />
      <ul className="flex flex-col gap-4 md:text-sm text-xs">
        <li className="capitalize flex gap-2">
          <span>Requested By : </span>
          <span>{job?.requested_by}</span>
        </li>
        <li className="capitalize flex gap-2">
          <span>Location : </span>
          <span>{job?.location}</span>
        </li>
        <li className="capitalize flex gap-2">
          <span>Description : </span>
          <span>{job?.description}</span>
        </li>
        <li className="capitalize flex gap-2">
          <span>Type : </span>
          <span>{job?.type}</span>
        </li>
        <li className="capitalize flex gap-2">
          <span>Impact : </span>
          <span>{job?.impact}</span>
        </li>
        <li className="capitalize flex gap-2">
          <span>Priority : </span>
          <span>{job?.priority}</span>
        </li>
        <li className="flex gap-2">
          <span>Comments: </span>
          <span>{job?.jobComments}</span>
        </li>
      </ul>
      <div className="flex w-full justify-end pt-6">
        <div className="flex gap-4 w-1/2">
          <Button
            type="button"
            onClick={() => {
              navigate("/jobs/pending");
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
              navigate(`/jobs/actioned/${job?.id}`);
            }}
          >
            Action
          </Button>
        </div>
      </div>
    </div>
  );
}

export default JobPendingSingleItemInfo;
