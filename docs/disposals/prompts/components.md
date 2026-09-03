# Asset Disposals — Frontend Components

Create the frontend **components for the Asset Disposals feature**.

Use `README_ASSET_DISPOSALS.md` as the primary functional reference and inspect the existing **Transfers** implementation as the architectural and UI reference.

The disposal pages and `disposalsSchemas.ts` should already exist from the previous implementation. Review those files before creating the components.

## 1. Create the disposal components directory

Create:

`/src/components/disposals/`

All components that are specific to the Asset Disposals feature must be created inside this directory.

Do not place disposal-specific components in existing shared component directories.

The goal is to keep **Disposals as a self-contained feature**.

## 2. Use Transfers as the implementation reference

Inspect the existing transfer components and supporting implementation under:

`/src/components/transfers/`

Also inspect any transfer-specific hooks, helpers, field configurations, and utilities used by:

`/src/pages/transfers/`

Use these as the reference for how the Disposal components should be structured and interact with the existing application.

Pay particular attention to existing transfer functionality for:

- multiple asset handling
- adding/removing assets
- collapsible asset sections
- automatically opening a newly added asset
- closing previously expanded assets where applicable
- asset selection
- dependent asset fields
- duplicate asset validation
- DynamicForm integration
- React Hook Form integration
- field arrays
- file/image inputs
- loading states
- disabled states
- form validation errors
- responsive/mobile behaviour
- form action placement
- helper functions
- reusable field configuration
- TypeScript typing

Reuse the same architectural patterns where they are applicable.

Do not simply copy Transfer components and rename them. Review the disposal requirements and adapt the implementation appropriately.

## 3. Disposal components

Create the components required by the existing disposal pages.

Determine the appropriate component structure by reviewing:

- `README_ASSET_DISPOSALS.md`
- `/src/pages/disposals/`
- `/src/schemas/disposalsSchemas.ts`
- `/src/components/transfers/`
- `/src/pages/transfers/`
- the backend disposal payload structure, particularly `postDisposals`

Components should be separated logically in the same manner as the Transfers implementation.

For example, if Transfers separates:

- request-level fields
- asset-level fields
- asset field arrays
- form actions
- display components
- helper functionality

then follow the same pattern for Disposals where appropriate.

## 4. Component location rule

Any component created specifically for disposals must live under:

`/src/components/disposals/`

For example:

```text
src/
├── components/
│   ├── transfers/
│   └── disposals/
│       ├── ...
│       └── ...
│
├── pages/
│   └── disposals/
│
└── schemas/
    └── disposalsSchemas.ts
```

Existing genuinely shared components such as `DynamicForm`, generic inputs, buttons, dialogs, and layout components may be imported and reused.

Do not duplicate generic shared components inside `disposals/`.

## 5. Helpers and feature-specific logic

Inspect the Transfers implementation for helper functions and supporting functionality used by its components.

Where a helper is specific to the Disposal workflow, create the equivalent helper within the Disposal feature structure.

Do not modify an existing Transfer helper to make it support Disposals.

Do not move existing Transfer functionality into shared code as part of this task.

If you identify functionality that should eventually become shared between Transfers and Disposals, document it in your final summary rather than refactoring it now.

## 6. Form and schema integration

The components must use the existing:

`/src/schemas/disposalsSchemas.ts`

The component types should derive from the Zod schemas wherever the existing project architecture supports this.

Ensure nested paths used by React Hook Form correctly correspond to the disposal schema, particularly for:

`assets[index]`

and any nested asset-level fields.

Avoid `any` unless there is no reasonable typed alternative.

## 7. Multiple assets

The Disposal components must correctly support multiple assets according to the disposal schema.

Use the Transfers implementation as the UX reference.

Where applicable, users should be able to:

- add an asset
- remove an asset
- expand/collapse an asset
- edit each asset independently
- select assets using the existing asset selection patterns
- see validation errors for the correct asset
- prevent invalid duplicate asset selections where required

Keep the form manageable when many assets are added, particularly on mobile.

## 8. Disposal-specific fields

Do not assume Disposal asset fields are identical to Transfer asset fields.

Use `README_ASSET_DISPOSALS.md`, `disposalsSchemas.ts`, and the backend implementation to determine the required disposal fields.

Ensure the UI correctly represents disposal-specific information such as disposal reason, disposal method, asset condition/issues, supporting images/files, or other fields defined by the disposal workflow.

Use existing project input components wherever possible.

## 9. Update the disposal pages

Update files under:

`/src/pages/disposals/`

as necessary to use the newly created Disposal components.

Do not modify pages outside the Disposal feature.

The pages should primarily orchestrate the feature while the disposal-specific form/component logic should live under:

`/src/components/disposals/`

## 10. Scope restrictions

For this task, modifications are allowed only within:

- `/src/components/disposals/`
- `/src/pages/disposals/`

Do not modify:

- Transfer files
- Maintenance files
- Asset files
- existing shared components
- existing shared hooks
- existing shared utilities
- existing schemas
- routing
- backend code

If an existing shared component or utility must be changed for the Disposal implementation to work correctly, **do not change it**.

Instead:

1. Complete as much of the Disposal implementation as possible.
2. Document the required shared change.
3. Explain why it is required.
4. Identify the exact file that would need modification.

This can be handled as a separate task.

## 11. Preserve existing architecture

Do not introduce a new frontend architecture.

Follow the established patterns already used by Transfers and the rest of the application for:

- file naming
- component naming
- imports
- hooks
- TypeScript types
- React Hook Form
- Zod
- Tailwind styling
- generic form components
- error handling
- loading states

Keep the implementation consistent with the existing codebase.

## 12. Verification

After implementation:

1. Run the project's TypeScript/type-check command.
2. Run linting if an existing lint command is available.
3. Fix errors caused by the newly created Disposal files.
4. Do not fix unrelated existing project errors as part of this task.

## Final report

Provide a concise implementation summary containing:

- files created
- files modified
- purpose of each new Disposal component
- Transfer components/helpers used as references
- existing shared components reused
- disposal-specific helpers created
- how multiple assets are handled
- how the components integrate with `disposalsSchemas.ts`
- any assumptions made
- any existing shared functionality that should potentially be refactored later

Do not make those suggested refactors as part of this task.
