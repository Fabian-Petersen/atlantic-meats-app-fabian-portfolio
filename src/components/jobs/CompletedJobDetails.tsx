import { useState } from "react";
import Separator from "@/components/dashboardSidebar/Seperator";
import { Badge } from "../features/Badge";
import { badgeStyles } from "@/styles/badgeStyles";
import { cn } from "@/lib/utils";
import { ImageGallery } from "../features/ImageGallery";
import type { CompletedJobResponse, PresignedUrls } from "@/schemas/jobSchemas";
import { Link } from "react-router-dom";

// $ ————— Feature Components ——————————————————————————————————————————————————————
import SectionTitle from "../features/layout/SectionTitle";
import Field from "../features/layout/Field";
import DescriptionBox from "../features/layout/DescriptionBox";
import TimeChip from "../features/layout/TimeChip";
import CostCard from "../features/layout/CostCard";
import PersonRow from "../features/layout/PersonRow";

// $ ————— config ——————————————————————————————————————————————————————————————————
import { TAB_CONFIG, type Tab } from "@/lib/tabConfig";

// $ ————— utils ——————————————————————————————————————————————————————————————————
import { formatDateTime } from "@/utils/formatDateTime";

// ── Types ────────────────────────────────────────────────────────────────────

type Props = {
  item: CompletedJobResponse;
};

// $ ── Main component ────────────────────────────────────────────────────────────
/**
 * CompletedJobDetails
 *
 *  Path
 * - route: /jobs/:id/complete
 * - backend: api/jobs/:id/complete
 *
 * Renders a desktop-optimized view of a completed maintenance job.
 *
 * Features:
 * - Sticky tab navigation for switching between job sections
 * - Dynamic rendering based on selected tab
 * - Conditional contractor and invoice rendering
 * - Display request and action images in gallery
 * - Cost aggregation across multiple categories
 *
 * @param item - Completed job data from API
 */

