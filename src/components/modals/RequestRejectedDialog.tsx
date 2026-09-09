import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

import useGlobalContext from "@/context/useGlobalContext";
import RejectRequestForm from "@/components/modal_request_actions/RejectRequestForm";
import { OctagonX } from "lucide-react";

function RejectRequestDialog() {
  const { showRejectRequestDialog, setShowRejectRequestDialog } =
    useGlobalContext();
  return (
    <Dialog
      open={showRejectRequestDialog}
      onOpenChange={setShowRejectRequestDialog}
    >
      <DialogContent className="z-10000 max-h-[calc(100vh-2rem)] gap-0 overflow-y-auto border-slate-200 bg-white p-0 sm:max-w-xl dark:border-gray-700/60 dark:bg-(--bg-primary_dark) dark:text-(--clr-textDark)">
        <div className="border-b border-red-100 bg-red-50/80 px-3 py-3 pr-9 md:px-5 md:py-5 md:pr-12 dark:border-red-900/60 dark:bg-red-950/25">
          <div className="flex flex-col items-center gap-3 text-center md:flex-row md:items-start md:text-left">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-700 ring-1 ring-red-200 dark:bg-red-900/60 dark:text-red-300 dark:ring-red-800">
              <OctagonX className="size-5" aria-hidden="true" />
            </div>
            <div className="w-full space-y-1.5">
              <DialogTitle className="w-full text-center text-base leading-5 text-slate-900 md:w-auto md:text-left md:text-lg md:leading-6 dark:text-slate-100">
                Reject Job Request
              </DialogTitle>
              <DialogDescription className="mx-auto max-w-sm text-[11px] leading-4 text-slate-600 md:mx-0 md:max-w-md md:text-xs md:leading-5 dark:text-slate-400">
                This will remove the request from the pending approval queue.
                Provide a clear reason so the requester knows what needs
                attention.
              </DialogDescription>
            </div>
          </div>
        </div>

        <div className="p-2 md:p-5">
          <RejectRequestForm />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default RejectRequestDialog;
