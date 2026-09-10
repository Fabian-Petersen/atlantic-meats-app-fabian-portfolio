import { PackagePlus, Plus } from "lucide-react";

type AddAssetButtonProps = {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};

/** Shared presentation for adding another asset to a multi-asset form. */
export function AddAssetButton({ onClick }: AddAssetButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group inline-flex min-h-10 items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-400/10 px-3.5 py-2 text-sm font-semibold text-emerald-700 shadow-xs transition-all hover:cursor-pointer hover:border-emerald-500/50 hover:bg-emerald-400/20 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50 focus-visible:ring-offset-2 dark:border-emerald-400/25 dark:bg-emerald-400/10 dark:text-emerald-300 dark:hover:border-emerald-400/45 dark:hover:bg-emerald-400/15 dark:focus-visible:ring-offset-gray-900"
    >
      <span className="relative flex size-6 items-center justify-center rounded-md bg-emerald-500 text-white shadow-sm transition-transform group-hover:scale-105 dark:bg-emerald-400 dark:text-gray-950">
        <PackagePlus className="size-3.5" aria-hidden="true" />
        <Plus
          className="absolute -right-1 -top-1 size-3 rounded-full bg-white p-0.5 text-emerald-600 ring-1 ring-emerald-500/20 dark:bg-gray-900 dark:text-emerald-300"
          aria-hidden="true"
        />
      </span>
      <span>Add Asset</span>
    </button>
  );
}
