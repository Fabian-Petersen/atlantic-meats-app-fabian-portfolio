import {
  Dialog,
  DialogTitle,
  // DialogClose,
  DialogContent,
  // DialogFooter,
} from "@/components/ui/dialog";

import MaintenanceUpdateForm from "../jobs/JobUpdateForm";

import useGlobalContext from "@/context/useGlobalContext";
import FormHeading from "../../../customComponents/FormHeading";
import { cn } from "@/lib/utils";
import { sharedStyles } from "@/styles/shared";

function UpdateRequestDialog() {
  const { showUpdateMaintenanceDialog, setShowUpdateMaintenanceDialog } =
    useGlobalContext();
  return (
    <Dialog
      open={showUpdateMaintenanceDialog}
      onOpenChange={setShowUpdateMaintenanceDialog}
    >
      <DialogContent
        className={cn(
          "z-3000 grid max-h-[calc(100dvh-1rem)] w-[calc(100%-1rem)] grid-rows-[auto_minmax(0,1fr)] gap-0 overflow-hidden rounded-xl border border-gray-200/80 bg-white p-0 text-gray-700 shadow-2xl sm:max-w-3xl",
          "dark:border-gray-700/60 dark:bg-(--bg-secondary_dark) dark:text-(--clr-textDark)",
          "**:data-[slot=dialog-close]:top-4 **:data-[slot=dialog-close]:right-4 [&_**:data-[slot=dialog-close]:rounded-full **:data-[slot=dialog-close]:p-1.5 [&_**:data-[slot=dialog-close]:text-gray-500 **:data-[slot=dialog-close]:hover:bg-gray-100",
          "dark:**:data-[slot=dialog-close]:text-gray-400 dark:**:data-[slot=dialog-close]:hover:bg-white/10",
          "",
        )}
      >
        <DialogTitle className="border-b border-gray-200/80 px-5 py-4 pr-14 dark:border-gray-700/60 sm:px-6">
          <FormHeading
            className={cn(
              sharedStyles.headingForm,
              "p-0 text-left font-normal",
            )}
            heading="Update Maintenance request"
          />
        </DialogTitle>
        <div
          className={cn(
            "custom-scrollbar min-h-0 overflow-y-auto px-4 py-5 sm:px-6",
            "[&>form]:gap-5 [&>form]:bg-transparent",
            "[&>form>div:first-child]:gap-5 [&>form>div:first-child]:py-1",
            "[&>form>div:last-child]:sticky [&>form>div:last-child]:bottom-0 [&>form>div:last-child]:z-10",
            "[&>form>div:last-child]:mt-1 [&>form>div:last-child]:w-full [&>form>div:last-child]:max-w-none",
            "[&>form>div:last-child]:bg-white [&>form>div:last-child]:pt-4 dark:[&>form>div:last-child]:bg-(--bg-secondary_dark)",
            "sm:[&>form>div:last-child]:ml-auto sm:[&>form>div:last-child]:max-w-72",
          )}
        >
          <MaintenanceUpdateForm />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default UpdateRequestDialog;
