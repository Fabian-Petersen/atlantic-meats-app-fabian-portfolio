import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MapPin,
  ShieldCheck,
  ClipboardList,
  ArrowLeftRight,
  User,
  ScanBarcode,
} from "lucide-react";

import Separator from "@/components/dashboardSidebar/Seperator";
import { Badge } from "../features/Badge";
import { badgeStyles } from "@/styles/badgeStyles";
import { ImageGallery } from "../features/ImageGallery";
import { cn } from "@/lib/utils";

import SectionTitle from "../features/layout/SectionTitle";
import Field from "../features/layout/Field";
import PersonRow from "../features/layout/PersonRow";

import UpdateAssetDialog from "../modals/UpdateAssetDialog";
import type { AssetAPIResponse } from "@/schemas";
import { formatDateTime } from "@/utils/formatDateTime";

// ── Types ─────────────────────────────────────────────────────────────────────

type AssetTab = "details" | "verification" | "maintenance" | "transfers";

type MaintenanceJob = {
  id: string;
  jobcardNumber: string;
  description: string;
  completedAt: string;
  actioned_by: string;
};

type TransferRecord = {
  id: string;
  transfer_from: string;
  transfer_to: string;
  requested_by: string;
  approved_by: string;
  date_of_request: string;
  date_of_transfer: string;
};

type Props = {
  item: AssetAPIResponse & {
    verify_status?: string;
    verified_by?: string;
    last_verified_at?: string;
    next_verification_due?: string;
    verified_location?: { latitude: number; longitude: number };
    maintenanceHistory?: MaintenanceJob[];
    transferHistory?: TransferRecord[];
  };
};

// ── Tab config ────────────────────────────────────────────────────────────────

const ASSET_TAB_CONFIG: {
  key: AssetTab;
  label: string;
  icon: React.ElementType;
}[] = [
  { key: "details", label: "Details", icon: ClipboardList },
  { key: "verification", label: "Verification", icon: ShieldCheck },
  { key: "maintenance", label: "Maintenance", icon: ClipboardList },
  { key: "transfers", label: "Transfers", icon: ArrowLeftRight },
];

// ── Main component ─────────────────────────────────────────────────────────────

