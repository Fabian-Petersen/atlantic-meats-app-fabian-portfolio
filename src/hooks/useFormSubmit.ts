import { usePOST } from "@/utils/api";
import { compressImagesToWebpv1 } from "@/utils/compressImagesToWebpv1";

import type { Resource } from "@/utils/api";
import type { PresignedUrlResponse } from "@/schemas";

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * Normalised file structure used internally by useFormSubmit.
 *
 * Existing forms can continue using root-level:
 *   images?: File[]
 *   invoices?: File[]
 *
 * Nested forms can provide an extractFiles function.
 */
export type FormSubmitFiles = {
  images: File[];
  invoices: File[];
};

export type FileExtractor<TForm extends object> = (
  formValues: TForm,
) => FormSubmitFiles;

type WithPresignedUrls = {
  presigned_urls: PresignedUrlResponse;
  [key: string]: unknown;
};

type UseFormSubmitOptions<TForm extends object, TPayload, TData = TForm> = {
  /** The selected id of the item that must be actioned. */
  id?: string;

  /** The API route to POST to. */
  resourcePath: Resource;

  /** React-Query cache key(s) to invalidate on success. */
  queryKey: readonly unknown[];

  /** Optional data, passed to the hook if required e.g. to give information in modals. */
  data?: TData;

  action?:
    | "approve"
    | "reject"
    | "action"
    | "in-transit"
    | "receipt"
    | "verify";

  /**
   * Transform form values into the API payload.
   *
   * compressedFiles contains compressed image files.
   * invoices contains the original invoice files.
   *
   * Existing forms that do not use files can simply use:
   *   buildPayload: (values) => values
   */
  buildPayload: (
    formValues: TForm,
    compressedFiles: File[],
    invoices: File[],
  ) => TPayload;

  /**
   * Extract files from the form.
   *
   * Existing root-level forms do not need to provide this.
   * The default extractor reads:
   *   values.images
   *   values.invoices
   *
   * Nested forms can provide their own extractor.
   */
  extractFiles?: FileExtractor<TForm>;

  /** Called after POST and all required S3 uploads succeed. */
  onSuccess?: (formValues: TForm, data?: TData) => void;

  /** Called when POST, compression, or S3 upload fails. */
  onError: (err: unknown, data?: TData) => void;
};

// ─── Default File Extractor ───────────────────────────────────────────────────

