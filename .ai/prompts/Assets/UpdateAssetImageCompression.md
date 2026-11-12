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

1. The images still fail on a mobile phone, I tried a single image and it failed to upload the new image.

Multiple images work on the laptop on the deployed environment, therefore it is not the code itself but how the compression is handled on mobile

2. Multiple images still failed, 1 image updated the asset successfully. The compression is still not handling the images without error. Add a error message in the Error Modal to view what is the issue for report back when more than one image is selected to focus on the error before more changes are made.
