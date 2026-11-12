Review the image compression and upload functionality in `UpdateAssetForm`.

**Background:**

We previously encountered an issue with asset verification where mobile devices could not reliably compress multiple images simultaneously, causing the frontend to throw errors. This was resolved by changing the compression process to handle images **individually and sequentially**, rather than processing them all at once.

**Tasks:**

1. **Review the existing implementation**
   - Locate `UpdateAssetForm` and examine how new images are compressed and uploaded when updating an asset.
   - Find the image compression implementation used in asset verification and identify how the issue was resolved.
   - Compare both implementations to determine whether the same problem exists in `UpdateAssetForm`.

2. **Implement the necessary improvements**
   - Apply the sequential image compression approach used in asset verification to `UpdateAssetForm`.
   - Ensure images are processed one at a time to reduce memory consumption, particularly on mobile devices.
   - Preserve existing functionality, including previously uploaded images, newly added images, and image removal.
   - Ensure that failures are handled gracefully without causing the frontend to crash.

3. **Investigate reusable hook functionality**
   - Identify the existing hook responsible for asset POST/UPDATE requests.
   - Determine whether image compression should be moved into a reusable hook or utility rather than being handled directly within individual components.
   - If appropriate, refactor the implementation to centralise image compression and handling.
   - Avoid introducing unnecessary complexity or breaking other components that use the same hook.

4. **Validation**
   - Verify that multiple images are compressed sequentially rather than concurrently.
   - Ensure the update request is submitted only after the required image processing has completed successfully.
   - Check that the implementation works reliably on memory-constrained mobile devices.
   - Preserve existing API request structures, image upload functionality, and error handling.

**Important:**

Reuse the existing asset verification solution wherever possible. Avoid duplicating compression logic across components.

Before implementing changes, inspect the relevant components, hooks, and utilities to identify the most maintainable approach.

**Expected outcome:**

A reliable, reusable image compression process that prevents mobile browser memory-related errors when updating assets with multiple new images, without affecting existing asset functionality.

After implementation, provide a summary of the files modified, the changes made, and any potential impacts on other components.

## Continued Errors

### Error 1: Image Upload Failure on Mobile

Images are still failing to upload on mobile devices, even when only a single image is selected.

Multiple images upload successfully on a laptop in the deployed environment, suggesting that the issue may be related to how image compression, memory usage, or file handling is performed on mobile browsers.

Investigate mobile-specific image processing behaviour and identify the underlying cause.

### Error 2: Multiple Image Compression/Upload Failure

**Observed behaviour:**

- Updating an asset with one new image succeeds.
- Updating an asset with multiple new images fails.
- The existing sequential compression implementation has not resolved the issue.

**Required investigation:**

1. Review the complete image processing workflow in `UpdateAssetForm`, including compression, file preparation, uploads, and the final asset update request.
2. Determine exactly which stage fails when multiple images are selected.
3. Inspect the existing error handling to identify whether the original error is being swallowed, replaced, or incorrectly handled.
4. **Update the existing Error Modal to display detailed error information** when image compression, uploading, or the asset update request fails.
5. Include useful diagnostic information where available:
   - Failed operation (compression, upload, or asset update).
   - Original error message.
   - Image filename and image index.
   - Total number of selected images.
   - HTTP status code and API error response, if applicable.
6. Ensure the error details remain visible in the Error Modal so they can be copied or reported for further investigation.
7. Do not expose sensitive information such as authentication tokens, credentials, or presigned upload URLs.

**Important:**

The priority is to **identify the actual cause of the failure before implementing further fixes**.

Do not introduce additional compression changes, refactor hooks, modify API request structures, or change the existing upload logic at this stage.

Only implement the diagnostic error handling necessary to expose the underlying issue.

**Expected outcome:**

When an asset update fails with multiple images, the Error Modal must clearly show the relevant error details so the exact failure can be reported back for further investigation.

Preserve all existing functionality and avoid unrelated code or logic changes.
