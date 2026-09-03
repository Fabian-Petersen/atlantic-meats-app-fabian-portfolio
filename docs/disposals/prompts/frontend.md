Create the frontend files for the **Asset Disposals** feature.

Use `README_ASSET_DISPOSALS.md` as the primary functional reference for the disposal workflow, data structure, statuses, and backend expectations.

Use the existing `/pages/transfers/` implementation as the frontend reference and keep the new disposals feature consistent with the existing project patterns, naming conventions, component structure, form handling, and styling.

Requirements:

1. Create a new feature directory:

`/src/pages/disposals/`

Use `/src/pages/transfers/` as the reference and create the equivalent disposal pages/components required for the disposal workflow.

2. Create the Zod schemas for disposals:

`/src/schemas/disposalsSchemas.ts`

Use the existing schema files in `/src/schemas/` as references for:

- naming conventions
- schema composition
- inferred TypeScript types
- optional/default fields
- File arrays
- status-specific schemas where applicable

The implemetation will be very similar to the transfers modules since it already handles multiple assets selection etc.

3. The frontend schemas and form payloads must match exactly what the backend disposal endpoints expect, especially the existing `postDisposals` Lambda.

Review the backend implementation and `README_ASSET_DISPOSALS.md` before defining the schema. Do not assume the disposal structure is identical to transfers where the backend specification differs.

4. The disposal feature must remain isolated.

Do **not** modify any existing transfer, maintenance, asset, shared form, routing, schema, hook, utility, or other application files at this stage.

Only add:

- files under `/src/pages/disposals/`
- `/src/schemas/disposalsSchemas.ts`

If an existing shared component appears to require modification for disposals to work, do not modify it. Instead, document the required change and continue creating the disposal-specific files as far as possible.

5. Preserve the existing project architecture.

Use the transfers feature as the structural reference, including where applicable:

- page structure
- create form structure
- field hooks/configuration
- React Hook Form usage
- Zod validation
- DynamicForm integration
- asset selection
- multiple-asset handling
- collapsible asset sections
- file/image handling
- form submission patterns
- loading/error states
- TypeScript types

Do not introduce a new architectural pattern unless the disposal requirements cannot be implemented using the existing project conventions.

6. Asset disposals support multiple assets.

Ensure the form and Zod schema support the disposal request structure defined in `README_ASSET_DISPOSALS.md` and expected by `postDisposals`.

Pay particular attention to:

- request-level fields
- asset-level fields
- nested asset arrays
- disposal reasons/methods
- images or supporting files
- required vs optional values
- enum values
- status-related fields

7. Before writing files, inspect:

- `README_ASSET_DISPOSALS.md`
- `/src/pages/transfers/`
- relevant existing schemas in `/src/schemas/`
- the backend `postDisposals` implementation

Then create the disposal files based on those references.

8. Do not refactor unrelated code.

Keep changes minimal and feature-scoped. Existing files should remain untouched.

After implementation, provide a concise summary containing:

- files created
- purpose of each file
- disposal payload structure produced by the frontend
- any assumptions made
- any shared existing code that may need modification later, without modifying it now

Finally, run the appropriate TypeScript/type-checking command if available and report any errors specifically related to the newly created disposal files.

### Corrections

1. Pages
   The pages for /disposals don't seem to be correct. Let's create the pages step by step with the corresponding components.

- Create the CreateDisposalPage.tsx

```jsx
// $ This is the transfer asset request page. The user can create a new request to transfer an asset from one location to a next with approvals.

import { cn } from "@/lib/utils";
import CreateDisposalForm from "@/components/disposals/CreateDisposalForm";
import { sharedStyles } from "@/styles/shared";

const CreateDisposalPage = () => {
  return (
    <div className={cn(sharedStyles.pageContainer)}>
      <div className={cn(sharedStyles.pageContent)}>
        <CreateTransferForm />
      </div>
    </div>
  );
};

export default CreateDisposalPage;
```
