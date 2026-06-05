/**
 * MobileAssetDetails.tsx
 *
 * Mobile-first detail view for an asset.
 *
 * This component mirrors the desktop `AssetDetails` layout but is optimised for:
 * - Single-column scrolling experience
 * - Touch-friendly sticky tab navigation
 * - Reduced visual density for mobile screens
 * - Tab-based content segmentation (Details, Verification, Maintenance, Transfers)
 *
 * Key behaviours:
 * - Uses internal scroll container with sticky tab bar
 * - Resets scroll position on tab switch
 * - Conditionally renders GPS block when verified_location is present
 * - Empty states for maintenance and transfer history
 *
 * Data Source:
 * - `AssetAPIResponse` extended with verification and history fields
 */

import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Badge } from "../features/Badge";
import { badgeStyles } from "@/styles/badgeStyles";
import { ImageGallery } from "../features/ImageGallery";
import {
  ChevronLeft,
  ClipboardList,
  ShieldCheck,
  ArrowLeftRight,
  MapPin,
  Wrench,
} from "lucide-react";

// $ ————— Feature Components ——————————————————————————————————————————————————————
import SectionTitle from "../features/layout/SectionTitle";
import Field from "../features/layout/Field";
import DescriptionBox from "../features/layout/DescriptionBox";
import SurfaceCard from "../features/layout/SurfaceCard";
import PersonRow from "../features/layout/PersonRow";

// $ ————— utils ——————————————————————————————————————————————————————————————————
import { formatDateTime } from "@/utils/formatDateTime";
import type { AssetAPIResponse } from "@/schemas";

import UpdateAssetDialog from "../modals/UpdateAssetDialog";

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
  { key: "verification", label: "Verify", icon: ShieldCheck },
  { key: "maintenance", label: "Jobs", icon: Wrench },
  { key: "transfers", label: "Transfers", icon: ArrowLeftRight },
];

// ── Main component ─────────────────────────────────────────────────────────────

