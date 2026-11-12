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
