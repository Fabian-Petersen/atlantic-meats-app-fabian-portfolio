//$ This component display detailed information of the the maintenance request created and actioned data.

import Separator from "@/components/dashboardSidebar/Seperator";
import type { JobAPIResponse } from "@/schemas";
// import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import useGlobalContext from "@/context/useGlobalContext";
import { useById, usePOST } from "@/utils/api";
import { ErrorPage } from "../features/Error";
import { PageLoadingSpinner } from "../features/PageLoadingSpinner";

import { toast } from "sonner";

// icons
import { X, Check } from "lucide-react";

function RequestApproval() {
  const {
    selectedRowId,
    setShowRejectRequestDialog,
    setShowApproveRequestDialog,
  } = useGlobalContext();

  const { mutateAsync: approveRequest, isPending: isApproved } = usePOST({
    id: selectedRowId ?? "",
    action: "approve",
    resourcePath: "jobs",
    queryKey: ["jobs", "approve-job"] as const,
  });

  const { data: item, isPending } = useById<JobAPIResponse>({
    id: selectedRowId ?? "",
    queryKey: ["jobs", "pending-approval-job"],
    resourcePath: "jobs",
    params: {
      status: "Pending",
    },
  });

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

  const handleApprove = async () => {
    setShowApproveRequestDialog(true);
    const payload = {
      selectedRowId: selectedRowId,
      status: "In Progress",
    };

    try {
      const response = await approveRequest(payload);
      console.log("approve-request:", response);
      toast.success("The itemm was sucessfully rejected");
      navigate("/jobs/approved");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="hidden lg:flex gap flex-col gap-2 text-font dark:text-gray-100 rounded-md p-4 dark:border-gray-700/50">
      <div className="flex flex-col gap-2">
        <h1 className="text-md md:text-xl capitalize">
          Request No : {item?.jobcardNumber}
        </h1>
        <div className="capitalize flex gap-2">
          <span className="">Asset : </span>
          <span>{item?.equipment}</span>
        </div>
        <div className="capitalize flex gap-2">
          <span className="">Asset No : </span>
          <span>{item?.assetID}</span>
        </div>
      </div>
      <Separator width="100%" className="mt-2 mb-4" />
      <ul className="flex flex-col gap-4 md:text-sm text-xs">
        <li className="capitalize flex gap-2">
          <span>Requested By : </span>
          <span>{item?.requested_by}</span>
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
        <li className="flex gap-2">
          <span>Comments: </span>
          <span>{item?.jobComments}</span>
        </li>
      </ul>
      <div className="flex w-full justify-end pt-6 bg-red-500/0">
        <div className="flex gap-4 w-[18rem] bg-black/0 justify-end">
          <button
            type="button"
            onClick={() => {
              setShowRejectRequestDialog(true);
            }}
            className="flex-1 py-2 rounded-lg bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-xs font-medium dark:text-red-200 text-red-500 dark:(--clr-red-600) hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors flex items-center justify-center gap-2 hover:cursor-pointer"
          >
            <X w-24 h-24 />
            <span className="text-md">Reject</span>
          </button>
          <button
            type="submit"
            disabled={isApproved}
            // variant="submit"
            // size="lg"
            className="flex-1 py-2 rounded-lg bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-xs font-medium dark:text-green-200 text-green-500 dark:(--clr-red-600) hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors flex items-center justify-center gap-2 hover:cursor-pointer"
            onClick={() => {
              handleApprove();
            }}
          >
            <Check w-24 h-24 />
            <span className="text-md">Approve</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default RequestApproval;
