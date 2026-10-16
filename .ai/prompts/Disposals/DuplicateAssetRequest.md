Update the frontend handling for disposal-request creation so that when the backend returns a duplicate disposal response, the user sees a clear and meaningful error message.

## Objective

When the disposal POST request returns:

```http
409 Conflict
```

because an asset already exists in another disposal request, display a user-friendly message using the **existing error modal/component already used by this feature or application**.

Do not introduce a new modal, toast system, alert component, or error-handling pattern unless the current implementation makes reuse impossible.

If reuse is genuinely impossible, explain why before making that change.

## Backend response

Inspect the actual backend response currently returned for duplicate disposal requests.

It may contain fields such as:

```json
{
  "message": "A disposal request already exists for this asset",
  "assetID": "ASSET-001",
  "serialNumber": "ABC123",
  "existingDisposalId": "..."
}
```

The response may contain:

- `assetID`
- `serialNumber`
- both
- only one of them

Do not assume both fields are always present.

Use the actual response structure already returned by the backend.

## Required user message

For a `409` duplicate-disposal response, show a meaningful message telling the user:

1. A disposal request already exists for the asset.
2. Identify the asset using the available identifier:
   - `assetID`, or
   - serial number, or
   - both if both exist.
3. Tell the user that they should either:
   - cancel the existing disposal request if it is no longer required, or
   - select another asset.

Examples of acceptable messaging:

If only `assetID` exists:

```text
A disposal request already exists for asset ASSET-001.

Please cancel the existing disposal request if it is no longer required, or select another asset.
```

If only serial number exists:

```text
A disposal request already exists for the asset with serial number ABC123.

Please cancel the existing disposal request if it is no longer required, or select another asset.
```

If both exist:

```text
A disposal request already exists for asset ASSET-001 with serial number ABC123.

Please cancel the existing disposal request if it is no longer required, or select another asset.
```

Do not display:

- raw JSON;
- `[object Object]`;
- generic `"Request failed with status code 409"`;
- raw Axios error text;
- DynamoDB or backend implementation details.

## Existing error modal

Inspect the disposal-request frontend flow and identify the existing error modal/component currently used for failed submissions.

Reuse that component and its existing state-management pattern.

Do not:

- create a second error modal;
- introduce a new toast library;
- replace the application's general error-handling architecture;
- change unrelated modal behaviour.

Only add the minimum logic necessary to convert the backend `409` response into the meaningful user-facing message.

## Error handling

Preserve all existing error behaviour for other HTTP statuses.

Only add special handling for the duplicate-disposal `409` response.

Conceptually:

```ts
if (status === 409) {
  // build meaningful duplicate-asset message
} else {
  // preserve existing error handling
}
```

Use the project's existing Axios/API error typing and helper functions where available.

Do not weaken TypeScript typing with unnecessary `any`.

## Identifier handling

Build the message defensively.

Examples:

```ts
const assetID = error.response;
```

Task 2:

Currently the modal redirect the user and the information in the form is lost.

Can the user be informed and given the opportunity to edit the details without losing the information? The Error mondal can maube have options retry, cancel which reset the form and retry allow user to update the details
