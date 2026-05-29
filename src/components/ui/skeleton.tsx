import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse dark:bg-gray-400 bg-accent", className)}
      {...props}
    />
  );
}

export { Skeleton };
