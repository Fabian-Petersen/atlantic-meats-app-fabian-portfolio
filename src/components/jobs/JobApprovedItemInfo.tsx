//$ This component display detailed information of the the maintenance request created and actioned data.

import Separator from "@/components/dashboardSidebar/Seperator";
import type { JobApprovedAPIResponse } from "@/schemas/jobSchemas";
import { useNavigate } from "react-router-dom";
import { Badge } from "../features/Badge";
import { badgeStyles } from "@/styles/badgeStyles";
import Avatar from "../header/Avatar";
import { cn } from "@/lib/utils";
import { sharedStyles } from "@/styles/shared";
import { Wrench } from "lucide-react";
import { formatDateTime } from "@/utils/formatDateTime";

type Props = {
  item: JobApprovedAPIResponse;
  selectedAssetIndex: number;
  onSelectAsset: (index: number) => void;
};

function Field({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="grid grid-cols-[120px_1fr] items-start gap-2 text-sm">
      <span className="pt-0.5 text-xs text-gray-500 dark:text-gray-400">
        {label}
      </span>
      <span className="font-medium capitalize text-gray-900 dark:text-gray-100">
        {value}
      </span>
    </div>
  );
}

function JobApprovedItemInfo({
  item,
  selectedAssetIndex,
  onSelectAsset,
}: Props) {
  const navigate = useNavigate();
  const assets = item.assets?.length
    ? item.assets
    : [
        {
          equipment: item.equipment,
          assetID: item.assetID,
          area: item.area,
          assetIssueReason: item.assetIssueReason,
          assetIssueDetails: item.assetIssueDetails,
          images: item.images ?? [],
        },
      ];
  const currentAsset = assets[selectedAssetIndex] ?? assets[0];

  return (
    <div className="flex h-full flex-col gap-4 rounded-md p-4 text-font dark:border-gray-700/50 dark:text-gray-100">
      <div className="flex flex-col gap-2">
        <p className="select-none text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-gray-500">
          Request No · {item.jobcardNumber}
        </p>
        <h1 className="text-lg font-semibold capitalize leading-tight md:text-xl">
          {currentAsset?.equipment}
        </h1>
        <p className="text-sm capitalize text-gray-500 dark:text-gray-400">
          Asset ID: {currentAsset?.assetID || "Not provided"}
        </p>
      </div>

      {assets.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {assets.map((asset, index) => (
            <button
              key={`${asset.assetID ?? "asset"}-${index}`}
              type="button"
              onClick={() => onSelectAsset(index)}
              className={cn(
                "rounded-md border p-1.5 text-xs font-medium capitalize transition-colors hover:cursor-pointer",
                index === selectedAssetIndex
                  ? "border-green-500 bg-green-400/10 text-green-500"
                  : "border-gray-200 text-gray-500 hover:border-gray-300 dark:border-gray-700 dark:text-gray-400 dark:hover:border-gray-600",
              )}
            >
              {`Asset ${index + 1} · ${asset.assetID || "No ID"}`}
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2 text-cxs">
        <Badge
          value={item.priority ?? "medium"}
          styleMap={badgeStyles.families.priority}
        />
        {item.type && (
          <Badge value={item.type} styleMap={badgeStyles.families.type} />
        )}
        {item.impact && (
          <Badge value={item.impact} styleMap={badgeStyles.families.impact} />
        )}
        {item.status && (
          <Badge value={item.status} styleMap={badgeStyles.families.status} />
        )}
      </div>

      <Separator width="100%" className="mb-2 mt-2" />

      {item.requested_by && (
        <div className="flex items-center gap-3">
          <Avatar name={item.requested_by} isFullName={true} />
          <div className="flex flex-col leading-snug">
            <span className="text-sm font-medium capitalize">
              {item.requested_by}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Requested · {formatDateTime(item.jobCreated) ?? item.jobCreated}
            </span>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <Field label="Area" value={currentAsset?.area} />
        <Field label="Location" value={item.location} />
        <Field label="Issue reason" value={currentAsset?.assetIssueReason} />
        <Field label="Issue details" value={currentAsset?.assetIssueDetails} />
        <Field label="Assigned to" value={item.assign_to_name} />
        <Field label="Assigned group" value={item.assign_to_group} />
        <Field label="Target date" value={item.targetDate} />
        <Field label="Approved by" value={item.approved_by} />
        <Field
          label="Approved"
          value={formatDateTime(item.approved_at) ?? item.approved_at}
        />
      </div>

      {item.description && (
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-400 dark:text-gray-500">
            Description
          </span>
          <div className="rounded-md border border-gray-100 bg-gray-50 px-3 py-2.5 text-sm leading-relaxed text-gray-800 dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-200">
            {item.description}
          </div>
        </div>
      )}

      <div className="mt-auto flex flex-col gap-4 pt-4">
        <p className="text-center text-xs text-gray-400 dark:text-gray-500">
          Review the request details before actioning this job.
        </p>
        <div
          className={cn(
            sharedStyles.btnParent,
            "mx-auto w-full max-w-sm md:mx-auto md:w-full md:max-w-sm",
          )}
        >
          <button
            type="button"
            onClick={() => navigate(`/jobs/${item.id}/in-progress/action`)}
            className={cn(
              sharedStyles.btnApprove,
              sharedStyles.btn,
              "flex min-h-12 items-center justify-center gap-3 px-8 py-3 text-sm font-semibold shadow-md shadow-green-900/15",
            )}
          >
            <Wrench className="size-6" />
            <span>Action Job</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default JobApprovedItemInfo;
