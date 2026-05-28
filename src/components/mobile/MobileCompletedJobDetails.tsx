/**
 * MobileCompletedJobDetails.tsx
 *
 * Mobile-first detail view for a completed maintenance job.
 *
 * This component mirrors the desktop `CompletedJobDetails` layout but is optimized for:
 * - Single-column scrolling experience
 * - Touch-friendly sticky tab navigation
 * - Reduced visual density for mobile screens
 * - Tab-based content segmentation (Details, Request, Action, Contractor, Costs)
 *
 * Key behaviors:
 * - Uses internal scroll container with sticky tab bar
 * - Resets scroll position on tab switch
 * - Dynamically switches image source depending on active tab
 * - Conditionally renders Contractor tab when data exists
 *
 * Data Source:
 * - `CompletedJobResponse` from job API schema
 * - Optional `action_data` nested object for completion details
 */

import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Badge } from "../features/Badge";
import { badgeStyles } from "@/styles/badgeStyles";
import { ImageGallery } from "../features/ImageGallery";
import { ChevronLeft, FileText } from "lucide-react";
import type { CompletedJobResponse, PresignedUrls } from "@/schemas/jobSchemas";

// $ ————— Feature Components ——————————————————————————————————————————————————————
import SectionTitle from "../features/layout/SectionTitle";
import Field from "../features/layout/Field";
import DescriptionBox from "../features/layout/DescriptionBox";
import SurfaceCard from "../features/layout/SurfaceCard";
import TimeChip from "../features/layout/TimeChip";
import CostCard from "../features/layout/CostCard";
import PersonRow from "../features/layout/PersonRow";

// $ ————— config ——————————————————————————————————————————————————————————————————
import { TAB_CONFIG, type Tab } from "@/lib/tabConfig";

// $ ————— utils ——————————————————————————————————————————————————————————————————
import { formatDateTime } from "@/utils/formatDateTime";

// $ ── Types ─────────────────────────────────────────────────────────────────────
/**
 * Props for MobileCompletedJobDetails
 *
 */
type Props = {
  /** Completed job payload containing:
   * - job metadata (equipment, asset, location, etc.)
   * - optional action_data (completion details)
   * - images and attachments
   */
  item: CompletedJobResponse;
};

// $ ── Main component ────────────────────────────────────────────────────────────
/**
 * MobileCompletedJobDetails
 *
 *  Path
 * - route: /jobs/:id/complete
 * - backend: api/jobs/:id/complete
 *
 * Renders a mobile-optimized view of a completed maintenance job.
 *
 * Features:
 * - Sticky tab navigation for switching between job sections
 * - Dynamic rendering based on selected tab
 * - Scroll reset on tab change for better UX
 * - Conditional contractor and invoice rendering
 * - Display request and action images in gallery
 * - Cost aggregation across multiple categories
 *
 * @param item - Completed job data from API
 */
