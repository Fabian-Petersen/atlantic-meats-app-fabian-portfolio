import { cn } from "@/lib/utils";
import { sharedStyles } from "@/styles/shared";

// ─── Individual skeleton primitives ──────────────────────────────────────────

function SkeletonBar({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={style}
      className={cn(
        sharedStyles.formInputDefault,
        "animate-pulse rounded-md bg-muted",
        className,
      )}
    />
  );
}

// ─── Select skeleton — label pill + input bar ─────────────────────────────────

function SelectSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("w-full", className)}>
      <SkeletonBar className="h-9 w-full rounded-md" />
    </div>
  );
}

// ─── Textarea skeleton — label pill + taller bar ──────────────────────────────

function TextareaSkeleton({
  rows,
  className,
}: {
  rows?: number;
  className?: string;
}) {
  const height = rows ? `${rows * 1.5}rem` : "6rem";
  // Approximates the rendered height of a <textarea rows={n} />
  return (
    <div className={cn("w-full", className)}>
      <SkeletonBar className="w-full rounded-md" style={{ height }} />
    </div>
  );
}

// ─── File skeleton ────────────────────────────────────────────────────────────

function FileSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("w-full", className)}>
      <SkeletonBar className="h-9 w-full rounded-md" />
    </div>
  );
}

// ─── Full form skeleton ───────────────────────────────────────────────────────

/**
 * Mirrors the exact field layout produced by `useJobFields`:
 *
 *   [description textarea — full width]
 *   [location]   [area]
 *   [equipment]  [assetID]
 *   [type]       [impact]
 *   [priority]   [file upload]
 *   [comments textarea — full width]
 *
 * If your field config changes, update this component to match.
 */
export function FormSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        // Matches sharedStyles.formParent — 2-col grid on lg
        sharedStyles.formParent,
        className,
        "gap-6",
      )}
      aria-busy="true"
      aria-label="Loading form fields"
    >
      {" "}
      <TextareaSkeleton rows={1} className="w-full" />
      {/* description — spans both columns */}
      <TextareaSkeleton rows={1} className="lg:col-span-2" />
      {/* location / area */}
      <SelectSkeleton />
      <SelectSkeleton />
      {/* equipment / assetID */}
      <SelectSkeleton />
      <SelectSkeleton />
      {/* type / impact */}
      <SelectSkeleton />
      <SelectSkeleton />
      {/* priority / file upload */}
      <SelectSkeleton />
      <FileSkeleton />
      {/* jobComments — spans both columns */}
      <TextareaSkeleton rows={4} className="lg:col-span-2" />
      {/* Buttons */}
      <div className={cn("flex gap-4 justify-end mt-6 lg:col-span-2")}>
        <SkeletonBar className="h-10 w-1/4 rounded-md" />
        <SkeletonBar className="h-10 w-1/4 rounded-md" />
      </div>
    </div>
  );
}

export default FormSkeleton;
