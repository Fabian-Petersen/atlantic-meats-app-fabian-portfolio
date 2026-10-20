Investigate and fix the disposal-update request payload in the frontend.

The PUT request to updateDisposalById currently fails with HTTP 400:

{
"message": "Each deleted_image_keys value must be a string"
}

The actual API Gateway event body contains:

{
"description": "DISPOSAL-TEST-20261016-03",
"disposalReason": "sell",
"location": "central services",
"expectedDisposalDate": "2026-10-22",
"assets": [
{
"assetIndex": 0,
"assetID": "100056",
"area": "workstation",
"equipment": "Laptop",
"assetIssueReason": "",
"assetIssueDetails": "",
"images": []
}
],
"deleted_image_keys": [null]
}

The backend contract requires `deleted_image_keys` to be an array containing only non-empty S3 key strings:

{
"deleted_image_keys": [
"disposals/<disposal-id>/assets/0/images/<filename>"
]
}

When no images are being deleted, the frontend must send:

{
"deleted_image_keys": []
}

Tasks:

1. Find where the disposal PUT request and `deleted_image_keys` are constructed.
2. Identify why the array contains `null`. In JavaScript, this may happen when an `undefined` value inside an array is passed to `JSON.stringify`.
3. Fix the source logic so deleted images are converted to their S3 `key` values.
4. Support deleted-image state containing either key strings or image metadata objects with a `key` property, if both forms occur in the application.
5. Remove `null`, `undefined`, empty strings, and values that are not strings.
6. Trim keys and remove duplicates.
7. Ensure the final request always contains `deleted_image_keys: string[]`.
8. Do not change the backend or weaken backend validation.
9. Add or update focused frontend tests covering:
   - no deleted images produces `[]`;
   - `[null]` produces `[]`;
   - an image object produces its `key`;
   - an existing key string is retained;
   - malformed values are excluded;
   - duplicate keys are removed.
10. Run the relevant tests and report the files changed and results.

Before editing, inspect the existing types, state shape, API client, and project conventions. Reuse an existing request mapper or utility if one exists rather than introducing duplicate logic.
