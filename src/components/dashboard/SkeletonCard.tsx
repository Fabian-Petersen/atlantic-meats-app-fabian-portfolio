import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCard() {
  return (
    <Card className="w-full border-0 dark:bg-(--bg-primary_dark)">
      <CardContent className="flex items-center justify-between">
        <div className="space-y-2 w-full">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-6 w-1/2" />
        </div>
        <Skeleton className="rounded-full w-12 h-12 shrink-0 aspect-square" />
      </CardContent>
    </Card>
  );
}
