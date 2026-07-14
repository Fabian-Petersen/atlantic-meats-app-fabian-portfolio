/* -------------------------------------------------------------------------- */
/*                             Native HTML Dialog                             */
/* -------------------------------------------------------------------------- */

import { useEffect, useRef } from "react";
import { OctagonX } from "lucide-react";

import useGlobalContext from "@/context/useGlobalContext";
import FormHeading from "../../../customComponents/FormHeading";
import { cn } from "@/lib/utils";
import { sharedStyles } from "@/styles/shared";
import type { RejectConfig } from "@/context/app-types";
import RejectRequestFormGeneric from "../modal_request_actions/RejectRequestFormGeneric";

// Partial: only title/message/redirectPath have sensible fallbacks.
// resourcePath/queryKey/successMessage/errorMessage/payloadKey are
// per-domain and MUST be supplied by the caller via setRejectConfig
// before opening the dialog — there's no safe generic default for them.
const defaultRejectConfig: Partial<RejectConfig> = {
  title: "Reject Request",
  message:
    "Are you sure you want to reject this item? This action cannot be undone.",
  redirectPath: "dashboard",
};

function RejectRequestDialogGeneric() {
  const {
    showRejectRequestDialogGeneric,
    setShowRejectRequestDialogGeneric,
    rejectConfig,
  } = useGlobalContext();

  const dialogRef = useRef<HTMLDialogElement>(null);

  // Sync React state -> native dialog open/close.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (showRejectRequestDialogGeneric && !dialog.open) {
      dialog.showModal();
    } else if (!showRejectRequestDialogGeneric && dialog.open) {
      dialog.close();
    }
  }, [showRejectRequestDialogGeneric]);

  // Native dialog -> React state, for Esc key and any other native close
  // (form method="dialog", dialog.close() calls elsewhere, etc).
  const handleNativeClose = () => setShowRejectRequestDialogGeneric(false);

  // Native <dialog> has no built-in "click outside to close" — clicking the
  // backdrop actually fires a click on the <dialog> element itself, since
  // the backdrop isn't a separate hit-testable box. Detect that here.
  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      setShowRejectRequestDialogGeneric(false);
    }
  };

  const { title, message } = {
    ...defaultRejectConfig,
    ...rejectConfig,
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={handleNativeClose}
      onClick={handleBackdropClick}
      aria-labelledby="reject-dialog-title"
      aria-describedby="reject-dialog-message"
      className={cn("app-dialog", sharedStyles.modal)}
    >
      {/* stopPropagation so clicks inside the content don't bubble up
          to the backdrop-click handler above */}
      <div
        className={cn(sharedStyles.modalParent)}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center items-center">
          <div className="rounded-full p-4 text-red-500 bg-red-500/20">
            <OctagonX className="size-12 md:size-16" />
          </div>
        </div>
        <div id="reject-dialog-title" className="md:mx-auto">
          <FormHeading
            heading={title}
            className={cn(
              sharedStyles.headingForm,
              "md:text-center font-normal",
            )}
          />
        </div>
        <p
          id="reject-dialog-message"
          className="text-cxs md:text-xs text-gray-600 dark:text-gray-300 text-center w-3/4 mx-auto"
        >
          {message}
        </p>
        <RejectRequestFormGeneric />
      </div>
    </dialog>
  );
}

export default RejectRequestDialogGeneric;

/* -------------------------------------------------------------------------- */
/*                             Diaglog from ShadCN                            */
/* -------------------------------------------------------------------------- */

// import { Dialog, DialogTitle, DialogContent } from "@/components/ui/dialog";
// import { DialogDescription } from "@radix-ui/react-dialog";
// import { OctagonX } from "lucide-react";

// import useGlobalContext from "@/context/useGlobalContext";
// import FormHeading from "../../../customComponents/FormHeading";
// import { cn } from "@/lib/utils";
// import { sharedStyles } from "@/styles/shared";
// import type { RejectConfig } from "@/context/app-types";
// import RejectRequestFormGeneric from "../modal_request_actions/RejectRequestFormGeneric";

// // Partial: only title/message/redirectPath have sensible fallbacks.
// // resourcePath/queryKey/successMessage/errorMessage/payloadKey are
// // per-domain and MUST be supplied by the caller via setRejectConfig
// // before opening the dialog — there's no safe generic default for them.
// const defaultRejectConfig: Partial<RejectConfig> = {
//   title: "Reject Request",
//   message:
//     "Are you sure you want to reject this item? This action cannot be undone.",
//   redirectPath: "dashboard",
// };

// function RejectRequestDialogGeneric() {
//   const { showRejectRequestDialogGeneric, setShowRejectRequestDialogGeneric, rejectConfig } =
//     useGlobalContext();

//   const { title, message } = {
//     ...defaultRejectConfig,
//     ...rejectConfig,
//   };

//   return (
//     <Dialog
//       open={showRejectRequestDialogGeneric}
//       onOpenChange={setShowRejectRequestDialogGeneric}
//     >
//       <DialogContent className={cn(sharedStyles.modal)}>
//         <div className={cn(sharedStyles.modalParent)}>
//           <div className="flex justify-center items-center">
//             <div className="rounded-full p-4 text-red-500 bg-red-500/20">
//               <OctagonX className="size-12 md:size-16" />
//             </div>
//           </div>
//           <DialogTitle className="md:mx-auto">
//             <FormHeading
//               heading={title}
//               className={cn(
//                 sharedStyles.headingForm,
//                 "md:text-center font-normal",
//               )}
//             />
//           </DialogTitle>
//           <DialogDescription>
//             <p className="text-cxs md:text-xs text-gray-600 dark:text-gray-300 text-center w-3/4 mx-auto">
//               {message}
//             </p>
//           </DialogDescription>
//           <RejectRequestFormGeneric />
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

// export default RejectRequestDialogGeneric;