function MobileAssetDetails({ item }: Props) {
  const [activeTab, setActiveTab] = useState<AssetTab>("details");
  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement>(null);

  const maintenanceJobs = item.maintenanceHistory ?? [];
  const transfers = item.transferHistory ?? [];

  const handleTabChange = (tab: AssetTab) => {
    setActiveTab(tab);
    contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    // Outer wrapper: full screen, flex column, no overflow on root
    <div className="flex flex-col min-h-100dvh bg-gray-50 dark:bg-gray-900 md:hidden">
      {/* ── Sticky top nav ── */}
      <header className="flex items-center gap-3 px-4 h-14 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700/60 shrink-0 z-10">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 -ml-1"
          aria-label="Go back"
        >
          <ChevronLeft className="w-5 h-5" />
          Return
        </button>
        <p className="flex-1 text-center text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
          Asset Details
        </p>
        {/* Edit action aligned right, matches header width of back button */}
        <div className="w-13 flex justify-end">
          <UpdateAssetDialog />
        </div>
      </header>

      {/* ── Scrollable body ── */}
      <div ref={contentRef} className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Asset header card */}
        <div className="bg-white dark:bg-gray-900 px-4 pt-4 pb-3 border-b border-gray-100 dark:border-gray-700/60 space-y-2">
          <p className="text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-500 font-medium mb-1 select-none">
            Asset · {item.assetID}
          </p>
          <h1 className="text-xl font-semibold capitalize leading-tight text-gray-900 dark:text-gray-100">
            {item.equipment}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {item.location}
          </p>
          <div className="flex flex-wrap justify-between items-center gap-2 mt-3 text-cxs capitalize">
            <div className="flex gap-2">
              {item.condition && (
                <Badge
                  value={item.condition}
                  styleMap={badgeStyles.families.condition}
                />
              )}
              {item.business_unit && (
                <Badge
                  value={item.business_unit}
                  styleMap={badgeStyles.families.business_unit}
                />
              )}
            </div>
            <Badge
              value={
                item.verify_status === "verified" ? "Verified" : "Unverified"
              }
              styleMap={badgeStyles.families.verification}
            />
          </div>
        </div>

        {/* ── Sticky tab bar ── */}
        <div
          role="tablist"
          aria-label="Asset sections"
          className="flex gap-2 justify-evenly w-full sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700/60 scrollbar-hide py-2 overflow-x-auto"
        >
          {ASSET_TAB_CONFIG.map(({ key, label, icon: Icon }) => {
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`tabpanel-${key}`}
                id={`tab-${key}`}
                onClick={() => handleTabChange(key)}
                className={cn(
                  "flex-none flex flex-col items-center gap-1 px-2 pt-3 pb-0 text-[11px] border-b-2 transition-colors whitespace-nowrap",
                  isActive
                    ? "text-blue-600 dark:text-blue-500 border-blue-700"
                    : "text-gray-500 dark:text-gray-400 border-transparent",
                )}
              >
                <Icon className="w-4.5 h-4.5" />
                <span className="pb-2">{label}</span>
              </button>
            );
          })}
        </div>

        {/* ── Tab content ── */}
        <div
          key={activeTab}
          className="flex flex-col gap-3 py-4 px-2 animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          {/* ── Details ── */}
          {activeTab === "details" && (
            <>
              <SurfaceCard>
                <SectionTitle>Overview</SectionTitle>
                <Field label="Asset ID" value={item.assetID} />
                <Field label="Equipment" value={item.equipment} />
                <Field label="Serial Number" value={item.serialNumber} />
                <Field label="Business Unit" value={item.business_unit} />
                <Field label="Area" value={item.area} />
                <Field label="Location" value={item.location} />
                <Field label="Condition" value={item.condition} />
                <Field label="Created" value={item.createdAt} />
              </SurfaceCard>

              {item.additional_notes && (
                <SurfaceCard>
                  <SectionTitle>Notes</SectionTitle>
                  <DescriptionBox>{item.additional_notes}</DescriptionBox>
                </SurfaceCard>
              )}
              {/* Image gallery strip — rendered at the bottom of every tab */}
              <div className="h-52 w-full shrink-0">
                <ImageGallery images={item.images ?? []} />
              </div>
            </>
          )}

          {/* ── Verification ── */}
          {activeTab === "verification" && (
            <>
              {/* Status banner */}
              <div
                className={cn(
                  "flex items-center gap-2 text-xs rounded-full px-3 py-1.5 self-start border",
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
                {item.verify_status === "verified" ? "Verified" : "Unverified"}
                {item.last_verified_at
                  ? ` · ${formatDateTime(item.last_verified_at)}`
                  : ""}
              </div>

              {item.verified_by && (
                <SurfaceCard>
                  <SectionTitle>Verified by</SectionTitle>
                  <PersonRow
                    name={item.verified_by}
                    sub={`Verified · ${formatDateTime(item.last_verified_at) ?? ""}`}
                  />
                </SurfaceCard>
              )}

              <SurfaceCard>
                <SectionTitle>Verification details</SectionTitle>
                <Field
                  label="Last verified"
                  value={formatDateTime(item.last_verified_at) ?? null}
                />
                <Field
                  label="Next due"
                  value={formatDateTime(item.next_verification_due) ?? null}
                />
              </SurfaceCard>

              {item.verified_location && (
                <SurfaceCard>
                  <SectionTitle>Verified location</SectionTitle>
                  <div className="flex items-start gap-3 bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700 rounded-md px-3 py-2.5">
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
                </SurfaceCard>
              )}
            </>
          )}

          {/* ── Maintenance / Job history ── */}
          {activeTab === "maintenance" && (
            <>
              <p className="text-[11px] uppercase tracking-widest text-gray-400 dark:text-gray-500 font-medium px-2 select-none">
                Job history
              </p>

              {maintenanceJobs.length > 0 ? (
                maintenanceJobs.map((job) => (
                  <SurfaceCard key={job.id}>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <p className="text-[11px] uppercase tracking-widest text-gray-400 dark:text-gray-500 font-medium">
                        {job.jobcardNumber}
                      </p>
                      <p className="text-[11px] text-gray-400 dark:text-gray-500">
                        {formatDateTime(job.completedAt)}
                      </p>
                    </div>
                    <p className="text-sm text-gray-800 dark:text-gray-200 leading-snug mb-3">
                      {job.description}
                    </p>
                    <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-700/60 pt-2.5">
                      <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                        {job.actioned_by}
                      </p>
                      <Link
                        to={`/jobs/${job.id}/complete`}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        View job →
                      </Link>
                    </div>
                  </SurfaceCard>
                ))
              ) : (
                <SurfaceCard>
                  <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-6">
                    No maintenance history recorded
                  </p>
                </SurfaceCard>
              )}
            </>
          )}

          {/* ── Transfers ── */}
          {activeTab === "transfers" && (
            <>
              <p className="text-[11px] uppercase tracking-widest text-gray-400 dark:text-gray-500 font-medium px-2 select-none">
                Transfer history
              </p>

              {transfers.length > 0 ? (
                transfers.map((transfer) => (
                  <SurfaceCard key={transfer.id}>
                    {/* From → To banner */}
                    <div className="flex items-center gap-2 text-xs mb-3">
                      <span className="font-medium text-gray-700 dark:text-gray-200 capitalize">
                        {transfer.transfer_from}
                      </span>
                      <ArrowLeftRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="font-medium text-gray-700 dark:text-gray-200 capitalize">
                        {transfer.transfer_to}
                      </span>
                    </div>

                    <div className="border-t border-gray-100 dark:border-gray-700/60 pt-3 flex flex-col gap-2">
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
                  </SurfaceCard>
                ))
              ) : (
                <SurfaceCard>
                  <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-6">
                    No transfers recorded
                  </p>
                </SurfaceCard>
              )}
            </>
          )}
        </div>
        {/* Bottom safe-area padding for home indicator */}
      </div>
      <div className="mt-2" />
    </div>
  );
}

export default MobileAssetDetails;
