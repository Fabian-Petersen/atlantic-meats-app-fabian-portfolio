// $ This component renders the action request dialog, which is used to update and closeout a maintenance job. It uses the MaintenanceUpdateForm component to render the form inside the dialog.

import {
  Dialog,
  DialogTitle,
  // DialogClose,
  DialogContent,
  // DialogFooter,
} from "@/components/ui/dialog";

import MaintenanceActionForm from "../maintenance/MaintenanceActionForm";
// import { useGetJobDetails } from "@/customHooks/useGetJobDetails";

import useGlobalContext from "@/context/useGlobalContext";
import FormHeading from "../../../customComponents/FormHeading";
import { useById } from "@/utils/api";
import type { JobAPIResponse } from "@/schemas";

function ActionRequestDialog() {
  const { showActionDialog, setShowActionDialog, selectedRowId } =
    useGlobalContext();

  const { data: job } = useById<JobAPIResponse>({
    id: selectedRowId!,
    resourcePath: "maintenance-request",
    queryKey: ["Maintenance-Request-Item"],
  });

  return (
    <Dialog open={showActionDialog} onOpenChange={setShowActionDialog}>
      <DialogContent className="sm:max-w-[625px] bg-white z-3000 border-none max-h-[90vh] flex flex-col">
        <DialogTitle className="flex flex-col gap-4 py-4 shrink-0">
          <FormHeading
            className="font-normal"
            heading="Action Maintenance Request"
          />
          <div>
            <span className="text-xs font-medium flex gap-2 flex-col">
              {`Job Number: ${job?.jobcardNumber}`}
            </span>
            <span className="text-xs font-medium"> Requested By: Fabian</span>
          </div>
        </DialogTitle>
        <div className="overflow-y-auto flex-1 no-scrollbar">
          <MaintenanceActionForm onCancel={() => setShowActionDialog(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ActionRequestDialog;
