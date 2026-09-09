import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

import useGlobalContext from "@/context/useGlobalContext";
import ApproveRequestForm from "@/components/modal_request_actions/ApproveRequestForm";
import { CheckCircle2 } from "lucide-react";

function ApproveRequestDialog() {
  const { showApproveRequestDialog, setShowApproveRequestDialog } =
    useGlobalContext();
  return (
    <Dialog
      open={showApproveRequestDialog}
      onOpenChange={setShowApproveRequestDialog}
    >
      <DialogContent className="z-10000 max-h-[calc(100vh-2rem)] gap-0 overflow-y-auto border-slate-200 bg-white p-0 sm:max-w-xl dark:border-gray-700/60 dark:bg-(--bg-primary_dark) dark:text-(--clr-textDark)">
        <div className="border-b border-emerald-100 bg-emerald-50/80 px-3 py-3 pr-9 md:px-5 md:py-5 md:pr-12 dark:border-emerald-900/60 dark:bg-emerald-950/25">
          <div className="flex flex-col items-center gap-3 text-center md:flex-row md:items-start md:text-left">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-900/60 dark:text-emerald-300 dark:ring-emerald-800">
              <CheckCircle2 className="size-5" aria-hidden="true" />
            </div>
            <div className="w-full space-y-1.5">
              <DialogTitle className="w-full text-center text-base leading-5 text-slate-900 capitalize md:w-auto md:text-left md:text-lg md:leading-6 dark:text-slate-100">
                Approve Job request
              </DialogTitle>
              <DialogDescription className="mx-auto max-w-sm text-[11px] leading-4 text-slate-600 md:mx-0 md:max-w-md md:text-xs md:leading-5 dark:text-slate-400">
                Assign the approved work to the appropriate team and set its
                target completion date.
              </DialogDescription>
            </div>
          </div>
        </div>

        <div className="p-2 md:p-5">
          <ApproveRequestForm />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ApproveRequestDialog;
