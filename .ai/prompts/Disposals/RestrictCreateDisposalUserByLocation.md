Investigate and update the Create Disposal Request form so that users in the application-managed `user` and `manager` groups can only create a disposal request for their own assigned branch/location.

Important:

- The application groups are NOT Cognito groups.
- User groups and assigned locations are managed in the application's database.
- The frontend already has access to the relevant user route/API used to retrieve the logged-in user's application profile.
- Reuse the existing user/profile fetching logic and data structures already used by the application.
- Do not derive this restriction from Cognito `cognito:groups`.

Requirements:

- Locate the component and existing Zod schema used for Create Disposal Request.
- Identify how the application currently retrieves the logged-in user's database-managed:
  - group/role
  - assigned location/branch
- Reuse that existing route, hook, query, context, or user state rather than creating duplicate API logic.
- Check existing user-related components/hooks to understand the actual property names and response structure before making changes.

Apply the location restriction only when the user's application database group is:

- `user`
- `manager`

For these groups, the disposal request `location` must match the location assigned to that user in the database.

Users in other application groups, such as `admin` or `technician`, must retain the existing unrestricted behaviour.

### Zod validation

Implement this rule through the existing Zod schema.

Prefer extending the current schema with `refine`, `superRefine`, or the most appropriate existing Zod pattern rather than rewriting the schema.

Compare location values using trimmed, case-insensitive values to avoid false failures caused by casing or whitespace.

If the selected location does not match the user's database-assigned location, attach the error specifically to the `location` field and display exactly:

`The selected location is not equal to your branch location. Please select the correct location to create disposal request`

The API request must not be submitted when this validation fails.

### Location dropdown

Also investigate whether the location dropdown can safely be restricted for `user` and `manager`.

For restricted users:

- Only their database-assigned location should be available for selection.
- Do not hard-code any branch names.
- Use the location returned from the logged-in user's database profile.

For unrestricted groups:

- Keep the existing location dropdown behaviour unchanged.

The Zod validation must remain in place even if the dropdown is restricted, so that manipulating the form value manually cannot bypass the frontend validation.

### Use the existing Create Job Request implementation as reference

A similar restriction has already been implemented or is being implemented for Create Job Request.

Inspect that implementation and reuse the same approach where practical, especially for:

- retrieving the current application user
- determining the database-managed group
- obtaining the user's assigned location
- normalising location values
- filtering available locations
- integrating the rule into Zod

Avoid implementing two different patterns for Job Requests and Disposal Requests unless there is a technical reason.

### Guardrails

- Do not use Cognito groups for this requirement.
- Do not modify authentication behaviour.
- Do not change the application's database group structure.
- Do not create a new user API endpoint if the required route already exists.
- Do not duplicate user fetching if an existing hook/query/context already provides the information.
- Do not hard-code location names.
- Preserve the existing disposal payload structure.
- Preserve asset selection behaviour.
- Preserve image upload and preview behaviour.
- Preserve React Hook Form integration.
- Preserve all existing validation rules.
- Preserve the existing submit/API workflow.
- Do not perform unrelated refactoring.
- Do not introduce `any` unnecessarily.
- Keep existing TypeScript types intact.
- Run only targeted checks for the changed files. Do not run a full build unless required to investigate an error.

### Expected behaviour

Example:

`manager`
Database location: `phillipi`

Allowed:
`location = phillipi`

Rejected:
`location = strand`

The form should show:

`The selected location is not equal to your branch location. Please select the correct location to create disposal request`

Another example:

`user`
Database location: `Fish Hoek`

Allowed values should match the same location even if casing differs, such as:

`fish hoek`
`Fish Hoek`

For `admin` or `technician`, retain the current ability to create disposal requests for any available location.

### After implementation

Report briefly:

1. Which files were changed.
2. Which existing route/hook/query provides the logged-in user's database profile.
3. Which database field identifies the user's application group.
4. Which database field contains their assigned location.
5. How the Zod restriction was implemented.
6. Whether the location dropdown was filtered.
7. Whether the implementation follows the same pattern as Create Job Request.
8. Any assumptions or edge cases discovered.
