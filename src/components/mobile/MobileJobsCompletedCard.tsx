import { ChevronDown, MapPin, Calendar, User, FileText } from "lucide-react";
import type { ActionAPIResponse } from "@/schemas";
import type { Row } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import useGlobalContext from "@/context/useGlobalContext";
import { cn } from "@/lib/utils";
import { sharedStyles } from "@/styles/shared";
import { CardRow } from "./CardRow";
import { Badge } from "../features/Badge";
import { badgeStyles } from "@/styles/badgeStyles";

type JobsActionedCardProps = {
  row: Row<ActionAPIResponse>;
  isOpen: boolean;
  onToggle: () => void;
};

export default function MobileJobsCompletedCard({
  row,
  isOpen,
  onToggle,
}: JobsActionedCardProps) {
  const item = row.original;
  const navigate = useNavigate();
  const { setSelectedRowId } = useGlobalContext();

  return (
    <div className={cn(sharedStyles.cardRowParent, "flex flex-col")}>
      {/* Always-visible header — tap to expand */}
      <button
        type="button"
        className={cn(sharedStyles.cardBtn, "gap-0")}
        onClick={onToggle}
      >
        {/* // $ ——— Location + Meta Row —————————————————————————————————————————————————— */}
        <div className="flex flex-col flex-1 min-w-0">
          <CardRow
            icon={MapPin}
            value={item.location}
            className="capitalize text-(--clr-textLight) py-0"
            valueStyles="text-md font-semibold dark:text-white/90"
            iconStyles="w-3.5 h-3.5 text-blue-500 dark:text-blue-400"
          />
          <CardRow
            value={item.jobcardNumber}
            icon={FileText}
            className=""
            valueStyles="text-cxs"
            iconStyles="w-3.5 h-3.5 text-teal-500 dark:text-teal-400"
          />
          <CardRow
            icon={Calendar}
            value={item.completed_at}
            className=""
            labelStyles=""
            valueStyles="text-cxs"
            iconStyles="w-3.5 h-3.5 text-purple-500 dark:text-purple-400"
          />
        </div>
        <div className="flex gap-2 items-center shrink-0">
          <Badge
            value={item.status}
            styleMap={badgeStyles.families.status}
            className={cn("capitalize")}
          />
          <ChevronDown
            className={cn(
              "w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform duration-200",
              isOpen && "rotate-180",
            )}
          />
        </div>
      </button>

      {/* // $ ——— Expanded Section ——————————————————————————————————————————————————————*/}
      {isOpen && (
        <div className="border-t border-gray-100 dark:border-gray-700/60 px-4 py-3 flex flex-col gap-3">
          {/* // $ ——— Technician ———————————————————————————————————————————————————————— */}
          <div className="flex justify-between items-center">
            <CardRow
              label="Actioned By"
              className="py-0"
              valueStyles="hidden"
            />
            <CardRow
              icon={User}
              className="py-0"
              value={item.actioned_by}
              iconStyles="dark:text-blue-500"
            />
          </div>
          {/* // $ ——— Findings ———————————————————————————————————————————————————————— */}
          {item.findings && (
            <div className="flex flex-col">
              <CardRow
                label="findings"
                labelStyles="text-sm"
                valueStyles="hidden"
                className="py-0"
              />
              <CardRow value={item.findings} className="py-1" />
            </div>
          )}

          {item.work_completed && (
            <div className="flex flex-col border-t border-gray-100 dark:border-gray-700/60 pt-2">
              <CardRow
                label="Work Completed"
                labelStyles="text-sm"
                valueStyles="hidden"
                className="py-0"
              />
              <CardRow value={item.work_completed} className="py-1" />
            </div>
          )}
          {/* // $ ——— Actions ———————————————————————————————————————————————————————— */}
          <div className={cn(sharedStyles.btnParent)}>
            <button
              type="button"
              className={cn(sharedStyles.btnSubmit, sharedStyles.btn, "py-3")}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedRowId(item.id);
                navigate(`/jobs/${item.id}/complete`);
              }}
            >
              View Job Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
