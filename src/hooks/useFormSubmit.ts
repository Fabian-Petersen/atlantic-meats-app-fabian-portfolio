import { usePOST } from "@/utils/api";
import { compressImagesToWebpv1 } from "@/utils/compressImagesToWebpv1";

import type { Resource } from "@/utils/api";
import type { PresignedUrlResponse } from "@/schemas";

// ─── Types ────────────────────────────────────────────────────────────────────

type WithOptionalImages = {
  images?: File[];
  [key: string]: unknown;
};

type WithPresignedUrls = {
  presigned_urls: PresignedUrlResponse;
  [key: string]: unknown;
};

type UseFormSubmitOptions<TForm extends WithOptionalImages, TPayload> = {
  /** The selected id of the item that must be actioned. */
  id?: string;
  /** The API route to POST to. */
  resourcePath: Resource;

  /** React-Query cache key(s) to invalidate on success. */
  queryKey: readonly unknown[];

  action?: "approve" | "reject" | "action";

  /**
   * Transform form values into the API payload.
   * `compressedFiles` is an empty array when the form has no images.
   */
  buildPayload: (formValues: TForm, compressedFiles: File[]) => TPayload;

  /**
   * Called after a successful POST (and S3 upload if applicable).
   * Use this to show the Success component, close a modal, navigate, etc.
   * Optional — omit if you only need the mutation side effect.
   *
   * @example
   * onSuccess: (values) => {
   *   setSuccessConfig({
   *     title: "Job Created",
   *     message: `Request for ${values.assetID} submitted.`,
   *     redirectPath: "jobs/pending-approval",
   *   });
   *   setShowSuccess(true);
   * }
   */
  onSuccess?: (formValues: TForm) => void;

  /**
   * Called when the POST fails. Always provide this — use it to show the
   * Error component or handle the error however the form requires.
   *
   * @example
   * onError: () => {
   *   setErrorConfig({
   *     title: "Submission Failed",
   *     message: "Could not create the job. Please try again.",
   *     redirect: "/jobs/create-job",
   *   });
   *   setShowError(true);
   * }
   */
  onError: (err: unknown) => void;
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Generic form-submission hook.
 *
 * Handles the full POST lifecycle: image compression, S3 uploads, and
 * delegating success/error feedback to the caller via callbacks.
 *
 * The hook has no knowledge of routing, modals, or UI state — those are
 * caller responsibilities passed in through `onSuccess` and `onError`.
 *
 * ── Image handling ───────────────────────────────────────────────────────────
 * If `formValues.images` is a non-empty `File[]` the hook will:
 *   1. Compress images to WebP
 *   2. POST metadata to the API and expect `{ presigned_urls }` back
 *   3. Upload each file directly to S3 via the presigned URLs
 * Otherwise it performs a plain POST and expects any JSON response.
 *
 * ── Callbacks ────────────────────────────────────────────────────────────────
 * `onSuccess` — optional, receives the submitted form values so you can
 *               build dynamic messages (e.g. include the user's name).
 * `onError`   — required, receives the caught error for logging or display.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * @example
 * // With images + Success modal + redirect (e.g. CreateJobForm)
 * const { submit, isPending } = useFormSubmit({
 *   resourcePath: "jobs/requests",
 *   queryKey: ["jobs"],
 *   buildPayload: (values, compressed) => ({
 *     ...values,
 *     images: compressed.map((f) => ({ filename: f.name, content_type: f.type })),
 *   }),
 *   onSuccess: () => {
 *     setSuccessConfig({
 *       title: "Job Created",
 *       message: "Your maintenance request was submitted successfully.",
 *       redirectPath: "jobs/pending-approval",
 *     });
 *     setShowSuccess(true);
 *   },
 *   onError: () => {
 *     setErrorConfig({
 *       title: "Submission Failed",
 *       message: "Could not create the job. Please try again.",
 *       redirectPath: "/jobs/create-job",
 *     });
 *     setShowError(true);
 *   },
 * });
 *
 * @example
 * // Modal form, no images, dynamic success message (e.g. CreateUserForm)
 * const { submit, isPending } = useFormSubmit({
 *   resourcePath: "users",
 *   queryKey: ["users"],
 *   buildPayload: (values) => values,
 *   onSuccess: (values) => {
 *     setShowCreateUserDialog(false);
 *       setSuccessConfig({
 *         title: "User Created",
 *         message: `${values.name} ${values.family_name} was successfully created.`,
 *       });
 *       setShowSuccess(true);
 *   },
 *   onError: () => {
 *     setErrorConfig({
 *       title: "User Creation Failed",
 *       message: "Could not create the user. Please try again.",
 *       redirectPath: "/users",
 *     });
 *     setShowError(true);
 *   },
 * });
 *
 * @example
 * // No success modal needed — onSuccess omitted
 * const { submit, isPending } = useFormSubmit({
 *   resourcePath: "comments",
 *   queryKey: ["comments"],
 *   buildPayload: (values) => values,
 *   onError: () => {
 *     setErrorConfig({ message: "Could not post comment.", redirect: "/" });
 *     setShowError(true);
 *   },
 * });
 */
export const useFormSubmit = <TForm extends WithOptionalImages, TPayload>({
  id,
  resourcePath,
  queryKey,
  action,
  buildPayload,
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
    try {
      const rawFiles: File[] = formValues.images ?? [];
      const hasImages = rawFiles.length > 0;

      // ── 1. Compress images (no-op when form has no images) ───────────────
      const compressedFiles = hasImages
        ? await compressImagesToWebpv1(rawFiles)
        : [];

      // ── 2. Build the typed API payload ───────────────────────────────────
      const payload = buildPayload(formValues, compressedFiles);

      // ── 3. POST to the API ───────────────────────────────────────────────
      const response = await mutateAsync(payload);

      // ── 4. Upload to S3 if presigned URLs were returned ─────────────────
      if (hasImages) {
        const { presigned_urls } = response as WithPresignedUrls;

        await Promise.all(
          presigned_urls.map((item: PresignedUrlResponse[number]) => {
            const file = compressedFiles.find((f) => f.name === item.filename);
            if (!file) return Promise.resolve();

            return fetch(item.url, {
              method: "PUT",
              headers: { "Content-Type": "image/webp" },
              body: file,
            });
          }),
        );
      }

      // ── 5. Delegate to caller ────────────────────────────────────────────
      onSuccess?.(formValues);
    } catch (err) {
      console.error(`[useFormSubmit] POST to "${resourcePath}" failed:`, err);
      onError(err);
    }
  };

  return { submit, isPending, isError };
};

/* -------------------------------------------------------------------------- */
// $ Old Hook
/* -------------------------------------------------------------------------- */
// import { useNavigate } from "react-router-dom";
// import { toast } from "sonner";
// import { usePOST } from "@/utils/api";
// import { compressImagesToWebpv1 } from "@/utils/compressImagesToWebpv1";

// import type { Resource, RedirectResource } from "@/utils/api";
// import type { PresignedUrlResponse } from "@/schemas";

// // ─── Types ────────────────────────────────────────────────────────────────────

// /** Any form payload that may optionally carry raw File objects under `images`. */
// type WithOptionalImages = {
//   images?: File[];
//   [key: string]: unknown;
// };

// /**
//  * Shape returned by the API when the payload included images.
//  * The hook narrows the response to this type so it can upload to S3.
//  */
// type WithPresignedUrls = {
//   presigned_urls: PresignedUrlResponse;
//   [key: string]: unknown;
// };

// type UseFormSubmitOptions<TForm extends WithOptionalImages, TPayload> = {
//   /** The API route to POST to. */
//   resourcePath: Resource;

//   /** React-Query cache key(s) to invalidate on success. */
//   queryKey: readonly unknown[];

//   /**
//    * Transform form values into the API payload.
//    * For payloads with images: replace `File[]` with metadata objects here —
//    * the hook passes the compressed files to `buildPayload` so you can map them.
//    */
//   buildPayload: (formValues: TForm, compressedFiles: File[]) => TPayload;

//   /** Where to navigate on success. */
//   redirectTo: RedirectResource;

//   /** Optional toast messages. */
//   messages?: {
//     success?: string;
//     error?: string;
//   };
// };

// // ─── Hook ─────────────────────────────────────────────────────────────────────

// /**
//  * Generic form-submission hook.
//  *
//  * - If `formValues.images` is a non-empty `File[]` the hook will:
//  *     1. Compress images to WebP
//  *     2. POST metadata to the API and expect `{ presigned_urls }` back
//  *     3. Upload each file directly to S3 via the presigned URLs
//  * - Otherwise it performs a plain POST and expects any JSON response.
//  *
//  * @example
//  * // With images
//  * const { submit, isPending } = useFormSubmit({
//  *   resourcePath: "jobs/requests",
//  *   queryKey: ["jobs"],
//  *   buildPayload: (values, compressed) => ({
//  *     ...values,
//  *     images: compressed.map((f) => ({ filename: f.name, content_type: f.type })),
//  *   }),
//  *   redirectTo: "jobs/pending-approval",
//  * });
//  *
//  * @example
//  * // Without images (plain POST)
//  * const { submit, isPending } = useFormSubmit({
//  *   resourcePath: "assets-data",
//  *   queryKey: ["assets"],
//  *   buildPayload: (values) => values,
//  *   redirectTo: "assets/list",
//  * });
//  */
// export const useFormSubmit = <TForm extends WithOptionalImages, TPayload>({
//   resourcePath,
//   queryKey,
//   buildPayload,
//   redirectTo,
//   messages,
// }: UseFormSubmitOptions<TForm, TPayload>) => {
//   const navigate = useNavigate();

//   const { mutateAsync, isPending, isError } = usePOST<TPayload, unknown>({
//     resourcePath,
//     queryKey,
//   });

//   const submit = async (formValues: TForm): Promise<void> => {
//     try {
//       const rawFiles: File[] = formValues.images ?? [];
//       const hasImages = rawFiles.length > 0;

//       // ── 1. Compress images (no-op if none) ──────────────────────────────
//       const compressedFiles = hasImages
//         ? await compressImagesToWebpv1(rawFiles)
//         : [];

//       // ── 2. Build the typed API payload via caller-supplied transform ─────
//       const payload = buildPayload(formValues, compressedFiles);

//       // ── 3. POST to the API ───────────────────────────────────────────────
//       const response = await mutateAsync(payload);

//       // ── 4. Upload to S3 if presigned URLs were returned ─────────────────
//       if (hasImages) {
//         const { presigned_urls } = response as WithPresignedUrls;

//         await Promise.all(
//           presigned_urls.map((item: PresignedUrlResponse[number]) => {
//             const file = compressedFiles.find((f) => f.name === item.filename);
//             if (!file) return Promise.resolve();

//             return fetch(item.url, {
//               method: "PUT",
//               headers: { "Content-Type": "image/webp" },
//               body: file,
//             });
//           }),
//         );
//       }

//       // ── 5. Notify & redirect ─────────────────────────────────────────────
//       toast.success(messages?.success ?? "Submitted successfully!", {
//         duration: 1500,
//       });

//       navigate(`/${redirectTo}`);
//     } catch (err) {
//       console.error(`[useFormSubmit] POST to "${resourcePath}" failed:`, err);
//       toast.error(
//         messages?.error ?? "Submission failed. Please try again later.",
//         { duration: 1500 },
//       );
//     }
//   };

//   return { submit, isPending, isError };
// };
