Investigate and update the `/jobs/create-job` form so that users in the `user` and `manager` Cognito groups can only create a maintenance job request for their own branch/location.

Requirements:

- Locate the form component and its existing Zod schema used by `/jobs/create-job`.
- Reuse the existing authenticated user information already available in the application.
- Determine the logged-in user's Cognito groups and current branch/location from the existing user/session/profile data.
- Apply the restriction only to users in the `user` and `manager` groups.
- `admin`, `technician`, and other unrestricted groups must retain the existing behaviour and be able to select any available location.
- For `user` and `manager`, validate that the selected `location` matches their assigned branch/location.
- Compare locations safely using trimmed, case-insensitive values so differences such as `Phillipi` vs `phillipi` do not cause false validation failures.
- Use Zod validation rather than adding manual validation inside the submit handler.
- Prefer extending the existing schema with `superRefine`, `refine`, or an equivalent Zod approach rather than rewriting the form schema.

If the selected location does not match the user's assigned branch, attach the validation error specifically to the `location` field and display this exact message:

`The selected location is not equal to your branch location. Please select the correct location to create job request`

Also investigate whether the location dropdown can safely be restricted for `user` and `manager` so that only their assigned branch appears as an option. If this can be implemented without breaking existing form behaviour, implement it as an additional UX safeguard. Zod validation must remain in place even if the dropdown is filtered.

Important guardrails:

- Do not hard-code branch names.
- Use the user's existing assigned location from the application's current user data.
- Do not change the behaviour for admin or technician users.
- Do not duplicate authentication or user-fetching logic if the required information is already available through an existing hook, context, store, or session.
- Preserve the existing form fields, submit workflow, API payload, React Hook Form integration, and existing validation rules.
- Do not perform unrelated refactoring.
- Check how the project currently handles Cognito groups and user locations before implementing the change.
- Keep TypeScript types intact and avoid introducing `any`.
- Run only targeted validation/type checks relevant to the files changed. Do not run a full project build unless required to diagnose an error.

After implementation, briefly report:

1. Which files were changed.
2. How the user's branch/location is obtained.
3. How the Zod restriction works.
4. Whether the location dropdown was also restricted.
5. Any edge cases or assumptions discovered.
