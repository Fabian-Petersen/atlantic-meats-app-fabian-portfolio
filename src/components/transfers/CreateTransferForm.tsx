// //$ This component is used to create a maintenace job, the data is submitted to the database (dynamoDB) via API Gateway and Lambda on aws.

import { useNavigate } from "react-router-dom";
import { useState } from "react";

// $ React-Hook-Form, zod & schema
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useFieldArray,
  useForm,
  useWatch,
  type Resolver,
} from "react-hook-form";
import { Info } from "lucide-react";

// $ Import schemas
import type { TransferRequestFormValues } from "../../schemas/index";
import { transferRequestSchema } from "../../schemas/index";

import { useFormSubmit } from "@/hooks/useFormSubmit";
import useGlobalContext from "@/context/useGlobalContext";
import DynamicForm, { DynamicFormActions } from "../forms/DynamicForm";
import TransferAssetFields from "./TransferAssetFields";
import { useAssetFilters } from "@/customHooks/useAssetFilters";
import type { TransferRequestPayload } from "@/schemas/transfersSchemas";

const CreateTransferForm = () => {
  const navigate = useNavigate();

  const [openAssetIndex, setOpenAssetIndex] = useState(0);

  const { setSuccessConfig, setShowSuccess, setErrorConfig, setShowError } =
    useGlobalContext();

  // ---------------------------------------------------------------------------
  // Form
  // ---------------------------------------------------------------------------

  const form = useForm<TransferRequestFormValues>({
    resolver: zodResolver(
      transferRequestSchema,
    ) as unknown as Resolver<TransferRequestFormValues>,

    defaultValues: {
      locationFrom: "",
      locationTo: "",
      expectedDate: "",
      transferReason: "",
      transportInvoices: [],

      assets: [
        {
          area: "",
          equipment: "",
          assetID: "",
          images: [],
          assetIssueReason: "",
          assetIssueDetails: "",
        },
      ],
    },
  });

  const locationFrom = useWatch({
    control: form.control,
    name: "locationFrom",
  });

  // ---------------------------------------------------------------------------
  // Dynamic asset rows
  // ---------------------------------------------------------------------------

  const {
    fields: assetFields,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "assets",
  });

  const { locationOptions } = useAssetFilters({
    form,
    locationField: "locationFrom",
  });

  // [TODO] make a util function to normalise this helper function
  const normalizeOptions = (
    options:
      | Array<string>
      | Array<{ label: string; value: string }>
      | undefined
      | null,
  ): string[] => {
    if (!options) return []; // ✅ guard against undefined/null from async data
    return options.map((option) =>
      typeof option === "string" ? option : option.value,
    );
  };

  // ---------------------------------------------------------------------------
  // Transfer fields
  // ---------------------------------------------------------------------------

  /*
   * These are the fields belonging to the overall transfer request.
   *
   * Asset-specific fields are generated separately for each asset index.
   */

  const transferFields = [
    {
      fieldType: "textarea" as const,
      name: "transferReason" as const,
      required: true,
      rows: 1,
      className: "md:col-span-2",
      label: "Reason for transfer",
    },

    {
      fieldType: "select" as const,
      name: "locationFrom" as const,
      label: "Location From",
      placeholder: "Select Location From",
      options: normalizeOptions(locationOptions),
      required: true,
    },

    {
      fieldType: "select" as const,
      name: "locationTo" as const,
      label: "Location To",
      placeholder: "Select Location To",
      options: normalizeOptions(locationOptions),
      required: true,
    },

    {
      fieldType: "input" as const,
      type: "date" as const,
      name: "expectedDate" as const,
      label: "Expected Transit Date",
    },
    {
      fieldType: "file" as const,
      name: "transportInvoices" as const,
      label: "Transport Invoice",
      placeholder: "",
    },
  ];

  // ---------------------------------------------------------------------------
  // Submit
  // ---------------------------------------------------------------------------

  const { submit, isPending } = useFormSubmit<
    TransferRequestFormValues,
    TransferRequestPayload
  >({
    resourcePath: "api/transfers/requests",
    queryKey: ["transfers", "create-transfer"],

    buildPayload: (values, compressedFiles, invoices) => {
      let cursor = 0;

      const assets = values.assets.map((asset) => {
        const count = asset.images.length;
        const assetImages = compressedFiles.slice(cursor, cursor + count);
        cursor += count;

        return {
          assetID: asset.assetID,
          area: asset.area,
          equipment: asset.equipment,
          assetIssueReason: asset.assetIssueReason ?? "",
          assetIssueDetails: asset.assetIssueDetails ?? "",
          images: assetImages.map((file) => ({
            filename: file.name,
            content_type: file.type,
          })),
        };
      });

      return {
        locationFrom: values.locationFrom,
        locationTo: values.locationTo,
        expectedDate: values.expectedDate,
        transferReason: values.transferReason,
        transportInvoices: invoices.map((file) => ({
          filename: file.name,
          content_type: file.type,
        })),
        assets,
      };
    },
    onSuccess: (values) => {
      setSuccessConfig({
        title: "Success",
        message: `The transfer request for ${values.assets?.length ?? 0} asset${
          values.assets?.length === 1 ? "" : "s"
        } was successfully created.`,
        redirectPath: "transfers/requests",
      });

      setShowSuccess(true);
    },

    onError: () => {
      setErrorConfig({
        title: "Transfer Request Failed",
        message: "Could not create the transfer request. Please try again.",
        redirectPath: "transfers/requests",
      });

      setShowError(true);
    },
  });

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="space-y-8">
      {/* --------------------------------------------------------------------- */}
      {/* Transfer-level form                                                   */}
      {/* --------------------------------------------------------------------- */}

      <DynamicForm<TransferRequestFormValues>
        form={form}
        formId="transfer-request-form"
        fields={transferFields}
        formHeading="Create Transfer"
        redirect={true}
        redirectTo="/transfers/requests"
        onSubmit={submit}
        isPending={isPending}
        submitText="Submit"
        cancelText="Cancel"
        onCancel={() => navigate("/transfers/requests")}
        className=""
        gridClassName="gap-6"
        renderActions={false}
      />

      {/* --------------------------------------------------------------------- */}
      {/* Asset fields                                                          */}
      {/* --------------------------------------------------------------------- */}

      <div className={locationFrom ? "space-y-2" : "space-y-3"}>
        {/* ------------------------------------------------------------------- */}
        {/* Add Asset                                                           */}
        {/* ------------------------------------------------------------------- */}
        {locationFrom && (
          <div className="flex items-center justify-end px-4">
            <button
              type="button"
              onClick={() =>
                append({
                  area: "",
                  equipment: "",
                  assetID: "",
                  images: [],
                  assetIssueReason: "",
                  assetIssueDetails: "",
                })
              }
              className="text-sm font-medium text-blue-600 hover:cursor-pointer"
            >
              + Add
            </button>
          </div>
        )}
        {!locationFrom && (
          <div
            role="status"
            className="mx-0 flex items-start gap-2 rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800"
          >
            <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <p>
              Select a <strong>Location From</strong> before selecting assets
              for this transfer.
            </p>
          </div>
        )}
        {/* Asset list — gets its own top margin + internal spacing */}
        <div className="space-y-6">
          {assetFields.map((field, index) => (
            <TransferAssetFields
              key={field.id}
              form={form}
              assetIndex={index}
              isOpen={openAssetIndex === index}
              onToggle={() =>
                setOpenAssetIndex((current) => (current === index ? -1 : index))
              }
              canRemove={assetFields.length > 1}
              onRemove={() => {
                remove(index);

                setOpenAssetIndex((current) => {
                  if (current === index) {
                    return Math.max(0, index - 1);
                  }

                  if (current > index) {
                    return current - 1;
                  }

                  return current;
                });
              }}
            />
          ))}
        </div>
      </div>

      {/* ----------------------------------------------------------------------- */}
      {/* Form actions                                                            */}
      {/* ----------------------------------------------------------------------- */}
      <DynamicFormActions
        formId="transfer-request-form"
        submitText="Submit"
        cancelText="Cancel"
        onCancel={() => navigate("/transfers/requests")}
        isPending={isPending}
      />
    </div>
  );
};

export default CreateTransferForm;
