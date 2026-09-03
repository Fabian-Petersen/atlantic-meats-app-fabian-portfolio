// //$ This component is used to create a maintenace job, the data is submitted to the database (dynamoDB) via API Gateway and Lambda on aws.

import { useNavigate } from "react-router-dom";
import { useState } from "react";

// $ React-Hook-Form, zod & schema
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm, type Resolver } from "react-hook-form";

// $ Import schemas
// import type { TransferRequestFormValues } from "../../schemas/index";

import { useFormSubmit } from "@/hooks/useFormSubmit";
import useGlobalContext from "@/context/useGlobalContext";
import DynamicForm, { DynamicFormActions } from "../forms/DynamicForm";
import DisposalAssetFields from "./DisposalAssetFields";
import { useAssetFilters } from "@/customHooks/useAssetFilters";
import {
  disposalRequestSchema,
  type DisposalRequestFormValues,
  type DisposalRequestPayload,
} from "@/schemas/disposalsSchemas";
// import { useDisposalsFields } from "../forms/configs/useDisposalFields";

const CreateDisposalForm = () => {
  const navigate = useNavigate();

  const [openAssetIndex, setOpenAssetIndex] = useState(0);

  const { setSuccessConfig, setShowSuccess, setErrorConfig, setShowError } =
    useGlobalContext();

  // ---------------------------------------------------------------------------
  // Form
  // ---------------------------------------------------------------------------

  const form = useForm<DisposalRequestFormValues>({
    resolver: zodResolver(
      disposalRequestSchema,
    ) as unknown as Resolver<DisposalRequestFormValues>,

    defaultValues: {
      location: "",
      expectedDisposalDate: "",
      disposalReason: "",

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
    locationField: "location",
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
   * These are the fields belonging to the overall disposal request.
   *
   * Asset-specific fields are generated separately for each asset index.
   */

  const disposalFields = [
    {
      fieldType: "textarea" as const,
      name: "disposalReason" as const,
      required: true,
      rows: 1,
      className: "md:col-span-2",
      label: "Reason for disposal",
    },

    {
      fieldType: "select" as const,
      name: "location" as const,
      label: "Location",
      placeholder: "Select Location",
      options: normalizeOptions(locationOptions),
      required: true,
    },

    {
      fieldType: "select" as const,
      name: "location" as const,
      label: "Location To",
      placeholder: "Select Location To",
      options: normalizeOptions(locationOptions),
      required: true,
    },

    {
      fieldType: "input" as const,
      type: "date" as const,
      name: "expectedDisposalDate" as const,
      label: "Expected Transit Date",
    },
  ];

  //   const { fields } = useDisposalsFields(form, openAssetIndex);

  // ---------------------------------------------------------------------------
  // Submit
  // ---------------------------------------------------------------------------

  const { submit, isPending } = useFormSubmit<
    DisposalRequestFormValues,
    DisposalRequestPayload
  >({
    resourcePath: "api/disposals/requests",
    queryKey: ["disposals", "create-disposal"],

    buildPayload: (values, compressedFiles, invoices) => {
      let cursor = 0;
      console.log(invoices);

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
        location: values.location,
        expectedDisposalDate: values.expectedDisposalDate,
        disposalReason: values.disposalReason,
        assets,
      };
    },
    onSuccess: (values) => {
      setSuccessConfig({
        title: "Success",
        message: `The disposal request for ${values.assets?.length ?? 0} asset${
          values.assets?.length === 1 ? "" : "s"
        } was successfully created.`,
        redirectPath: "disposals/requests",
      });

      setShowSuccess(true);
    },

    onError: () => {
      setErrorConfig({
        title: "Transfer Request Failed",
        message: "Could not create the disposal request. Please try again.",
        redirectPath: "disposals/requests",
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

      <DynamicForm<DisposalRequestFormValues>
        form={form}
        formId="disposal-request-form"
        fields={disposalFields}
        formHeading="Create Transfer"
        redirect={true}
        redirectTo="/disposals/requests"
        onSubmit={submit}
        isPending={isPending}
        submitText="Submit"
        cancelText="Cancel"
        onCancel={() => navigate("/disposals/requests")}
        className=""
        gridClassName="gap-6"
        renderActions={false}
      />

      {/* --------------------------------------------------------------------- */}
      {/* Asset fields                                                          */}
      {/* --------------------------------------------------------------------- */}

      <div className="space-y-2">
        {/* ------------------------------------------------------------------- */}
        {/* Add Asset                                                           */}
        {/* ------------------------------------------------------------------- */}
        <div className="flex items-center justify-end px-4">
          <button
            type="button"
            onClick={() =>
              append({
                area: "",
                // assetIndex: 0,
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
        {/* Asset list — gets its own top margin + internal spacing */}
        <div className="space-y-6">
          {assetFields.map((field, index) => (
            <DisposalAssetFields
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
        formId="disposal-request-form"
        submitText="Submit"
        cancelText="Cancel"
        onCancel={() => navigate("/disposals/requests")}
        isPending={isPending}
      />
    </div>
  );
};

export default CreateDisposalForm;
