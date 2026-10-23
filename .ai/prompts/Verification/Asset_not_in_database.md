status = `Pending`

# Handle 404 response when verifying an asset

Update the frontend asset verification flow so that when the API returns HTTP `404`, the user receives a clear "Asset not registered in the database" message instead of the current generic error:

"Asset could not be verified, Please try again"

Example backend response:

response: {
'statusCode': 404,
'headers': {
'Content-Type': 'application/json',
'Access-Control-Allow-Origin': '\*',
'Access-Control-Allow-Methods': 'POST,OPTIONS',
'Access-Control-Allow-Headers': 'Content-Type,Authorization'
},
'body': '{"message": "Asset RT-0033 not registered in the database"}'
}

## Required behaviour

When the verify-asset API request returns HTTP status `404`:

- Display a simple user-facing message such as:
  "Asset not found. Please check the Asset ID and try again."

- Do NOT display the current generic message:
  "Asset could not be verified, Please try again"

For all other errors, retain the existing generic error behaviour.

## Implementation guidance

Keep the implementation simple.

Check the HTTP response/error status for `404` in the existing verification error-handling flow.

Use a toast as the current message does with the proper error theme i.e. light red background and dark red text

Example logic:

```ts
if (status === 404) {
  // show "Asset not found" message
} else {
  // existing generic error message
}

Important:
- Do not change any other logic.
- Keep testing minimal and only to the relevant changes
- Do not perform a complete build for the small changes.
```