function CompletedJobDetails({ item }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("details");

  const action = item.action_data;

  const totalCost =
    (Number(action?.total_cost_parts) || 0) +
    (Number(action?.total_cost_sundries) || 0) +
    (Number(action?.total_cost_contractor) || 0);

  const hasContractor = !!action?.contractor && action.contractor.trim() !== "";

  return (
    <div
      className={cn(
        "flex-1 min-h-0 p-4",
        "h-auto hidden bg-(--bg-primary-light) border-gray-700/70 rounded-md text-gray-100",
        "md:grid grid-cols-[1fr_1fr] items-stretch gap-4",
        "dark:bg-(--bg-primary_dark) dark:text-gray-800",
      )}
    >
      {/* ── LEFT: Image panel ── */}
      {/* Gallery */}
      {/* <div className="h-[calc(100vh-var(--lg-navbarHeight)-5rem)] object-cover gap-2"> */}
      <div className="h-full overflow-hidden object-cover gap-2">
        <ImageGallery
          images={
            activeTab === "details"
              ? (item.images ?? [])
              : activeTab === "action"
                ? (action?.images ?? [])
                : (item.images ?? [])
          }
          className="p-0"
        />
      </div>

      {/* ── RIGHT: Detail panel ── */}
      <div className="relative flex flex-col flex-1 gap-4 text-font dark:text-gray-100 rounded-md p-4 dark:border-gray-700/50 min-h-0 overflow-y-auto pr-2 custom-scrollbar border dark:bg-(--bg-primary_dark)">
        {/* Header */}
        <div className="flex flex-col gap-2 sticky">
          <p className="text-[11px] uppercase tracking-widest text-gray-400 dark:text-gray-500 font-medium select-none">
            Job No · {item.jobcardNumber}
          </p>
          <h1 className="text-lg md:text-xl font-semibold capitalize leading-tight">
            {item.equipment}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Asset ID: {item.assetID}
          </p>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 text-cxs capitalize pt-2">
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
            {item.status && (
              <Badge
                value={item.status}
                styleMap={badgeStyles.families.status}
              />
            )}
          </div>
        </div>

        <Separator width="100%" className="flex-none" />

        {/* Tab nav */}
        <div className="flex flex-wrap gap-2 md:justify-evenly  -mt-2 w-full">
          {TAB_CONFIG.map(({ key, label, icon: Icon }) => {
            // Hide contractor tab if no contractor data
            if (key === "contractor" && !hasContractor) return null;
            return (
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
            );
          })}
        </div>

        {/* ── Tab: Job details ── */}
        {activeTab === "details" && (
          <div className="flex flex-col gap-3">
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

            {item.description && (
              <>
                <Separator width="100%" className="my-1" />
                <SectionTitle>Description</SectionTitle>
                <DescriptionBox>{item.description}</DescriptionBox>
              </>
            )}
          </div>
        )}

        {/* ── Tab: Request info ── */}
        {activeTab === "request" && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <SectionTitle>Requested by</SectionTitle>
              {item.requested_by && (
                <PersonRow
                  name={item.requested_by}
                  sub={`Requested · ${item.jobCreated}`}
                />
              )}
            </div>

            <Separator width="100%" />

            <div className="flex flex-col gap-3">
              <SectionTitle>Request details</SectionTitle>
              <Field label="Type" value={item.type} />
              <Field label="Priority" value={item.priority} />
              <Field label="Impact" value={item.impact} />
              <Field label="Location" value={item.location} />
            </div>

            {item.approved_by && (
              <>
                <Separator width="100%" />
                <div className="flex flex-col gap-3">
                  <SectionTitle>Approved by</SectionTitle>
                  <PersonRow
                    name={item.approved_by}
                    sub={`Approved · ${formatDateTime(item.approved_at) ?? ""}`}
                  />
                </div>
              </>
            )}

            {item.jobComments && (
              <>
                <Separator width="100%" />
                <SectionTitle>Comments</SectionTitle>
                <div className="bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700 rounded-md px-3 py-2.5">
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-1 capitalize">
                    {item.requested_by}
                  </p>
                  <p className="text-sm text-gray-800 dark:text-gray-200">
                    {item.jobComments}
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── Tab: Action info ── */}
        {activeTab === "action" && action && (
          <div className="flex flex-col gap-4">
            {/* Completion banner */}
            <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/40 rounded-md px-3 py-2 max-w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              Completed · {formatDateTime(action.completed_at)}
            </div>

            <div className="flex flex-col gap-3">
              <SectionTitle>Actioned by</SectionTitle>
              {action.actioned_by && (
                <PersonRow
                  name={action.actioned_by}
                  sub={`${action.location ?? item.location}`}
                />
              )}
            </div>

            {/* Time chips */}
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

            <Separator width="100%" />
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

            {action.findings && (
              <>
                <Separator width="100%" />
                <SectionTitle>Findings</SectionTitle>
                <DescriptionBox>{action.findings}</DescriptionBox>
              </>
            )}

            {action.work_completed && (
              <>
                <Separator width="100%" />
                <SectionTitle>Work completed</SectionTitle>
                <DescriptionBox>{action.work_completed}</DescriptionBox>
              </>
            )}
          </div>
        )}

        {/* ── Tab: Contractor ── */}
        {activeTab === "contractor" && action && hasContractor && (
          <div className="flex flex-col gap-3">
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
          </div>
        )}

        {/* ── Tab: Costs ── */}
        {activeTab === "costs" && action && (
          <div className="flex flex-col gap-4">
            <SectionTitle>Cost breakdown</SectionTitle>
            <div className="grid grid-cols-2 gap-3">
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

            <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700 rounded-md px-4 py-3">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Total cost
              </span>
              <span className="text-xl font-semibold">
                R {totalCost.toLocaleString()}
              </span>
            </div>

            {/* Invoices */}
            <Separator width="100%" />
            <SectionTitle>Invoices</SectionTitle>
            {action.invoices && action.invoices.length > 0 ? (
              <div className="flex flex-col gap-2">
                {action.invoices.map((inv: PresignedUrls, i: number) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 dark:border-gray-700 rounded-md px-3 py-2"
                  >
                    <Link to={inv.url}>{inv.filename}</Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-4">
                No invoices attached
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default CompletedJobDetails;

{
  /* 
  <div className="hidden md:flex flex-col gap-4 px-4 py-8 min-h-[calc(100vh-var(--sm-navbarHeight))] md:h-[calc(100vh-var(--lg-navbarHeight))] overflow-hidden border border-dashed dark:border-yellow-500">
  <div
    className={cn(
      "flex-1 md:min-h-0 h-auto hidden bg-(--bg-primary-light) border-gray-700/70 rounded-md text-gray-100",
      "md:grid grid-cols-[1fr_1fr] items-stretch gap-4",
      "dark:bg-(--bg-primary_dark) dark:text-gray-800 border dark:border-red-500",
    )}
  >
    <div className="h-[calc(100vh-var(--lg-navbarHeight)-5rem)] object-cover gap-2">
      Left component
    </div>
    <div className="relative flex flex-col flex-1 gap-4 text-font dark:text-gray-100 rounded-md p-4 dark:border-gray-700/50 h-full min-h-0 overflow-y-auto pr-2 custom-scrollbar border dark:bg-(--bg-primary_dark)">
      Right Component
    </div>
  </div>
</div>;
 */
}
