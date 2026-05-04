import { getPriorityClasses, type Priority } from "@/lib/getPriorityClasses";
import { cn } from "@/lib/utils";

type PriorityBadgeProps = {
  value: Priority | string;
  className?: string;
};

export function PriorityBadge({ value, className }: PriorityBadgeProps) {
  return (
    <p
      className={cn(
        "capitalize text-cxs",
        getPriorityClasses(value as Priority),
        className,
      )}
    >
      {value}
    </p>
  );
}