function MobileCompletedJobDetails({ item }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("details");
  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement>(null);

  const action = item.action_data;

  const totalCost =
    (Number(action?.total_cost_parts) || 0) +
    (Number(action?.total_cost_sundries) || 0) +
    (Number(action?.total_cost_contractor) || 0);

  const hasContractor = !!action?.contractor && action.contractor.trim() !== "";

  // Resolve images per active tab (mirrors desktop logic)
  const activeImages =
    activeTab === "action" ? (action?.images ?? []) : (item.images ?? []);

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    // Scroll content area back to top on tab switch
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
          Jobs
        </button>
        <p className="flex-1 text-center text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
          Completed Job
        </p>
        {/* Spacer so title stays centred */}
        <div className="w-13" />
      </header>

      {/* ── Scrollable body ── */}
      <div ref={contentRef} className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Image gallery strip — height is fixed so it doesn't push content */}

        {/* Job header card */}
        <div className="bg-white dark:bg-gray-900 px-4 pt-4 pb-3 border-b border-gray-100 dark:border-gray-700/60 space-y-2">
          <p className="text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-500 font-medium mb-1 select-none">
            Job No · {item.jobcardNumber}
          </p>
          <h1 className="text-xl font-semibold capitalize leading-tight text-gray-900 dark:text-gray-100">
            {item.equipment}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Asset ID: {item.assetID}
          </p>
          <div className="flex flex-wrap gap-2 mt-3 text-cxs capitalize">
            <Badge
              value={item.priority ?? "medium"}
              styleMap={badgeStyles.families.priority}
            />
            {item.type && (
              <Badge value={item.type} styleMap={badgeStyles.families.type} />
            )}
            {item.impact && (
              <Badge
                value={item.impact}
                styleMap={badgeStyles.families.impact}
              />
            )}
          </div>
        </div>

        {/* ── Sticky tab bar (sticks within the scroll container) ── */}
        <div
          role="tablist"
          aria-label="Job sections"
          className="flex gap-2 justify-evenly w-full sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700/60 scrollbar-hide py-2 overflow-x-auto"
        >
          {TAB_CONFIG.map(({ key, label, icon: Icon }) => {
            if (key === "contractor" && !hasContractor) return null;
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

        {/* ── Tab content — animates in on each switch ── */}
        <div
          key={activeTab}
          className="flex flex-col gap-3 py-4 px-2 animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          {/* ── Details ── */}
          {activeTab === "details" && (
            <>
              <SurfaceCard>
                <SectionTitle>Overview</SectionTitle>
                <Field label="Jobcard no" value={item.jobcardNumber} />
                <Field label="Asset ID" value={item.assetID} />
                <Field label="Equipment" value={item.equipment} />
                <Field label="Location" value={item.location} />
                <Field label="Area" value={item.area} />
                <Field label="Target date" value={item.targetDate} />
                <Field label="Assigned to" value={item.assign_to_name} />
                <Field label="Group" value={item.assign_to_group} />
                <Field label="Created" value={item.jobCreated} />
              </SurfaceCard>
              {item.description && (
                <SurfaceCard>
                  <SectionTitle>Description</SectionTitle>
                  <DescriptionBox>{item.description}</DescriptionBox>
                </SurfaceCard>
              )}
            </>
          )}

          {/* ── Request ── */}
          {activeTab === "request" && (
            <>
              {item.requested_by && (
                <SurfaceCard>
                  <SectionTitle>Requested by</SectionTitle>
                  <PersonRow
                    name={item.requested_by}
                    sub={`Requested · ${item.jobCreated}`}
                  />
                </SurfaceCard>
              )}

              <SurfaceCard>
                <SectionTitle>Request details</SectionTitle>
                <Field label="Type" value={item.type} />
                <Field label="Priority" value={item.priority} />
                <Field label="Impact" value={item.impact} />
                <Field label="Location" value={item.location} />
              </SurfaceCard>

              {item.approved_by && (
                <SurfaceCard>
                  <SectionTitle>Approved by</SectionTitle>
                  <PersonRow
                    name={item.approved_by}
                    sub={`Approved · ${formatDateTime(item.approved_at) ?? ""}`}
                  />
                </SurfaceCard>
              )}

              {item.jobComments && (
                <SurfaceCard>
                  <SectionTitle>Comments</SectionTitle>
                  <div className="bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700 rounded-md px-3 py-2.5">
                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-1 capitalize">
                      {item.requested_by}
                    </p>
                    <p className="text-sm text-gray-800 dark:text-gray-200">
                      {item.jobComments}
                    </p>
                  </div>
                </SurfaceCard>
              )}
            </>
          )}

          {/* ── Action ── */}
          {activeTab === "action" && action && (
            <>
              {/* Completion banner */}
              <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/40 rounded-full px-3 py-1.5 self-start">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                Completed · {formatDateTime(action.completed_at)}
              </div>

              {action.actioned_by && (
                <SurfaceCard>
                  <SectionTitle>Actioned by</SectionTitle>
                  <PersonRow
                    name={action.actioned_by}
                    sub={action.location ?? item.location ?? ""}
                  />
                </SurfaceCard>
              )}

              {(action.start_time || action.end_time) && (
                <div className="flex gap-2">
                  {action.start_time && (
                    <TimeChip
                      label="Start time"
                      value={formatDateTime(action.start_time) ?? ""}
                    />
                  )}
                  {action.end_time && (
                    <TimeChip
                      label="End time"
                      value={formatDateTime(action.end_time) ?? ""}
                    />
                  )}
                </div>
              )}

              <SurfaceCard>
                <SectionTitle>Details</SectionTitle>
                <Field label="Work order no" value={action.work_order_number} />
                <Field label="Root cause" value={action.root_cause} />
                <Field label="Parts used" value={action.parts} />
                <Field label="Sundries" value={action.sundries} />
                <Field
                  label="Distance"
                  value={action.total_km ? `${action.total_km} km` : null}
                />
                <Field label="Signed off by" value={action.signedBy} />
              </SurfaceCard>

              {action.findings && (
                <SurfaceCard>
                  <SectionTitle>Findings</SectionTitle>
                  <DescriptionBox>{action.findings}</DescriptionBox>
                </SurfaceCard>
              )}

              {action.work_completed && (
                <SurfaceCard>
                  <SectionTitle>Work completed</SectionTitle>
                  <DescriptionBox>{action.work_completed}</DescriptionBox>
                </SurfaceCard>
              )}
            </>
          )}

          {/* ── Contractor ── */}
          {activeTab === "contractor" && action && hasContractor && (
            <SurfaceCard>
              <SectionTitle>Contractor details</SectionTitle>
              <Field label="Contractor" value={action.contractor} />
              <Field
                label="Cost"
                value={
                  action.total_cost_contractor
                    ? `R ${Number(action.total_cost_contractor).toLocaleString()}`
                    : null
                }
              />
            </SurfaceCard>
          )}

          {/* ── Costs ── */}
          {activeTab === "costs" && action && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <CostCard label="Parts" value={action.total_cost_parts} />
                <CostCard label="Sundries" value={action.total_cost_sundries} />
                <CostCard
                  label="Contractor"
                  value={action.total_cost_contractor}
                />
                <CostCard
                  label="Distance"
                  value={action.total_km ? `${action.total_km} km` : null}
                />
              </div>

              <div className="flex items-center justify-between bg-white dark:bg-gray-800/40 border border-gray-100 dark:border-gray-700/60 rounded-xl px-4 py-3">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Total cost
                </span>
                <span className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  R {totalCost.toLocaleString()}
                </span>
              </div>

              <SurfaceCard>
                <SectionTitle>Invoices</SectionTitle>
                {action.invoices && action.invoices.length > 0 ? (
                  <div className="flex flex-col">
                    {action.invoices.map((inv: PresignedUrls, i: number) => (
                      <Link
                        key={i}
                        to={inv.url}
                        className="flex items-center gap-3 py-2.5 border-b border-gray-100 dark:border-gray-700/60 last:border-0 text-sm text-blue-600 dark:text-blue-400"
                      >
                        <FileText className="w-4 h-4 shrink-0 text-gray-400" />
                        {inv.filename}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-4">
                    No invoices attached
                  </p>
                )}
              </SurfaceCard>
            </>
          )}
          <div className="h-52 w-full shrink-0">
            <ImageGallery images={activeImages} />
          </div>
        </div>
        {/* Bottom safe-area padding for home indicator */}
        <div className="h-6" />
      </div>
    </div>
  );
}

export default MobileCompletedJobDetails;
