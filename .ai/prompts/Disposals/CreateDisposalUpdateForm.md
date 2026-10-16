Implement the existing empty `DisposalUpdateForm` component so it can update an existing disposal request.

Do not create another component with the same purpose.

## First inspect the codebase

Before changing anything, inspect:

- the existing empty `DisposalUpdateForm`
- the current disposal creation form
- disposal-related TypeScript types/interfaces
- disposal Zod schemas
- existing GET/update hooks
- existing disposal API routes
- similar update/edit forms elsewhere in the frontend
- existing loading, success, and error handling patterns

Use the existing project patterns and reuse existing components/hooks wherever possible.

## Implementation requirements

Populate `DisposalUpdateForm` with the current disposal request data and allow the user to edit only fields that are intended to be editable.

The form must:

- retrieve or receive the existing disposal request using the same pattern used elsewhere in the project
- populate default values correctly
- reuse existing disposal form fields/components where practical
- preserve non-editable/system-controlled values
- submit changes using the existing disposal update API route and HTTP method
- show the existing loading state while data is being retrieved
- disable or show a submitting state while the update is running
- use the existing success/error handling patterns

Do not redesign the disposal workflow.

## Types

Check all existing disposal types before implementing anything.

Reuse existing interfaces/types where suitable.

Do not use `any`.

If the existing create-request type contains fields that must not be updated, define a narrow update payload type containing only editable fields.

For example:

```ts
type DisposalUpdatePayload = {
  // editable fields only
};
```

Ensure form values, default values, assets, optional fields, dates, and API payloads all match the existing TypeScript definitions.

Run the TypeScript type check after implementation and fix only errors introduced by this change.

## Protect system-managed fields

Do not allow the update form to overwrite system-managed fields unless the current application explicitly supports doing so.

Examples include:

- `disposalId`
- `disposalCreated`
- requester identity/details
- requester `sub`
- approval metadata
- rejection metadata
- cancellation metadata
- timestamps
- status
- other workflow-managed fields

The update request should preferably send only the editable fields rather than posting the complete disposal object back to the backend.

## Assets

Inspect the existing disposal asset structure.

When loading the update form:

- existing assets must populate correctly
- do not duplicate assets
- do not clear existing assets
- do not change `assetID`
- do not lose existing asset properties

If the current disposal workflow already supports editing assets, reuse that functionality.

If it does not, leave asset data read-only rather than adding new asset-editing behaviour.

## API

Inspect the existing frontend/backend implementation and use the actual disposal update endpoint.

Do not guess the route or HTTP method.

The disposal functionality is under:

```text
/api/disposals
```

but determine the exact update route and whether the project uses `PUT`, `PATCH`, or another existing method.

Do not modify backend routes as part of this task.

## Scope

Only implement `DisposalUpdateForm` and make the smallest supporting changes necessary.

Do not:

- refactor unrelated disposal code
- change backend functions
- change API routes
- alter disposal approval/rejection workflows
- redesign
