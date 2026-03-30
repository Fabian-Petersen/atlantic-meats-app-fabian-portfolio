import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCard() {
  return (
    <Card className="w-full border-0">
      <CardContent className="p-4 flex items-center justify-between">
        <div className="space-y-2 w-full">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-6 w-1/2" />
        </div>
        <Skeleton className="h-10 w-10" />
      </CardContent>
    </Card>
  );
}
