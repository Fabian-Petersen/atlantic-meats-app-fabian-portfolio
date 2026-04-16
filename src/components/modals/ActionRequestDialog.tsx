// $ This component renders the action request dialog, which is used to update and closeout a maintenance job. It uses the MaintenanceUpdateForm component to render the form inside the dialog.

import {
  Dialog,
  DialogTitle,
  // DialogClose,
  DialogContent,
  // DialogFooter,
} from "@/components/ui/dialog";

import MaintenanceActionForm from "../jobs/JobActionForm";
// import { useGetJobDetails } from "@/customHooks/useGetJobDetails";

import useGlobalContext from "@/context/useGlobalContext";
import FormHeading from "../../../customComponents/FormHeading";
import { useById } from "@/utils/api";
import type { JobAPIResponse } from "@/schemas";
import { cn } from "@/lib/utils";
import { sharedStyles } from "@/styles/shared";

function ActionRequestDialog() {
  const { showActionDialog, setShowActionDialog, selectedRowId } =
    useGlobalContext();

  const { data: job } = useById<JobAPIResponse>({
    id: selectedRowId!,
    resourcePath: "jobs/pending",
    queryKey: ["MaintenanceRequests"],
  });

  return (
    <Dialog open={showActionDialog} onOpenChange={setShowActionDialog}>
      <DialogContent className={cn(sharedStyles.modalLarge)}>
        <DialogTitle>
          <FormHeading
            arial-label="create new user modal"
            className={cn(
              sharedStyles.headingForm,
              "md:text-center font-normal",
            )}
            heading="Action Job Request"
          />
          <div className="flex gap-2 justify-center">
            <span className="text-xs font-medium">
              {`Job Number: ${job?.jobcardNumber}`}
            </span>
            <span className="text-xs font-medium"> Requested By: Fabian</span>
          </div>
        </DialogTitle>
        <div className="overflow-y-auto custom-scrollbar pr-2">
          <MaintenanceActionForm onCancel={() => setShowActionDialog(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ActionRequestDialog;
