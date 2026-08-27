import useGlobalContext from "@/context/useGlobalContext";
import type { TransferWorkflowResponse } from "@/schemas";
import { CardRow } from "../CardRow";
import { MobileImageModal } from "../MobileImageModal";
import axios from "axios";
import { useApproveRequest } from "@/hooks/useApproveRequest";
import {
  X,
  Check,
  MessageSquare,
  MapPin,
  User,
  Calendar,
  ArrowRight,
  // FileText,
  ImageOff,
  ChevronLeft,
} from "lucide-react";
import { toast } from "sonner";

// $ ─── Styles ───────────────────────────────────────────────────────────────────
import { sharedStyles } from "@/styles/shared";
import { cn } from "@/lib/utils";
import { Spinner } from "../../ui/spinner";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// $ ─── Types ────────────────────────────────────────────────────────────────────

type MobileTransferRequestApprovalProps = {
  item: TransferWorkflowResponse;
  // Index of the asset currently shown when a transfer bundles more than one item
  selectedAssetIndex: number;
  onSelectAsset: (index: number) => void;
};

// $ ─── Component ────────────────────────────────────────────────────────────────

export default function MobileTransferRequestApproval({
  item,
  selectedAssetIndex,
  onSelectAsset,
}: MobileTransferRequestApprovalProps) {
  const {
    selectedRowId,
    setShowRejectRequestDialogGeneric,
    setRejectConfig,
    setOpenChatSidebar,
    setIsOpen,
  } = useGlobalContext();

  const navigate = useNavigate();

  const assets = item?.assets ?? [];
  const currentAsset = assets[selectedAssetIndex] ?? assets[0];

  const hasImages = !!currentAsset?.images && currentAsset.images.length > 0;

  // Image State
  const [imageIndex, setImageIndex] = useState<number | null>(null);

  /* -------------------------------------------------------------------------- */
  /*                          Submit Data Hook                                  */
  /* -------------------------------------------------------------------------- */

  const { submit: approveRequest, isPending } = useApproveRequest({
    id: selectedRowId ?? "",
    resourcePath: "api/transfers",
    queryKey: ["transfers", "action: approve-item"],
    successMessage: `The Request for asset ${currentAsset?.assetID} was Successfully Approved!!!`,
    errorMessage: "Could not approve the asset transfer. Please try again.",
    redirectPath: "transfers/requests",
  });

  /* -------------------------------------------------------------------------- */
  /*                          Handle Approve                                    */
  /* -------------------------------------------------------------------------- */

  const handleApprove = async () => {
    try {
      await approveRequest({});
    } catch (error) {
      if (axios.isAxiosError<{ message: string }>(error)) {
        toast.error(error?.response?.data?.message);
      } else {
        toast.error("Failed to approve item");
      }
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                          Handle Reject                                     */
  /* -------------------------------------------------------------------------- */

  const handleReject = () => {
    setRejectConfig({
      title: "Reject Transfer",
      message: "Are you sure you want to reject this transfer?",
      resourcePath: "api/transfers",
      redirectPath: "transfers/requests",
      queryKey: ["transfers", "action: reject"],
      successMessage: "The Request was Successfully Rejected.",
      errorMessage: "Could not reject the asset transfer. Please try again.",
    });
    setShowRejectRequestDialogGeneric(true);
  };

  if (!currentAsset) {
    return null;
  }

  return (
    <div className={cn(sharedStyles.cardParent)}>
      {/* ── Sticky top bar ── */}
      <div className={cn(sharedStyles.cardTopBar)}>
        <button
          type="button"
          onClick={() => navigate("/transfers/requests")}
          className="flex items-center gap-1.5 text-sm text-red-400 dark:text-red-400/95 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
        <div className="flex-1 text-center">
          <p className="text-xs text-gray-400 dark:text-gray-500">Transfer</p>
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 font-mono">
            #{currentAsset.assetID}
          </p>
        </div>

        {/* Comments button */}
        <button
          type="button"
          onClick={() => {
            setIsOpen(false);
            setOpenChatSidebar(true);
          }}
          className="flex items-center gap-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
          <span className="hidden xs:inline">Comments</span>
        </button>
      </div>

      {/* ── Scrollable content ── */}
      <div className="flex-1 overflow-y-auto pb-32">
        {/* Asset selector — only shown when a transfer bundles more than one item */}
        {assets.length > 1 && (
          <div className={cn(sharedStyles.cardRowParent)}>
            <div className="flex gap-2 overflow-x-auto -mx-1 px-1 pb-1">
              {assets.map((asset, index) => (
                <button
                  key={asset.assetID}
                  type="button"
                  onClick={() => onSelectAsset(index)}
                  className={cn(
                    "shrink-0 rounded-md border p-1.5 text-[0.75rem] font-medium capitalize transition-colors",
                    index === selectedAssetIndex
                      ? "border-green-500 bg-green-400/10 text-green-400"
                      : "border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400",
                  )}
                >
                  {/* {asset.equipment} · {asset.assetID} */}
                  {`Asset ${index + 1} · ${asset.assetID}`}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Header card */}
        <div className={cn(sharedStyles.cardRowParent)}>
          <div className="">
            <div className="flex justify-between items-center min-w-0">
              <CardRow
                label="Equipment"
                valueStyles="hidden"
                className="py-1"
              />
              <CardRow label="Asset ID" valueStyles="hidden" className="py-1" />
            </div>
            <div className="flex justify-between items-center">
              <CardRow
                value={currentAsset.equipment}
                className="py-0"
                valueStyles="dark:text-gray-400"
              />
              <CardRow value={currentAsset.assetID} className="py-0" />
            </div>
          </div>
        </div>

        {/* Details card */}
        <div
          className={cn(
            sharedStyles.cardRowParent,
            "divide-y divide-gray-100 dark:divide-gray-700/60",
          )}
        >
          <CardRow
            icon={User}
            label="Requested by"
            value={item?.pending?.requestor_name || item?.pending?.requested_by}
          />
          <CardRow icon={MapPin} label="Area" value={currentAsset.area} />
          <CardRow
            icon={MapPin}
            label="From"
            value={item?.pending?.locationFrom}
          />
          <CardRow
            icon={ArrowRight}
            label="To"
            value={item?.pending?.locationTo}
          />
          <CardRow
            icon={Calendar}
            label="Expected date"
            value={item?.pending?.expectedDate}
          />
        </div>

        {/* Description card */}
        {/* {item?.pending?.description && (
          <div className={cn(sharedStyles.cardRowParent)}>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Description
              </p>
            </div>
            <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
              {item?.pending?.description}
            </p>
          </div>
        )} */}

        {/* Reason card */}
        {item?.pending?.transferReason && (
          <div className={cn(sharedStyles.cardRowParent)}>
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              <p className="text-xs text-gray-400 dark:text-gray-500">Reason</p>
            </div>
            <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
              {item?.pending?.transferReason}
            </p>
          </div>
        )}

        {imageIndex !== null && (
          <MobileImageModal
            images={currentAsset?.images ?? []}
            initialIndex={imageIndex}
            onClose={() => setImageIndex(null)}
          />
        )}

        {/* Images */}
        <div className={cn(sharedStyles.cardRowParent)}>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
            Attached photos {hasImages ? `(${currentAsset.images.length})` : ""}
          </p>
          {hasImages ? (
            <div className="grid grid-cols-2 gap-2">
              {currentAsset.images.map((image, i) => (
                <button
                  aria-label="image button to open images"
                  type="button"
                  key={i}
                  onClick={() => setImageIndex(i)}
                  className="aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 active:scale-95 transition-transform"
                >
                  <img
                    src={image.url}
                    alt={`Transfer photo ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 gap-2">
              <ImageOff className="w-8 h-8 text-gray-300 dark:text-gray-600" />
              <p className="text-xs text-gray-400 dark:text-gray-500">
                No photos attached
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Sticky action bar ── */}
      <div className="fixed bottom-0 left-0 right-0 z-10 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700/60 px-4 pt-3 pb-6 safe-area-inset-bottom">
        <div className={cn(sharedStyles.btnParent)}>
          <button
            type="button"
            onClick={handleReject}
            className={cn(
              sharedStyles.btnCancel,
              sharedStyles.btn,
              "text-sm uppercase flex gap-6 justify-center items-center",
            )}
          >
            <X className="w-6 h-6" />
            Reject
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={handleApprove}
            className={cn(
              sharedStyles.btnApprove,
              sharedStyles.btn,
              "text-sm uppercase flex gap-6 justify-center items-center",
            )}
          >
            {isPending ? (
              <Spinner className="size-6" />
            ) : (
              <Check className="w-6 h-6" />
            )}
            Approve
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                       OLD MOBILE VIEW - SINGLE ASSET                       */
/* -------------------------------------------------------------------------- */

// import useGlobalContext from "@/context/useGlobalContext";
// import type { TransferWorkflowResponse } from "@/schemas";
// import { CardRow } from "../CardRow";
// import { MobileImageModal } from "../MobileImageModal";
// import axios from "axios";
// import { useApproveRequest } from "@/hooks/useApproveRequest";
// import {
//   X,
//   Check,
//   MessageSquare,
//   MapPin,
//   User,
//   Calendar,
//   ArrowRight,
//   FileText,
//   // ChevronLeft,
//   ImageOff,
// } from "lucide-react";
// // import { useNavigate } from "react-router-dom";
// import { toast } from "sonner";

// // $ ─── Styles ───────────────────────────────────────────────────────────────────
// import { sharedStyles } from "@/styles/shared";
// import { cn } from "@/lib/utils";
// import { Spinner } from "../../ui/spinner";
// import { useState } from "react";

// // import { Separator } from "@/components/ui/separator";

// // $ ─── Types ────────────────────────────────────────────────────────────────────

// type MobileTransferRequestApprovalProps = {
//   item: TransferWorkflowResponse;
// };

// // $ ─── Component ────────────────────────────────────────────────────────────────

// export default function MobileTransferRequestApproval({
//   item,
// }: MobileTransferRequestApprovalProps) {
//   const {
//     selectedRowId,
//     setShowRejectRequestDialogGeneric,
//     setRejectConfig,
//     setOpenChatSidebar,
//     setIsOpen,
//   } = useGlobalContext();

//   const hasImages = item?.pending?.images && item?.pending?.images.length > 0;
//   // const navigate = useNavigate();

//   console.log("mobileItem:", item);

//   // Image State
//   const [imageIndex, setImageIndex] = useState<number | null>(null);

//   /* -------------------------------------------------------------------------- */
//   /*                          Submit Data Hook                                  */
//   /* -------------------------------------------------------------------------- */

//   const { submit: approveRequest, isPending } = useApproveRequest({
//     id: selectedRowId ?? "",
//     resourcePath: "api/transfers",
//     queryKey: ["transfers", "action: approve-item"],
//     successMessage: `The Request for asset ${item?.assetID} was Successfully Approved!!!`,
//     errorMessage: "Could not approve the asset transfer. Please try again.",
//     redirectPath: "transfers/requests",
//   });

//   /* -------------------------------------------------------------------------- */
//   /*                          Handle Approve                                    */
//   /* -------------------------------------------------------------------------- */

//   const handleApprove = async () => {
//     try {
//       await approveRequest({});
//     } catch (error) {
//       if (axios.isAxiosError<{ message: string }>(error)) {
//         toast.error(error?.response?.data?.message);
//       } else {
//         toast.error("Failed to approve item");
//       }
//     }
//   };

//   /* -------------------------------------------------------------------------- */
//   /*                          Handle Reject                                     */
//   /* -------------------------------------------------------------------------- */

//   const handleReject = () => {
//     setRejectConfig({
//       title: "Reject Transfer",
//       message: "Are you sure you want to reject this transfer?",
//       resourcePath: "api/transfers",
//       redirectPath: "transfers/requests",
//       queryKey: ["transfers", "action: reject"],
//       successMessage: "The Request was Successfully Rejected.",
//       errorMessage: "Could not reject the asset transfer. Please try again.",
//     });
//     setShowRejectRequestDialogGeneric(true);
//   };

//   return (
//     <div className={cn(sharedStyles.cardParent)}>
//       {/* ── Sticky top bar ── */}
//       <div className={cn(sharedStyles.cardTopBar)}>
//         {/* <button
//           type="button"
//           onClick={() => navigate("/transfers/requests")}
//           className="flex items-center gap-1.5 text-sm text-red-400 dark:text-red-400/95 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
//         >
//           <ChevronLeft className="w-4 h-4" />
//           Back
//         </button> */}

//         <div className="flex-1 text-center">
//           <p className="text-xs text-gray-400 dark:text-gray-500">Transfer</p>
//           <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 font-mono">
//             #{item?.assetID}
//           </p>
//         </div>

//         {/* Comments button */}
//         <button
//           type="button"
//           onClick={() => {
//             setIsOpen(false);
//             setOpenChatSidebar(true);
//           }}
//           className="flex items-center gap-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
//         >
//           <MessageSquare className="w-4 h-4" />
//           <span className="hidden xs:inline">Comments</span>
//         </button>
//       </div>

//       {/* ── Scrollable content ── */}
//       <div className="flex-1 overflow-y-auto pb-32">
//         {/* Header card */}
//         <div className={cn(sharedStyles.cardRowParent)}>
//           <div className="">
//             <div className="flex justify-between items-center min-w-0">
//               <CardRow
//                 label="Equipment"
//                 valueStyles="hidden"
//                 className="py-1"
//               />
//               <CardRow label="Asset ID" valueStyles="hidden" className="py-1" />
//             </div>
//             <div className="flex justify-between items-center">
//               <CardRow
//                 value={item?.pending?.assets[0]?.equipment}
//                 className="py-0"
//                 valueStyles="dark:text-gray-400"
//               />
//               <CardRow value={item?.assetID} className="py-0" />
//             </div>
//           </div>
//         </div>

//         {/* Details card */}
//         <div
//           className={cn(
//             sharedStyles.cardRowParent,
//             "divide-y divide-gray-100 dark:divide-gray-700/60",
//           )}
//         >
//           <CardRow
//             icon={User}
//             label="Requested by"
//             value={item?.pending?.requestor_name || item?.pending?.requested_by}
//           />
//           <CardRow
//             icon={MapPin}
//             label="From"
//             value={item?.pending?.locationFrom}
//           />
//           <CardRow
//             icon={ArrowRight}
//             label="To"
//             value={item?.pending?.locationTo}
//           />
//           <CardRow
//             icon={Calendar}
//             label="Expected date"
//             value={item?.pending?.expectedDate}
//           />
//         </div>

//         {/* Description card */}
//         {item?.pending?.description && (
//           <div className={cn(sharedStyles.cardRowParent)}>
//             <div className="flex items-center gap-2 mb-2">
//               <FileText className="w-4 h-4 text-gray-400 dark:text-gray-500" />
//               <p className="text-xs text-gray-400 dark:text-gray-500">
//                 Description
//               </p>
//             </div>
//             <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
//               {item?.pending?.description}
//             </p>
//           </div>
//         )}

//         {/* Reason card */}
//         {item?.pending?.transferReason && (
//           <div className={cn(sharedStyles.cardRowParent)}>
//             <div className="flex items-center gap-2 mb-2">
//               <MessageSquare className="w-4 h-4 text-gray-400 dark:text-gray-500" />
//               <p className="text-xs text-gray-400 dark:text-gray-500">Reason</p>
//             </div>
//             <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
//               {item?.pending?.transferReason}
//             </p>
//           </div>
//         )}

//         {imageIndex !== null && (
//           <MobileImageModal
//             images={item?.pending?.images ?? []}
//             initialIndex={imageIndex}
//             onClose={() => setImageIndex(null)}
//           />
//         )}

//         {/* Images */}
//         <div className={cn(sharedStyles.cardRowParent)}>
//           <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
//             Attached photos{" "}
//             {hasImages ? `(${item?.pending?.images?.length})` : ""}
//           </p>
//           {hasImages ? (
//             <div className="grid grid-cols-2 gap-2">
//               {item?.pending?.images?.map((image, i) => (
//                 <button
//                   aria-label="image button to open images"
//                   type="button"
//                   key={i}
//                   onClick={() => setImageIndex(i)}
//                   className="aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 active:scale-95 transition-transform"
//                 >
//                   <img
//                     src={image.url}
//                     alt={`Transfer photo ${i + 1}`}
//                     className="w-full h-full object-cover"
//                   />
//                 </button>
//               ))}
//             </div>
//           ) : (
//             <div className="flex flex-col items-center justify-center py-8 gap-2">
//               <ImageOff className="w-8 h-8 text-gray-300 dark:text-gray-600" />
//               <p className="text-xs text-gray-400 dark:text-gray-500">
//                 No photos attached
//               </p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ── Sticky action bar ── */}
//       <div className="fixed bottom-0 left-0 right-0 z-10 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700/60 px-4 pt-3 pb-6 safe-area-inset-bottom">
//         <div className={cn(sharedStyles.btnParent)}>
//           <button
//             type="button"
//             onClick={handleReject}
//             className={cn(
//               sharedStyles.btnCancel,
//               sharedStyles.btn,
//               "text-sm uppercase flex gap-6 justify-center items-center",
//             )}
//           >
//             <X className="w-6 h-6" />
//             Reject
//           </button>
//           <button
//             type="button"
//             disabled={isPending}
//             onClick={handleApprove}
//             className={cn(
//               sharedStyles.btnApprove,
//               sharedStyles.btn,
//               "text-sm uppercase flex gap-6 justify-center items-center",
//             )}
//           >
//             {isPending ? (
//               <Spinner className="size-6" />
//             ) : (
//               <Check className="w-6 h-6" />
//             )}
//             Approve
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
