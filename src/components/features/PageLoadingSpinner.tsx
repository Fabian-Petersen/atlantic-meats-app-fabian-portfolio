import { Spinner } from "@/components/ui/spinner";

export function PageLoadingSpinner() {
  return (
    <div className="fixed z-1000 h-screen top-0 left-0 w-full flex items-center justify-center">
      <Spinner className="size-24 text-yellow-500" />
    </div>
  );
}
