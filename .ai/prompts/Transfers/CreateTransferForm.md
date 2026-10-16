Implement the existing empty `TransferUpdateForm` component so it can update an existing asset transfer request.

Do not create another component with the same purpose.

## First inspect the codebase

Before changing anything, inspect:

- the existing empty `TransferUpdateForm`
- the current transfer request creation form
- transfer-related TypeScript types/interfaces
- transfer-related Zod schemas
- existing GET/update hooks
- existing transfer API routes
- similar edit/update forms elsewhere in the frontend
- existing loading, success, and error handling patterns

Use the current project architecture and reuse existing components, hooks, schemas, and styles wherever practical.

## Existing transfer structure

The current transfer request structure includes fields such as:

- `transferId`
- `transferCreated`
- `requested_by`
- `requested_name`
- `requested_sub`
- `requested_email`
- `locationFrom`
- `locationTo`
- `expectedDate`
- `transferReason`
- `description`
- `status`
- `assets[]`

Transfer assets may include fields such as:

- `assetID`
- `area`
- `equipment`
- `images`
- `issueReason`
- `issueDetails`

The transfer workflow also contains system/workflow-managed data for later stages such as approval, in-transit, receipt, rejection, cancellation, and expiry.

Inspect the actual current types and backend contracts and treat those as the source of truth.

## Implementation requirements

Populate `TransferUpdateForm` with the current transfer request data and allow the user to modify only the fields that are intended to remain editable at the request stage.

The form must:

- retrieve or receive the existing transfer request using the existing application pattern
- correctly populate the current values
- reuse existing transfer form controls where practical
- preserve fields that are not editable
- submit changes using the existing transfer update API route and HTTP method
- show the existing loading state while retrieving the transfer
- show the existing submitting state while saving
- use the current success/error handling pattern

Do not redesign the transfer workflow.

## Types

Inspect all existing transfer TypeScript types before implementing the form.

Reuse existing types wherever possible.

Do not use `any`.

If the transfer creation payload contains fields that must not be included in an update request, create a narrow update type such as:

```ts
type TransferUpdatePayload = {
  // editable request fields only
};
```

Ensure:

- default values match the expected types
- optional fields remain optional
- `expectedDate` retains the expected format
- locations use the existing value format
- transfer assets conform to the existing asset type
- the API payload conforms to the actual backend contract

Run the relevant TypeScript check after implementation and fix only errors caused by this change.

## Protect workflow-managed fields

The update form must not overwrite transfer
