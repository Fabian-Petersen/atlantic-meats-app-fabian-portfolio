### Codex Prompt: Update Asset Image Layout on Mobile

Review the existing asset image container and update its layout specifically for mobile devices.

**Requirements:**

1. **Mobile image layout:**
   - Remove the current layout where one image is displayed significantly larger than the others.
   - Display all asset images as equally sized, small thumbnails.
   - Use a responsive grid layout that efficiently uses the available mobile screen space.
   - Ensure consistent image dimensions, spacing and alignment.
   - Maintain the existing image aspect ratios without distortion.

2. **Image interaction:**
   - Preserve the existing functionality where tapping an image opens or maximises it for a larger view.
   - Do not modify the existing image viewer, modal, zoom functionality or navigation behaviour.

3. **Desktop layout:**
   - Keep the existing desktop image layout unchanged.
   - Apply the layout adjustments only to mobile screen sizes.

4. **Strict scope restrictions:**
   - Make only the minimum necessary JSX and Tailwind CSS changes.
   - Do not modify any existing business logic, hooks, state management, API calls or event handlers.
   - Do not introduce new dependencies or unnecessary components.
   - Do not refactor unrelated code.
   - Preserve all existing functionality.

**Expected result:**

On mobile, every asset image should initially appear as a small, equally sized thumbnail, with no featured or oversized image. Tapping any thumbnail should continue to open the existing enlarged image viewer.

**Important:** This is strictly a mobile UI layout adjustment. No other code, functionality or application logic should be changed.

## Correction

### 1: Correct Asset Image Viewer Behaviour

The mobile image layout is now correct, with all images displayed as equally sized thumbnails. However, the image viewer interaction needs to be corrected.

**Required changes:**

1. When a user taps **any image thumbnail**, it should open the existing full-size image viewer.
2. The viewer must initially display the **specific image the user selected**, rather than always opening the first image.
3. Once the viewer is open, the user must be able to scroll or swipe through all the other asset images, using the same existing behaviour currently available when clicking the first image.
4. Ensure this functionality works consistently for every image in the list, including the first, middle and last images.
5. Preserve the current mobile thumbnail layout, where all images are equally sized.

**Strict restrictions:**

- Reuse the existing full-size image viewer and its scrolling/navigation functionality.
- Do not introduce a new image viewer or additional dependencies.
- Do not modify the image upload, compression, deletion or storage logic.
- Do not change any unrelated components, hooks or business logic.
- Make only the minimum code changes necessary to correct the image selection and viewer behaviour.

**Expected result:**

Tapping any thumbnail opens that specific image in full view, with the ability to scroll or swipe through the remaining images, exactly as the existing viewer currently behaves when opening the first image.

**Important:** This is strictly an image viewer interaction correction. The current thumbnail layout and all other functionality must remain unchanged.