const extractRootFiles = <TForm extends object>(
  formValues: TForm,
): FormSubmitFiles => {
  const values = formValues as TForm & {
    images?: File[];
    invoices?: File[];
  };

  return {
    images: values.images ?? [],
    invoices: values.invoices ?? [],
  };
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Generic form-submission hook.
 *
 * Supports both:
 * 1. Existing forms with root-level images/invoices.
 * 2. New forms with files nested anywhere in their form structure by supplying
 *    extractFiles.
 *
 * The hook does not know anything about the form's domain model.
 *
 * Submission flow:
 *   1. Extract local files.
 *   2. Compress images when present.
 *   3. Build the metadata-only payload.
 *   4. POST the payload.
 *   5. Upload files to S3 when files were supplied.
 *   6. Call onSuccess.
 */
export const useFormSubmit = <TForm extends object, TPayload>({
  id,
  resourcePath,
  queryKey,
  action,
  data,
  buildPayload,
  extractFiles = extractRootFiles,
  onSuccess,
  onError,
}: UseFormSubmitOptions<TForm, TPayload>) => {
  const { mutateAsync, isPending, isError } = usePOST<TPayload, unknown>({
    id,
    resourcePath,
    queryKey,
    action,
  });

  const submit = async (formValues: TForm): Promise<void> => {
    console.log("formvalues:", formValues);

    try {
      // ── 1. Extract files ──────────────────────────────────────────────────
      //
      // For existing forms this reads root-level images/invoices.
      // Transfer forms provide their own extractor for nested assets.
      const { images: rawFiles, invoices: rawInvoices } =
        extractFiles(formValues);

      const hasImages = rawFiles.length > 0;
      const hasInvoices = rawInvoices.length > 0;

      // ── 2. Compress images ────────────────────────────────────────────────
      //
      // Invoices are deliberately kept as the original files.
      const compressedFiles = hasImages
        ? await compressImagesToWebpv1(rawFiles)
        : [];

      // ── 3. Build the typed API payload ────────────────────────────────────
      //
      // buildPayload decides how the files are represented in the API payload.
      // The actual File objects are never sent to the backend.
      const payload = buildPayload(formValues, compressedFiles, rawInvoices);

      // ── 4. POST metadata to the API ───────────────────────────────────────
      const response = await mutateAsync(payload);

      // ── 5. Upload files directly to S3 ───────────────────────────────────
      //
      // This block is skipped entirely for forms such as CreateUserForm,
      // which have no images or invoices.
      if (hasImages || hasInvoices) {
        const { presigned_urls } = response as WithPresignedUrls;

        if (!presigned_urls) {
          throw new Error("Expected presigned URLs but none were returned.");
        }

        await Promise.all(
          presigned_urls.map((item: PresignedUrlResponse[number]) => {
            /*
             * Images use the compressed file.
             * Invoices use the original file.
             */
            const file =
              compressedFiles.find((f) => f.name === item.filename) ??
              rawInvoices.find((f) => f.name === item.filename);

            if (!file) {
              throw new Error(`Could not find local file for ${item.filename}`);
            }

            return fetch(item.url, {
              method: "PUT",
              headers: {
                "Content-Type": item.content_type,
              },
              body: file,
            }).then(async (res) => {
              if (!res.ok) {
                const errorText = await res.text();

                console.error("S3 upload failed:", {
                  status: res.status,
                  filename: item.filename,
                  content_type: item.content_type,
                  file_type: file.type,
                  error: errorText,
                });

                throw new Error(`S3 upload failed for ${item.filename}`);
              }

              return res;
            });
          }),
        );
      }

      // ── 6. Delegate success handling ─────────────────────────────────────
      onSuccess?.(formValues, data);
    } catch (err) {
      console.error(`[useFormSubmit] POST to "${resourcePath}" failed:`, err);

      onError(err, data);
    }
  };

  return {
    submit,
    isPending,
    isError,
  };
};

/* -------------------------------------------------------------------------- */
/*                                  OLD HOOK                                  */
/* -------------------------------------------------------------------------- */

// import { usePOST } from "@/utils/api";
// import { compressImagesToWebpv1 } from "@/utils/compressImagesToWebpv1";

// import type { Resource } from "@/utils/api";
// import type { PresignedUrlResponse } from "@/schemas";

// // ─── Types ────────────────────────────────────────────────────────────────────

// /**
//  * Normalized file structure used internally by useFormSubmit.
//  *
//  * The original form can store files anywhere in its structure.
//  *
//  * Examples:
//  *
//  * Root-level:
//  *   {
//  *     images: File[],
//  *     invoices: File[]
//  *   }
//  *
//  * Nested:
//  *   {
//  *     assets: [
//  *       {
//  *         images: File[],
//  *         transportInvoices: File[]
//  *       }
//  *     ]
//  *   }
//  *
//  * The extractor converts either structure into this format.
//  */
// export type FormSubmitFiles = {
//   images: File[];
//   invoices: File[];
// };

// /**
//  * Extracts the actual File objects from a form.
//  *
//  * This allows useFormSubmit to support different form structures
//  * without knowing anything about the form's domain model.
//  */
// export type FileExtractor<TForm extends object> = (
//   formValues: TForm,
// ) => FormSubmitFiles;

// type WithPresignedUrls = {
//   presigned_urls: PresignedUrlResponse;
//   [key: string]: unknown;
// };

// type UseFormSubmitOptions<TForm extends object, TPayload> = {
//   /** The selected id of the item that must be actioned. */
//   id?: string;

//   /** The API route to POST to. */
//   resourcePath: Resource;

//   /** React-Query cache key(s) to invalidate on success. */
//   queryKey: readonly unknown[];

//   action?:
//     | "approve"
//     | "reject"
//     | "action"
//     | "in-transit"
//     | "receipt"
//     | "verify";

//   /**
//    * Transform form values into the API payload.
//    *
//    * IMPORTANT:
//    * The actual File objects are never sent to the API.
//    *
//    * Files should be converted into metadata:
//    *
//    *   {
//    *     filename: file.name,
//    *     content_type: file.type
//    *   }
//    *
//    * The backend uses this metadata to generate presigned
//    * S3 URLs.
//    *
//    * `compressedFiles` contains compressed image files.
//    * `invoices` contains the original invoice files.
//    */
//   buildPayload: (
//     formValues: TForm,
//     compressedFiles: File[],
//     invoices: File[],
//   ) => TPayload;

//   /**
//    * Extract the actual File objects from the form.
//    *
//    * This is only used after the API has returned presigned
//    * URLs so the browser can upload the files directly to S3.
//    *
//    * The files themselves are NEVER sent to the backend.
//    *
//    * If omitted, the hook expects root-level:
//    *
//    *   images?: File[]
//    *   invoices?: File[]
//    *
//    * For nested forms, provide a custom extractor.
//    *
//    * Example:
//    *
//    *   extractFiles: (values) => ({
//    *     images: values.assets.flatMap(
//    *       (asset) => asset.images ?? [],
//    *     ),
//    *     invoices: values.assets.flatMap(
//    *       (asset) => asset.transportInvoices ?? [],
//    *     ),
//    *   })
//    */
//   extractFiles?: FileExtractor<TForm>;

//   /**
//    * Called after a successful POST and S3 upload.
//    *
//    * Use this to show the Success component, close a modal,
//    * navigate, etc.
//    *
//    * @example
//    * onSuccess: (values) => {
//    *   setSuccessConfig({
//    *     title: "Job Created",
//    *     message: `Request for ${values.assetID} submitted.`,
//    *     redirectPath: "jobs/pending-approval",
//    *   });
//    *   setShowSuccess(true);
//    * }
//    */
//   onSuccess?: (formValues: TForm) => void;

//   /**
//    * Called when the POST or S3 upload fails.
//    *
//    * Always provide this — use it to show the Error component
//    * or handle the error however the form requires.
//    *
//    * @example
//    * onError: () => {
//    *   setErrorConfig({
//    *     title: "Submission Failed",
//    *     message: "Could not create the job. Please try again.",
//    *     redirectPath: "/jobs/create-job",
//    *   });
//    *   setShowError(true);
//    * }
//    */
//   onError: (err: unknown) => void;
// };

// // ─── Default File Extractor ───────────────────────────────────────────────────

// /**
//  * Extract files from standard forms that expose root-level:
//  *
//  *   images?: File[]
//  *   invoices?: File[]
//  *
//  * Existing forms using this structure do not need to provide
//  * an `extractFiles` function.
//  *
//  * Nested forms should provide their own extractor.
//  */
// const extractRootFiles = <TForm extends object>(
//   formValues: TForm,
// ): FormSubmitFiles => {
//   const values = formValues as TForm & {
//     images?: File[];
//     invoices?: File[];
//   };

//   return {
//     images: values.images ?? [],
//     invoices: values.invoices ?? [],
//   };
// };

// // ─── Hook ─────────────────────────────────────────────────────────────────────

// /**
//  * Generic form-submission hook.
//  *
//  * Handles the full POST lifecycle:
//  *
//  * 1. Extract files from the form.
//  * 2. Compress images locally when present.
//  * 3. Build a metadata-only API payload.
//  * 4. POST the payload to the backend.
//  * 5. Receive presigned S3 URLs from the backend.
//  * 6. Upload the actual files directly to S3.
//  * 7. Delegate success/error feedback to the caller.
//  *
//  * The hook has no knowledge of the form's internal structure.
//  *
//  * ── File handling ─────────────────────────────────────────────────────────────
//  *
//  * Files are NEVER sent directly to the API.
//  *
//  * The API receives only file metadata, for example:
//  *
//  *   {
//  *     filename: "image.webp",
//  *     content_type: "image/webp"
//  *   }
//  *
//  * The backend responds with presigned S3 URLs.
//  *
//  * The hook then uses the locally retained File objects to
//  * upload directly to S3 using those presigned URLs.
//  *
//  * ── Root-level forms ──────────────────────────────────────────────────────────
//  *
//  * Existing forms can continue using:
//  *
//  *   images?: File[]
//  *   invoices?: File[]
//  *
//  * without providing an `extractFiles` function.
//  *
//  * ── Nested forms ──────────────────────────────────────────────────────────────
//  *
//  * Forms with files nested inside another structure can provide
//  * a custom `extractFiles` function.
//  *
//  * Example:
//  *
//  *   extractFiles: (values) => ({
//  *     images: values.assets.flatMap(
//  *       (asset) => asset.images ?? [],
//  *     ),
//  *     invoices: values.assets.flatMap(
//  *       (asset) => asset.transportInvoices ?? [],
//  *     ),
//  *   })
//  *
//  * The hook does not need to know what `assets` represents.
//  *
//  * ── Action forms (`id` + `action`) ─────────────────────────────────────────────
//  *
//  * Some components need to act on an existing resource rather
//  * than create a new one.
//  *
//  * Pass `id` and `action` together for these cases.
//  *
//  * Both are optional and should be omitted for standard create forms.
//  *
//  * ── Callbacks ──────────────────────────────────────────────────────────────────
//  *
//  * `onSuccess` — optional, receives the submitted form values after
//  * the POST and all S3 uploads have completed successfully.
//  *
//  * `onError` — required, receives the caught error for logging or display.
//  */
// export const useFormSubmit = <TForm extends object, TPayload>({
//   id,
//   resourcePath,
//   queryKey,
//   action,
//   buildPayload,
//   extractFiles = extractRootFiles,
//   onSuccess,
//   onError,
// }: UseFormSubmitOptions<TForm, TPayload>) => {
//   const { mutateAsync, isPending, isError } = usePOST<TPayload, unknown>({
//     id,
//     resourcePath,
//     queryKey,
//     action,
//   });

//   const submit = async (formValues: TForm): Promise<void> => {
//     console.log("formvalues:", formValues);

//     try {
//       // ── 1. Extract files ──────────────────────────────────────────────────
//       //
//       // This only gives the hook access to the local File objects.
//       // The files themselves are NOT sent to the API.

//       const { images: rawFiles, invoices: rawInvoices } =
//         extractFiles(formValues);

//       const hasImages = rawFiles.length > 0;
//       const hasInvoices = rawInvoices.length > 0;

//       // ── 2. Compress images ───────────────────────────────────────────────
//       //
//       // Compression happens locally.
//       // The compressed files are retained for the eventual
//       // direct S3 upload.

//       const compressedFiles = hasImages
//         ? await compressImagesToWebpv1(rawFiles)
//         : [];

//       // ── 3. Build the typed API payload ───────────────────────────────────
//       //
//       // IMPORTANT:
//       // The payload contains metadata only.
//       // Actual File objects are never sent to the API.

//       const payload = buildPayload(formValues, compressedFiles, rawInvoices);

//       // ── 4. POST metadata to the API ──────────────────────────────────────
//       //
//       // The backend uses the file metadata to generate
//       // presigned S3 URLs.

//       const response = await mutateAsync(payload);

//       // ── 5. Upload files directly to S3 ───────────────────────────────────
//       //
//       // The API response contains presigned URLs.
//       // The actual files are uploaded directly from the browser
//       // to S3.

//       if (hasImages || hasInvoices) {
//         const { presigned_urls } = response as WithPresignedUrls;

//         if (!presigned_urls) {
//           throw new Error("Expected presigned URLs but none were returned.");
//         }

//         await Promise.all(
//           presigned_urls.map((item: PresignedUrlResponse[number]) => {
//             /*
//              * Images use the compressed file.
//              * Invoices use the original file.
//              */
//             const file =
//               compressedFiles.find((f) => f.name === item.filename) ??
//               rawInvoices.find((f) => f.name === item.filename);

//             if (!file) {
//               throw new Error(`Could not find local file for ${item.filename}`);
//             }

//             return fetch(item.url, {
//               method: "PUT",
//               headers: {
//                 "Content-Type": item.content_type,
//               },
//               body: file,
//             }).then(async (res) => {
//               if (!res.ok) {
//                 const errorText = await res.text();

//                 console.error("S3 upload failed:", {
//                   status: res.status,
//                   filename: item.filename,
//                   content_type: item.content_type,
//                   file_type: file.type,
//                   error: errorText,
//                 });

//                 throw new Error(`S3 upload failed for ${item.filename}`);
//               }

//               return res;
//             });
//           }),
//         );
//       }

//       // ── 6. Delegate success handling ────────────────────────────────────

//       onSuccess?.(formValues);
//     } catch (err) {
//       console.error(`[useFormSubmit] POST to "${resourcePath}" failed:`, err);

//       onError(err);
//     }
//   };

//   return {
//     submit,
//     isPending,
//     isError,
//   };
// };

// /* -------------------------------------------------------------------------- */
// /*                                  OLD HOOK                                  */
// /* -------------------------------------------------------------------------- */

// // import { usePOST } from "@/utils/api";
// // import { compressImagesToWebpv1 } from "@/utils/compressImagesToWebpv1";

// // import type { Resource } from "@/utils/api";
// // import type { PresignedUrlResponse } from "@/schemas";

// // // ─── Types ────────────────────────────────────────────────────────────────────

// // type WithOptionalImages = {
// //   images?: File[];
// //   invoices?: File[];
// //   [key: string]: unknown;
// // };

// // type WithPresignedUrls = {
// //   presigned_urls: PresignedUrlResponse;
// //   [key: string]: unknown;
// // };

// // type UseFormSubmitOptions<TForm extends WithOptionalImages, TPayload> = {
// //   /** The selected id of the item that must be actioned. */
// //   id?: string;
// //   /** The API route to POST to. */
// //   resourcePath: Resource;

// //   /** React-Query cache key(s) to invalidate on success. */
// //   queryKey: readonly unknown[];

// //   action?:
// //     | "approve"
// //     | "reject"
// //     | "action"
// //     | "in-transit"
// //     | "receipt"
// //     | "verify";

// //   /**
// //    * Transform form values into the API payload.
// //    * `compressedFiles` is an empty array when the form has no images.
// //    */
// //   buildPayload: (
// //     formValues: TForm,
// //     compressedFiles: File[],
// //     invoices: File[],
// //   ) => TPayload;

// //   /**
// //    * Called after a successful POST (and S3 upload if applicable).
// //    * Use this to show the Success component, close a modal, navigate, etc.
// //    * Optional — omit if you only need the mutation side effect.
// //    *
// //    * @example
// //    * onSuccess: (values) => {
// //    *   setSuccessConfig({
// //    *     title: "Job Created",
// //    *     message: `Request for ${values.assetID} submitted.`,
// //    *     redirectPath: "jobs/pending-approval",
// //    *   });
// //    *   setShowSuccess(true);
// //    * }
// //    */
// //   onSuccess?: (formValues: TForm) => void;

// //   /**
// //    * Called when the POST fails. Always provide this — use it to show the
// //    * Error component or handle the error however the form requires.
// //    *
// //    * @example
// //    * onError: () => {
// //    *   setErrorConfig({
// //    *     title: "Submission Failed",
// //    *     message: "Could not create the job. Please try again.",
// //    *     redirect: "/jobs/create-job",
// //    *   });
// //    *   setShowError(true);
// //    * }
// //    */
// //   onError: (err: unknown) => void;
// // };

// // // $ ─── Hook ─────────────────────────────────────────────────────────────────────

// // /**
// //  * Generic form-submission hook.
// //  *
// //  * Handles the full POST lifecycle: image compression, S3 uploads, and
// //  * delegating success/error feedback to the caller via callbacks.
// //  *
// //  * The hook has no knowledge of routing, modals, or UI state — those are
// //  * caller responsibilities passed in through `onSuccess` and `onError`.
// //  *
// //  * ── Image handling ──────────────────────────────────────────────────────────
// //  *   If `formValues.images` is a non-empty `File[]` the hook will:
// //  *   1. Compress images to WebP
// //  *   2. POST metadata to the API and expect `{ presigned_urls }` back
// //  *   3. Upload each file directly to S3 via the presigned URLs
// //  * Otherwise it performs a plain POST and expects any JSON response.
// //  *
// //  *── Action forms (`id` + `action`) ──────────────────────────────────────────
// //  * Some components (e.g. approval/rejection dialogs) need to act on an existing
// //  * resource rather than create a new one. Pass `id` and `action` together for
// //  * these cases — the underlying `usePOST` call will scope the request to that
// //  * resource. Both are optional and should be omitted for standard create forms.
// //  *
// //  * ── Callbacks ──────────────────────────────────────────────────────────────
// //  * `onSuccess` — optional, receives the submitted form values so you can
// //  *               build dynamic messages (e.g. include the user's name).
// //  * `onError`   — required, receives the caught error for logging or display.
// //  *
// //  * ────────────────────────────────────────────────────────────────────────────
// //  *
// //  * @example
// //  * // $ With images + Success modal + redirect (e.g. CreateJobForm)
// //  * const { submit, isPending } = useFormSubmit({
// //  *   resourcePath: "jobs/requests",
// //  *   queryKey: ["jobs"],
// //  *   buildPayload: (values, compressed) => ({
// //  *     ...values,
// //  *     images: compressed.map((f) => ({ filename: f.name, content_type: f.type })),
// //  *   }),
// //  *   onSuccess: () => {
// //  *     setSuccessConfig({
// //  *       title: "Job Created",
// //  *       message: "Your maintenance request was submitted successfully.",
// //  *       redirectPath: "jobs/pending-approval",
// //  *     });
// //  *     setShowSuccess(true);
// //  *   },
// //  *   onError: () => {
// //  *     setErrorConfig({
// //  *       title: "Submission Failed",
// //  *       message: "Could not create the job. Please try again.",
// //  *       redirectPath: "/jobs/create-job",
// //  *     });
// //  *     setShowError(true);
// //  *   },
// //  * });
// //  *
// //  * @example
// //  * // $ Modal form, no images, dynamic success message (e.g. CreateUserForm)
// //  * const { submit, isPending } = useFormSubmit({
// //  *   resourcePath: "users",
// //  *   queryKey: ["users"],
// //  *   buildPayload: (values) => values,
// //  *   onSuccess: (values) => {
// //  *     setShowCreateUserDialog(false);
// //  *       setSuccessConfig({
// //  *         title: "User Created",
// //  *         message: `${values.name} ${values.family_name} was successfully created.`,
// //  *       });
// //  *       setShowSuccess(true);
// //  *   },
// //  *   onError: () => {
// //  *     setErrorConfig({
// //  *       title: "User Creation Failed",
// //  *       message: "Could not create the user. Please try again.",
// //  *       redirectPath: "/users",
// //  *     });
// //  *     setShowError(true);
// //  *   },
// //  * });
// //  *
// //  * @example
// //  * // Action form with id + action with images (e.g. JobActionDialog)
// //  * const { submit, isPending } = useFormSubmit({
// //  *   id: selectedRowId ?? "",
// //  *   resourcePath: "jobs",
// //  *   queryKey: ["jobs", "action-job"],
// //  *   action: "action",
// //  *   buildPayload: (values, compressed) => ({
// //  *     ...values,
// //  *     selectedRowId: selectedRowId, // id expected by the backend
// //  *     images: compressed.map((f) => ({
// //  *       filename: f.name,
// //  *       content_type: f.type,
// //  *     })),
// //  *   }),
// //  *   onSuccess: () => {
// //  *     setShowActionDialog(false);
// //  *     setSuccessConfig({
// //  *       title: "Job Created",
// //  *       message: "Job completion successfully submitted.",
// //  *       redirectPath: "jobs/completed",
// //  *     });
// //  *     setShowSuccess(true);
// //  *   },
// //  *   onError: () => {
// //  *     setErrorConfig({
// //  *       title: "Submission Failed",
// //  *       message: "Could not close the job. Please try again.",
// //  *       redirectPath: "jobs/in-progress",
// //  *     });
// //  *     setShowError(true);
// //  *   },
// //  * });
// //  *
// //  * @example
// //  * // Action form with id + action and no images (e.g. ApproveJobDialog)
// //  * const { submit, isPending } = useFormSubmit({
// //  *   id: job.id,
// //  *   action: "approve",
// //  *   resourcePath: "jobs/requests",
// //  *   queryKey: ["jobs"],
// //  *   buildPayload: (values) => values,
// //  *   onSuccess: () => {
// //  *     setShowApproveDialog(false);
// //  *     setSuccessConfig({
// //  *       title: "Job Approved",
// //  *       message: `Request ${job.id} has been approved.`,
// //  *       redirectPath: "jobs/approved",
// //  *     });
// //  *     setShowSuccess(true);
// //  *   },
// //  *   onError: () => {
// //  *     setErrorConfig({
// //  *       title: "Approval Failed",
// //  *       message: "Could not approve the job. Please try again.",
// //  *     });
// //  *     setShowError(true);
// //  *   },
// //  * });
// //  *
// //  * @example
// //  * // No success modal needed — onSuccess omitted
// //  * const { submit, isPending } = useFormSubmit({
// //  *   resourcePath: "comments",
// //  *   queryKey: ["comments"],
// //  *   buildPayload: (values) => values,
// //  *   onError: () => {
// //  *     setErrorConfig({ message: "Could not post comment.", redirect: "/" });
// //  *     setShowError(true);
// //  *   },
// //  * });
// //  */

// // export const useFormSubmit = <TForm extends WithOptionalImages, TPayload>({
// //   id,
// //   resourcePath,
// //   queryKey,
// //   action,
// //   buildPayload,
// //   onSuccess,
// //   onError,
// // }: UseFormSubmitOptions<TForm, TPayload>) => {
// //   const { mutateAsync, isPending, isError } = usePOST<TPayload, unknown>({
// //     id,
// //     resourcePath,
// //     queryKey,
// //     action,
// //   });

// //   const submit = async (formValues: TForm): Promise<void> => {
// //     console.log("formvalues:", formValues);
// //     try {
// //       const rawFiles: File[] = formValues.images ?? [];
// //       const rawInvoices: File[] = formValues.invoices ?? [];

// //       const hasImages = rawFiles.length > 0;
// //       const hasInvoices = rawInvoices.length > 0;

// //       // ── 1. Compress images (no-op when form has no images) ───────────────
// //       const compressedFiles = hasImages
// //         ? await compressImagesToWebpv1(rawFiles)
// //         : [];

// //       // ── 2. Build the typed API payload ───────────────────────────────────
// //       const payload = buildPayload(formValues, compressedFiles, rawInvoices);
// //       // console.log(payload);

// //       // ── 3. POST to the API ───────────────────────────────────────────────
// //       const response = await mutateAsync(payload);

// //       // ── 4. Upload images and invoices to S3 if presigned URLs were returned ─────────────────
// //       if (hasImages || hasInvoices) {
// //         const { presigned_urls } = response as WithPresignedUrls;

// //         await Promise.all(
// //           presigned_urls.map((item: PresignedUrlResponse[number]) => {
// //             // Check images first, then invoices
// //             const file =
// //               compressedFiles.find((f) => f.name === item.filename) ??
// //               rawInvoices.find((f) => f.name === item.filename);

// //             if (!file) return Promise.resolve();

// //             // return fetch(item.url, {
// //             //   method: "PUT",
// //             //   headers: { "Content-Type": item.content_type },
// //             //   body: file,
// //             // });

// //             return fetch(item.url, {
// //               method: "PUT",
// //               headers: { "Content-Type": item.content_type },
// //               body: file,
// //             }).then(async (res) => {
// //               if (!res.ok) {
// //                 const errorText = await res.text(); // S3 returns XML error details
// //                 console.error("S3 upload failed:", {
// //                   status: res.status,
// //                   filename: item.filename,
// //                   content_type: item.content_type,
// //                   file_type: file.type,
// //                   error: errorText, // 👈 this will tell you exactly why S3 rejected it
// //                 });
// //               }
// //               return res;
// //             });
// //           }),
// //         );
// //       }

// //       // ── 5. Delegate to caller ────────────────────────────────────────────
// //       onSuccess?.(formValues);
// //     } catch (err) {
// //       console.error(`[useFormSubmit] POST to "${resourcePath}" failed:`, err);
// //       onError(err);
// //     }
// //   };

// //   return { submit, isPending, isError };
// // };
