import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useForm, useWatch, type FieldError } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import FormInfo from "@/components/features/forms/FormInfo";
import TextAreaInput from "../../../customComponents/TextAreaInput";
import FormRowSelect from "../../../customComponents/FormRowSelect";
import FileInput from "../../../customComponents/FileInput";
import FormHeading from "../../../customComponents/FormHeading";
import FormActionButtons from "@/components/features/FormActionButtons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import useGlobalContext from "@/context/useGlobalContext";
import { useModalState } from "@/context/useModalState";
import {
  manualAssetVerificationSchema,
  type ManualAssetVerificationPayload,
  type ManualAssetVerificationRequest,
} from "@/schemas/assetSchemas";
import { useFormSubmit, type FormSubmitStage } from "@/hooks/useFormSubmit";
import { location } from "@/data/assetSelectOptions";

const getManualVerificationError = (
  error: unknown,
  stage?: FormSubmitStage,
) => {
  if (stage === "image-processing") {
    return "The selected image could not be processed on this device. Try a different image or camera format.";
  }

  if (stage === "api-request") {
    const status = axios.isAxiosError(error)
      ? error.response?.status
      : undefined;

    return status
      ? `The verification API request failed with HTTP ${status}.`
      : "The verification API request could not reach the server.";
  }

  if (stage === "file-upload") {
    const detail = error instanceof Error ? ` ${error.message}` : "";
    return `The verification was accepted, but the evidence image upload failed.${detail}`;
  }

  if (stage === "success-handler") {
    return "The verification completed, but the page could not refresh correctly.";
  }

  return "The verification failed for an unknown reason.";
};

const ManualVerificationDialog = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setShowManualVerificationDialog } = useGlobalContext();
  const { selectedRowId, showManualVerificationDialog } = useModalState();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ManualAssetVerificationRequest>({
    defaultValues: {
      id: selectedRowId ?? "",
      location: "",
      reason: "",
      images: [],
    },
    resolver: zodResolver(manualAssetVerificationSchema),
  });

  const images = useWatch({ control, name: "images" });

  const {
    submit: verifyManually,
    isPending,
    submissionProgress,
  } = useFormSubmit<
    ManualAssetVerificationRequest,
    ManualAssetVerificationPayload
  >({
    resourcePath: `api/assets/${selectedRowId ?? ""}/verify-manual`,
    queryKey: ["assets", "list"],
    buildPayload: (values, compressedImages) => ({
      id: selectedRowId ?? values.id,
      location: values.location,
      reason: values.reason,
      images: compressedImages.map((file) => ({
        filename: file.name,
        content_type: file.type,
      })),
    }),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["assets", "list"],
        exact: true,
      });
      toast.success("Asset manually verified", { duration: 1500 });
      closeDialog();
    },
    onError: (error, _data, stage) => {
      toast.error("Failed to verify asset manually", {
        description: getManualVerificationError(error, stage),
        duration: 6000,
      });
    },
  });

  const closeDialog = () => {
    setShowManualVerificationDialog(false);
    reset();
    navigate("/assets/list");
  };

  if (!selectedRowId) return null;

  const sortedLocations = [...location].sort((a, b) => a.localeCompare(b));

  const progressMessage = (() => {
    if (!submissionProgress) return null;

    switch (submissionProgress.stage) {
      case "image-processing":
        return submissionProgress.imageCount === 1
          ? "Compressing verification image..."
          : `Compressing ${submissionProgress.imageCount} verification images one at a time...`;
      case "api-request":
        return "Saving verification details...";
      case "file-upload":
        return "Uploading verification images...";
      case "success-handler":
        return "Finishing verification...";
    }
  })();

  return (
    <Dialog
      open={showManualVerificationDialog}
      onOpenChange={(open) => {
        if (!open && !isPending) closeDialog();
      }}
    >
      <DialogContent className="top-auto bottom-0 left-0 max-h-[92dvh] max-w-none translate-x-0 translate-y-0 overflow-y-auto rounded-t-3xl rounded-b-none border-none bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))] data-[state=open]:slide-in-from-bottom-full dark:bg-(--bg-secondary_dark) dark:text-(--clr-textDark) dark:border-(--clr-borderDark) z-3000 sm:top-[50%] sm:bottom-auto sm:left-[50%] sm:max-w-156 sm:translate-x-[-50%] sm:translate-y-[-50%] sm:rounded-lg sm:p-6 sm:data-[state=open]:[--tw-enter-translate-y:0]">
        {progressMessage && (
          <div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-5 bg-white/95 px-8 text-center dark:bg-(--bg-secondary_dark)/95 sm:absolute sm:rounded-lg"
            role="status"
            aria-live="polite"
            aria-label={progressMessage}
          >
            <Spinner className="size-12 text-green-600 dark:text-green-400" />
            <div>
              <p className="text-lg font-medium">Verifying asset</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                {progressMessage}
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Keep this screen open until the upload is complete.
              </p>
            </div>
          </div>
        )}
        <div className="flex justify-center items-center">
          <div className="rounded-full bg-green-100 p-3 text-green-600 dark:bg-green-950/50 dark:text-green-400 md:p-4">
            <ShieldCheck className="size-9 md:size-16" aria-hidden="true" />
          </div>
        </div>
        <DialogTitle className="pt-2 md:py-4">
          <FormHeading
            arial-label="manual asset verification modal"
            headingStyles="justify-center"
            className="font-normal"
            heading="Manual Verification"
          />
        </DialogTitle>
        <DialogDescription className="-mt-2 text-center text-xs leading-5 md:text-sm">
          Confirm the asset's current location and add photographic evidence.
        </DialogDescription>
        <form
          id="manual-verification-form"
          className="flex flex-col rounded-lg w-full text-(--clr-font) dark:bg-(--bg-secondary_dark)"
          onSubmit={handleSubmit(verifyManually)}
        >
          <div className="grid gap-4 md:gap-5">
            <FormRowSelect
              name="location"
              label="Current Location"
              options={sortedLocations}
              register={register}
              error={errors.location}
              disabled={isPending}
              required
            />
            <TextAreaInput
              name="reason"
              label="Reason for manual verification"
              // placeholder="Enter reason for manual verification"
              register={register}
              error={errors.reason}
              disabled={isPending}
              required
            />
            {images.length === 0 && (
              <FormInfo message="Add at least one clear image as evidence of the asset's identity and condition when its barcode cannot be scanned." />
            )}
            <FileInput
              name="images"
              control={control}
              label="Verification Images"
              error={errors.images as FieldError | undefined}
              disabled={isPending}
              required
              multiple
              className={`${images.length === 0 && "mt-3"}`}
            />
          </div>
          <FormActionButtons
            formId="manual-verification-form"
            cancelText="Cancel"
            submitText="Verify Asset"
            isPending={isPending}
            onCancel={closeDialog}
            showCancelOnMobile
            className="sticky bottom-0 z-10 mt-2 bg-white py-3 dark:bg-(--bg-secondary_dark) md:static md:bg-transparent md:py-0 dark:md:bg-transparent"
          />
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ManualVerificationDialog;
