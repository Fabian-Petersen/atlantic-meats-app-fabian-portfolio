import { ArrowLeftRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "../features/Badge";
import { badgeStyles } from "@/styles/badgeStyles";
import Field from "../features/layout/Field";
import SurfaceCard from "../features/layout/SurfaceCard";
import { AnimatePresence, motion } from "framer-motion";
import { motionVariants } from "@/styles/motionStyles";
import type { TransferWorkflowResponse } from "@/schemas/transfersSchemas";
import { sharedStyles } from "@/styles/shared";

type Props = {
  transfer: TransferWorkflowResponse;
  isOpen: boolean;
  onToggle: () => void;
};

function MobileAssetTransferCard({ transfer, isOpen, onToggle }: Props) {
  return (
    <SurfaceCard
      className={cn(
        sharedStyles.cardRowParent,
        isOpen && sharedStyles.cardIsOpen,
      )}
    >
      {/* Transfer summary */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className={cn(
          "flex justify-between items-center w-full",
          sharedStyles.cardRow,
        )}
      >
        <div className="flex items-center gap-2 text-xs">
          <span className="font-medium text-gray-700 dark:text-gray-200 capitalize">
            {transfer?.pending?.locationFrom}
          </span>

          <ArrowLeftRight className="w-3.5 h-3.5 shrink-0 text-blue-500" />

          <span className="font-medium text-gray-700 dark:text-gray-200 capitalize">
            {transfer?.pending?.locationTo}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Badge
            value={transfer?.status}
            styleMap={badgeStyles.families.transfer_status}
          />

          <ChevronDown
            className={cn(
              "w-4 h-4 text-gray-400 dark:text-gray-500",
              "transition-transform duration-200",
              isOpen && "rotate-180",
            )}
          />
        </div>
      </button>

      {/* Transfer details */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            variants={motionVariants.expandable}
            initial="closed"
            animate="open"
            exit="closed"
            className="overflow-hidden"
          >
            <div className="border-t border-gray-100 dark:border-gray-700/60 mt-3 pt-3 flex flex-col gap-2 w-full">
              <Field
                label="Requested by"
                value={transfer?.pending?.requested_by}
              />

              <Field
                label="Approved by"
                value={transfer?.approved?.approvedBy}
              />

              <Field
                label="Date of request"
                value={transfer?.transferCreated ?? null}
              />

              <Field
                label="Date of transfer"
                value={transfer?.["in-transit"]?.transportDate ?? null}
              />

              <Field
                label="Transported By"
                value={transfer?.["in-transit"]?.transportName ?? null}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </SurfaceCard>
  );
}

export default MobileAssetTransferCard;
