import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { motionVariants } from "@/styles/motionStyles";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";
import { CheckCircle2, ChevronDown } from "lucide-react";
import DynamicForm, {
  type DynamicFormField,
} from "@/components/forms/DynamicForm";
import FormSkeleton from "@/components/forms/FormSkeleton";
import FormRowInput from "../../../customComponents/FormRowInput";
import FileInput from "../../../customComponents/FileInput";
import useGlobalContext from "@/context/useGlobalContext";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import { useById } from "@/utils/api";
import {
  disposalCompletionSchema,
  type DisposalCompletionFormValues,
  type DisposalCompletionPayload,
  type DisposalWorkflowResponse,
} from "@/schemas/disposalsSchemas";

const completionSchema = disposalCompletionSchema.extend({
  disposalMethod: disposalCompletionSchema.shape.disposalMethod.trim().min(1, {
    message: "Please provide a disposal method",
  }),
});

const CreateDisposalCompletedForm = () => {
  const [requestOpen, setRequestOpen] = useState(false);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setSuccessConfig, setShowSuccess, setErrorConfig, setShowError } =
    useGlobalContext();
  const {
    data: disposal,
    isPending: isLoading,
    isError,
    refetch,
  } = useById<DisposalWorkflowResponse>({
    id: id ?? "",
    resourcePath: "api/disposals",
    queryKey: ["disposal", "status: all"],
  });

  const form = useForm<DisposalCompletionFormValues>({
    resolver: zodResolver(
      completionSchema,
    ) as Resolver<DisposalCompletionFormValues>,
    defaultValues: {
      disposalMethod: "",
      // disposalLocation: "",
      disposalCost: null,
      disposalNotes: "",
      disposalImages: [],
      disposalDocuments: [],
    },
  });

  const { submit, isPending } = useFormSubmit<
    DisposalCompletionFormValues,
    DisposalCompletionPayload
  >({
    resourcePath: `api/disposals/${encodeURIComponent(id ?? "")}/completed`,
    queryKey: ["disposals"],
    extractFiles: (values) => ({
      images: values.disposalImages,
      invoices: values.disposalDocuments,
    }),
    buildPayload: (values, images, documents) => ({
      disposalMethod: values.disposalMethod.trim(),
      disposalLocation: values.disposalLocation?.trim() || null,
      disposalCost: values.disposalCost,
      disposalNotes: values.disposalNotes?.trim() || null,
      disposalImages: images.map((file) => ({
        filename: file.name,
        content_type: file.type,
      })),
      disposalDocuments: documents.map((file) => ({
        filename: file.name,
        content_type: file.type,
      })),
    }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["disposal"] });
      setSuccessConfig({
        title: "Disposal completed",
        message: `Disposal of ${disposal?.assets.length ?? 0} asset(s) was successfully recorded.`,
        redirectPath: "disposals/requests",
      });
      setShowSuccess(true);
    },
    onError: () => {
      setErrorConfig({
        title: "Disposal completion failed",
        message:
          "Could not complete the disposal or upload its attachments. Check the disposal status before trying again.",
      });
      setShowError(true);
      void queryClient.invalidateQueries({ queryKey: ["disposal"] });
    },
  });

  const fields: DynamicFormField<DisposalCompletionFormValues>[] = [
    {
      fieldType: "controller",
      name: "disposalMethod",
      render: ({ field, fieldState }) => (
        <FormRowInput
          name="disposalMethod"
          control={form.control}
          label="Disposal method"
          type="text"
          required
          register={(name) => ({
            name,
            ref: field.ref,
            onBlur: async () => field.onBlur(),
            onChange: async (event) => field.onChange(event.target.value),
          })}
          error={fieldState.error}
        />
      ),
    },
    {
      fieldType: "controller",
      name: "disposalCost",
      render: ({ field, fieldState }) => (
        <FormRowInput
          name="disposalCost"
          control={form.control}
          label="Disposal Cost (R)"
          type="number"
          min={0}
          step="0.01"
          register={(name) => ({
            name,
            ref: field.ref,
            onBlur: async () => field.onBlur(),
            onChange: async (event) =>
              field.onChange(
                event.target.value === "" ? null : event.target.valueAsNumber,
              ),
          })}
          error={fieldState.error}
        />
      ),
    },
    {
      fieldType: "textarea",
      name: "disposalNotes",
      label: "Disposal notes",
      rows: 3,
      className: "col-span-full",
    },
    {
      fieldType: "file",
      name: "disposalImages",
      label: "Disposal photos",
      multiple: true,
      className: "col-span-full",
      placeholder: "",
    },
    {
      fieldType: "controller",
      name: "disposalDocuments",
      render: ({ fieldState }) => (
        <FileInput
          name="disposalDocuments"
          control={form.control}
          label="Supporting documents"
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.csv,.txt"
          multiple
          className="col-span-full"
          error={fieldState.error}
          placeholder=""
        />
      ),
    },
  ];

  if (!id) return <p role="alert">No disposal was selected.</p>;
  if (isLoading) return <FormSkeleton />;
  if (isError)
    return (
      <div role="alert">
        <p>Could not load the disposal request.</p>
        <button
          type="button"
          onClick={() => void refetch()}
          className="text-blue-500"
        >
          Try again
        </button>
      </div>
    );
  if (!disposal) return <p role="alert">Disposal request not found.</p>;
  if (disposal.status !== "approved")
    return (
      <div className="space-y-3" role="status">
        <p>
          Only approved requests can be completed. This disposal is{" "}
          {disposal.status}.
        </p>
        <button
          type="button"
          onClick={() => navigate("/disposals/requests")}
          className="text-blue-500"
        >
          Back to disposals
        </button>
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-gray-50/60 text-gray-700 dark:border-gray-700 dark:bg-gray-800/30 dark:text-gray-200">
        <button
          type="button"
          aria-expanded={requestOpen}
          aria-controls="disposal-request-details"
          onClick={() => setRequestOpen((open) => !open)}
          className="flex w-full cursor-pointer items-center gap-3 rounded-lg p-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
        >
          <CheckCircle2
            className="size-5 shrink-0 text-emerald-600 dark:text-emerald-400"
            aria-hidden="true"
          />
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-medium">
              {disposal.assets.length}{" "}
              {disposal.assets.length === 1 ? "asset" : "assets"} approved for
              disposal
            </span>
            <span className="mt-0.5 block text-xs capitalize text-gray-500 dark:text-gray-400">
              {disposal.pending.location} ·{" "}
              {disposal.pending.disposalReason.replaceAll("-", " ")}
            </span>
          </span>
          <span className="hidden text-xs text-gray-500 sm:inline dark:text-gray-400">
            Request details
          </span>
          <ChevronDown
            className={`size-4 shrink-0 text-gray-400 transition-transform ${requestOpen ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        </button>
        <AnimatePresence initial={false}>
          {requestOpen && (
            <motion.div
              key="request-details"
              id="disposal-request-details"
              variants={motionVariants.expandable}
              initial="closed"
              animate="open"
              exit="closed"
              className="overflow-hidden"
            >
              <div className="space-y-3 border-t border-gray-200 px-4 py-3 dark:border-gray-700">
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {disposal.assets.map((asset, index) => (
                    <li
                      key={asset.assetIndex ?? index}
                      className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-2 text-sm"
                    >
                      <span className="capitalize">{asset.equipment}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {asset.assetID || "Unidentified asset"}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Completion applies to all assets in this request.
                </p>
                <p className="break-all text-xs text-gray-400 dark:text-gray-500">
                  Request ID: {disposal.id}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <fieldset
        disabled={isPending || form.formState.isSubmitting}
        className="min-w-0"
      >
        <DynamicForm<DisposalCompletionFormValues>
          form={form}
          formId="disposal-completion-form"
          fields={fields}
          formHeading="Complete disposal"
          redirect
          redirectTo="/disposals/requests"
          onSubmit={async (values) => {
            if (id && disposal.status === "approved") await submit(values);
          }}
          isPending={isPending || form.formState.isSubmitting}
          submitText="Complete disposal"
          cancelText="Cancel"
          onCancel={() => navigate("/disposals/requests")}
          gridClassName="gap-6"
        />
      </fieldset>
    </div>
  );
};

export default CreateDisposalCompletedForm;
