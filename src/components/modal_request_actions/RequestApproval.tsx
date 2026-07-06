//$ This component display detailed information of the the maintenance request created and actioned data.

import Separator from "@/components/dashboardSidebar/Seperator";
import type { JobAPIResponse } from "@/schemas";
// import { useNavigate } from "react-router-dom";
import useGlobalContext from "@/context/useGlobalContext";
import { useById } from "@/utils/api";
import { Error } from "../features/Error";
import { PageLoadingSpinner } from "../features/PageLoadingSpinner";

// import { toast } from "sonner";

// icons
import { X, Check } from "lucide-react";
import { useState } from "react";
import { Badge } from "../features/Badge";
import { badgeStyles } from "@/styles/badgeStyles";
import { sharedStyles } from "@/styles/shared";
import { cn } from "@/lib/utils";
import Avatar from "../header/Avatar";

// import Avatar from "../header/Avatar";

function Field({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="grid grid-cols-[120px_1fr] gap-2 items-start text-sm">
      <span className="text-xs text-gray-500 dark:text-gray-400 pt-0.5">
        {label}
      </span>
      <span className="text-gray-900 dark:text-gray-100 capitalize font-medium">
        {value}
      </span>
    </div>
  );
}

function RequestApproval() {
  const {
    selectedRowId,
    setShowRejectRequestDialog,
    setShowApproveRequestDialog,
  } = useGlobalContext();

  // Generate a random number for the request - not stored in db
  const [randomNumber] = useState(() => Math.floor(Math.random() * 9999) + 1);
  const formattedNumber = randomNumber.toString().padStart(4, "0");

  // const { mutateAsync: approveRequest, isPending: isApproved } = usePOST({
  //   id: selectedRowId ?? "",
  //   resourcePath: "api/jobs",
  //   queryKey: ["jobs", "action: approve-item"] as const,
  //   action: "approve",
  // });

  const { data: item, isPending } = useById<JobAPIResponse>({
    id: selectedRowId ?? "",
    queryKey: ["jobs", "pending-approval-item"],
    resourcePath: "api/jobs",
    params: {
      status: "pending",
    },
  });

  // console.log("item", item);

  // const navigate = useNavigate();
  if (isPending) {
    return <PageLoadingSpinner />;
  }

  // fallback UI if timeout reached
  if (!item) {
    return <Error />;
  }

  const handleApprove = () => {
    console.log("clicked approved job request");
    setShowApproveRequestDialog(true);
    // const payload = {
    //   selectedRowId: selectedRowId,
    //   status: "in progress",
    // };

    // console.log("payload:", payload);

    // try {
    //   const response = await approveRequest(payload);
    //   console.log("approve-request:", response);
    //   toast.success("The itemm was sucessfully approved");
    //   navigate("/jobs/pending-approval");
    // } catch (error) {
    //   console.log(error);
    // }
  };

  return (
    <div className="flex flex-col gap-4 text-font dark:text-gray-100 rounded-md p-4 dark:border-gray-700/50 h-full">
      {/* 
      <div className="hidden lg:flex gap flex-col gap-2 text-font dark:text-gray-100 rounded-md p-4 dark:border-gray-700/50"> 
      */}

      {/* // $ ── Header ── */}
      <div className="flex flex-col gap-2">
        <p className="text-[11px] uppercase tracking-widest text-gray-400 dark:text-gray-500 font-medium select-none">
          Request No ·{" "}
          {item?.jobcardNumber ?? `${item?.location}-${formattedNumber}`}
        </p>
        <h1 className="text-lg md:text-xl font-semibold capitalize leading-tight">
          {item?.equipment}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
          Asset ID: {item?.assetID}
        </p>
      </div>

      {/* ── Status badges ── */}
      <div className="flex flex-wrap gap-2 text-cxs">
        <Badge
          value={`${item.priority ?? "medium"}`}
          styleMap={badgeStyles.families.priority}
        />
        {item.type && (
          <Badge value={item.type} styleMap={badgeStyles.families.type} />
        )}
        {item.impact && (
          <Badge
            value={item.impact}
            styleMap={
              badgeStyles.families.impact ?? badgeStyles.families.impact
            }
          />
        )}
      </div>
      <Separator width="100%" className="mt-2 mb-4" />

      {/* ── Requester row ── */}
      {item.requested_by && (
        <div className="flex items-center gap-3">
          <Avatar name={item.requested_by} isFullName={true} />
          <div className="flex flex-col leading-snug">
            <span className="text-sm font-medium capitalize">
              {item.requested_by}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {`Requested · ${item.jobCreated}`}
            </span>
          </div>
        </div>
      )}

      {/* ── Structured fields ── */}
      <div className="flex flex-col gap-3">
        <Field label="Location" value={item.location} />
        <Field label="Type" value={item.type} />
        <Field label="Impact" value={item.impact} />
        <Field label="Priority" value={item.priority} />
      </div>

      {/* ── Description box ── */}
      {item.description && (
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-400 dark:text-gray-500">
            Description
          </span>
          <div className="bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700 rounded-md px-3 py-2.5 text-sm leading-relaxed text-gray-800 dark:text-gray-200">
            {item.description}
          </div>
        </div>
      )}

      {/* ── Comments ── */}
      {item.jobComments && (
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-400 dark:text-gray-500">
            Comments
          </span>
          <div className="bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700 rounded-md px-3 py-2.5">
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-1 capitalize">
              {item.requested_by}
            </p>
            <p className="text-sm text-gray-800 dark:text-gray-200">
              {item.jobComments}
            </p>
          </div>
        </div>
      )}

      {/* ── Actions ── */}
      <div className="mt-auto pt-4 flex flex-col gap-6">
        <p className="text-xs text-center text-gray-400 dark:text-gray-500">
          Review all details before approving this request.
        </p>
        {/* <div className="flex w-full justify-end pt-6 bg-red-500/0"> */}
        <div className={cn(sharedStyles.btnParent, "md:w-full")}>
          <button
            type="button"
            onClick={() => {
              setShowRejectRequestDialog(true);
            }}
            className={cn(
              sharedStyles.btnCancel,
              sharedStyles.btn,
              "flex items-center justify-center gap-4",
            )}
          >
            <X className="w-6 h-6" />
            <span className="text-md">Reject</span>
          </button>
          <button
            type="submit"
            // variant="submit"
            // size="lg"
            className={cn(
              sharedStyles.btnApprove,
              sharedStyles.btn,
              "flex items-center justify-center gap-4",
            )}
            onClick={handleApprove}
          >
            <Check className="w-6 h-6" />
            <span className="text-md">Approve</span>
          </button>
        </div>
      </div>
    </div>
    // </div>
  );
}

export default RequestApproval;
