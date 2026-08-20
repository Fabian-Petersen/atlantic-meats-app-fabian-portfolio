import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  className?: string;
};

export function HeadingSkeleton({ className }: Props) {
  return (
    <div className="">
      <Skeleton className={`h-6 w-40 ${className}`} />
    </div>
  );
}