function AssetDetails({ item }: Props) {
  const [activeTab, setActiveTab] = useState<AssetTab>("details");
  const navigate = useNavigate();

  const maintenanceJobs = item.maintenanceHistory ?? [];
  const transfers = item.transferHistory ?? [];

  return (
    <div
      className={cn(
        "flex-1 min-h-0 p-4",
        "h-auto hidden bg-(--bg-primary-light) border-gray-700/70 rounded-md text-gray-100",
        "md:grid grid-cols-[1fr_1fr] items-stretch gap-4",
        "dark:bg-(--bg-primary_dark) dark:text-gray-800 shadow-md",
      )}
    >
      {/* ── LEFT: Image panel ── */}
      <div className="h-full overflow-hidden object-cover gap-2">
        <ImageGallery images={item.images ?? []} className="p-0" />
      </div>

      {/* ── RIGHT: Detail panel ── */}
      <div
        className="relative flex flex-col flex-1 gap-4 text-font dark:text-gray-100 rounded-md p-4 border border-gray-100 dark:border-gray-700/50 min-h-0 overflow-y-auto
        custom-scrollbar pr-1 dark:bg-(--bg-primary_dark)"
      >
        {/* Header */}
        <div className="flex flex-col gap-2">
          <p className="text-[12px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-semibold select-none">
            Asset · {item.assetID}
          </p>
          <div className="flex justify-between items-center">
            <h1 className="text-lg md:text-xl font-semibold capitalize leading-tight">
              {item.equipment}
            </h1>
            <UpdateAssetDialog />
          </div>
          <div className="flex gap-1 items-center">
            <MapPin className="size-4 text-green-500" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {item.location}
            </p>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 text-cxs capitalize pt-2 justify-between w-full">
            <div className="flex items-center gap-2">
              {item.condition && (
                <Badge
                  value={item.condition}
                  styleMap={badgeStyles.families.condition}
                />
              )}
              <Badge
                value={
                  item.verify_status === "verified" ? "Verified" : "Unverified"
                }
                styleMap={badgeStyles.families.verification}
              />
              {item.business_unit && (
                <Badge
                  value={item.business_unit}
                  styleMap={badgeStyles.families.business_unit}
                />
              )}
            </div>
            <div className="flex justify-end w-fit px-2">
              <button
                type="button"
                aria-label="verify asset"
                className={cn(
                  "flex gap-2 items-center text-sm hover:cursor-pointer",
                  item.verify_status === "verified"
                    ? "text-emerald-700 dark:text-emerald-400"
                    : "text-red-500 animate-pulse",
                )}
                onClick={() => navigate("/assets/verification")}
              >
                <div className="flex gap-2 items-center">
                  <ScanBarcode
                    className={cn(
                      "size-6",
                      item.verify_status === "verified"
                        ? "text-emerald-700 dark:text-emerald-400"
                        : "text-red-500",
                    )}
                  />
                  <span>Verify Asset</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        <Separator width="100%" className="flex-none" />

        {/* Tab nav */}
        <div className="flex flex-wrap gap-2 md:justify-evenly py-2 -mt-2 w-full">
          {ASSET_TAB_CONFIG.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className={cn(
                "flex flex-1 max-w-40 items-center gap-2 text-xs px-3 py-1.5 rounded-md border transition-colors hover:cursor-pointer",
                activeTab === key
                  ? "bg-primary/70 dark:bg-primary text-(--clr-textLight) dark:text-gray-900 border-transparent"
                  : "border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-400",
              )}
            >
              <Icon className="w-4.5 h-4.5" />
              {label}
            </button>
          ))}
        </div>

        {/* ── Tab: Details ── */}
        {activeTab === "details" && (
          <div className="flex flex-col gap-3">
            <SectionTitle>Overview</SectionTitle>
            <Field label="Asset ID" value={item.assetID} />
            <Field label="Equipment" value={item.equipment} />
            <Field label="Serial Number" value={item.serialNumber} />
            <Field label="Business Unit" value={item.business_unit} />
            <Field label="Area" value={item.area} />
            <Field label="Location" value={item.location} />
            <Field label="Condition" value={item.condition} />
            <Field label="Created" value={item.createdAt} />

            {item.additional_notes && (
              <>
                <Separator width="100%" className="my-1" />
                <SectionTitle>Notes</SectionTitle>
                <div className="bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700 rounded-md px-3 py-2.5">
                  <p className="text-sm text-gray-800 dark:text-gray-200">
                    {item.additional_notes}
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── Tab: Verification ── */}
        {activeTab === "verification" && (
          <div className="flex flex-col gap-4">
            {/* Status banner */}
            <div
              className={cn(
                "flex items-center gap-2 text-xs rounded-md px-3 py-2 max-w-fit border",
                item.verify_status === "verified"
                  ? "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800/40"
                  : "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800/40",
              )}
            >
              <span
                className={cn(
                  "w-1.5 h-1.5 rounded-full shrink-0",
                  item.verify_status === "verified"
                    ? "bg-emerald-500"
                    : "bg-amber-500",
                )}
              />
              {item.verify_status === "verified" ? "erified" : "Unverified"}
              {item.last_verified_at
                ? `· ${formatDateTime(item.last_verified_at)}`
                : ""}
            </div>

            {item.verified_by && (
              <div className="flex flex-col gap-3">
                <SectionTitle>Verified by</SectionTitle>
                <PersonRow
                  name={item.verified_by}
                  sub={`Verified · ${formatDateTime(item.last_verified_at) ?? ""}`}
                />
              </div>
            )}

            <Separator width="100%" />

            <div className="flex flex-col gap-3">
              <SectionTitle>Verification details</SectionTitle>
              <Field
                label="Last verified"
                value={formatDateTime(item.last_verified_at) ?? null}
              />
              <Field
                label="Next due"
                value={formatDateTime(item.next_verification_due) ?? null}
              />
            </div>

            {item.verified_location && (
              <>
                <Separator width="100%" />
                <SectionTitle>Verified location</SectionTitle>
                <div className="flex items-start gap-2 bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700 rounded-md px-3 py-2.5">
                  <MapPin className="w-4 h-4 mt-0.5 text-gray-400 shrink-0" />
                  <div className="flex flex-col gap-0.5">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      GPS Coordinates
                    </p>
                    <p className="text-sm text-gray-800 dark:text-gray-200 font-mono">
                      {item.verified_location.latitude.toFixed(6)},{" "}
                      {item.verified_location.longitude.toFixed(6)}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── Tab: Maintenance history ── */}
        {activeTab === "maintenance" && (
          <div className="flex flex-col gap-4">
            <SectionTitle>Job history</SectionTitle>

            {maintenanceJobs.length > 0 ? (
              <div className="flex flex-col gap-3">
                {maintenanceJobs.map((job) => (
                  <div
                    key={job.id}
                    className="flex flex-col gap-1.5 bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700 rounded-md px-3 py-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[11px] uppercase tracking-widest text-gray-400 dark:text-gray-500 font-medium">
                        {job.jobcardNumber}
                      </p>
                      <p className="text-[11px] text-gray-400 dark:text-gray-500">
                        {formatDateTime(job.completedAt)}
                      </p>
                    </div>
                    <p className="text-sm text-gray-800 dark:text-gray-200 leading-snug">
                      {job.description}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <div className="text-xs text-gray-500 dark:text-gray-400 capitalize flex items-center gap-1">
                        <User className="size-4" />
                        <p>{job.actioned_by}</p>
                      </div>
                      <Link
                        to={`/jobs/${job.id}/complete`}
                        className="text-xs text-blue-500 hover:text-blue-400 hover:underline transition-colors capitalize"
                      >
                        view job
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-8">
                No maintenance history recorded
              </p>
            )}
          </div>
        )}

        {/* ── Tab: Transfers ── */}
        {activeTab === "transfers" && (
          <div className="flex flex-col gap-4">
            <SectionTitle>Transfer history</SectionTitle>

            {transfers.length > 0 ? (
              <div className="flex flex-col gap-3">
                {transfers.map((transfer) => (
                  <div
                    key={transfer.id}
                    className="flex flex-col gap-3 bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700 rounded-md px-3 py-3"
                  >
                    {/* From → To banner */}
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-medium text-gray-700 dark:text-gray-200 capitalize">
                        {transfer.transfer_from}
                      </span>
                      <ArrowLeftRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="font-medium text-gray-700 dark:text-gray-200 capitalize">
                        {transfer.transfer_to}
                      </span>
                    </div>

                    <Separator width="100%" />

                    <div className="flex flex-col gap-2">
                      <Field
                        label="Requested by"
                        value={transfer.requested_by}
                      />
                      <Field label="Approved by" value={transfer.approved_by} />
                      <Field
                        label="Date of request"
                        value={formatDateTime(transfer.date_of_request) ?? null}
                      />
                      <Field
                        label="Date of transfer"
                        value={
                          formatDateTime(transfer.date_of_transfer) ?? null
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-8">
                No transfers recorded
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AssetDetails;

// import Separator from "@/components/dashboardSidebar/Seperator";
// import type { AssetAPIResponse } from "@/schemas";

// import UpdateAssetDialog from "../modals/UpdateAssetDialog";

// type Props = {
//   item: AssetAPIResponse;
// };

// function AssetSingleItemInfo({ item }: Props) {
//   return (
//     <div className="flex gap flex-col text-font dark:text-gray-100 rounded-md p-4 md:p-2 dark:border-gray-700/50 h-full">
//       <UpdateAssetDialog />
//       <Separator width="100%" className="mt-2 mb-4" />
//       <ul className="flex flex-col gap-4 md:text-sm text-xs">
//         <li className="capitalize flex gap-2">
//           <span className="">Asset ID : </span>
//           <span>{item.assetID}</span>
//         </li>
//         <li className="capitalize flex gap-2">
//           <span className="">Business Unit : </span>
//           <span>{item.business_unit}</span>
//         </li>
//         <li className="capitalize flex gap-2">
//           <span className="">Area : </span>
//           <span>{item.area}</span>
//         </li>
//         <li className="capitalize flex gap-2">
//           <span>Condition : </span>
//           <span>{item.condition}</span>
//         </li>
//         <li className="capitalize flex gap-2">
//           <span>Location : </span>
//           <span>{item.location}</span>
//         </li>
//         <li className="capitalize flex gap-2">
//           <span>Serial Number : </span>
//           <span>{item.serialNumber}</span>
//         </li>
//         <li className="capitalize flex gap-2">
//           <span>Comments : </span>
//           <span>{item.additional_notes}</span>
//         </li>
//       </ul>
//     </div>
//   );
// }

// export default AssetSingleItemInfo;
