import { Skeleton } from "@/components/ui/skeleton";

type SkeletonInputProps = {
  className?: string;
};

export function SkeletonInput({ className }: SkeletonInputProps) {
  return (
    <div className={className}>
      <Skeleton className="h-10 w-full rounded-md" />
    </div>
  );
}
