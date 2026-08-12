import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { sharedStyles } from "@/styles/shared";
import { motionVariants } from "@/styles/motionStyles";

type ExpandableCardProps = {
  isOpen: boolean;
  onToggle: () => void;
  header: ReactNode;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
};

export function MobileExpandableCard({
  isOpen,
  onToggle,
  header,
  children,
  className,
  headerClassName,
  bodyClassName,
}: ExpandableCardProps) {
  return (
    <div
      className={cn(
        sharedStyles.cardRowParent,
        "flex flex-col",
        isOpen && sharedStyles.cardIsOpen,
        className,
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        className={cn(sharedStyles.cardBtn, headerClassName)}
      >
        <div className="flex-1 min-w-0">{header}</div>

        <ChevronDown
          className={cn(
            "w-4 h-4 shrink-0 text-gray-400 dark:text-gray-500 transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            variants={motionVariants.expandable}
            initial="closed"
            animate="open"
            exit="closed"
            className="overflow-hidden"
          >
            <div className={bodyClassName}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
