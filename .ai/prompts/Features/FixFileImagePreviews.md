status = `Pending`

# Fix broken local image previews in FileInput

Investigate and fix newly selected images displaying as broken thumbnails in `UpdateDisposalForm`.

## Known finding

The issue appears to originate in:

`customComponents/FileInput.tsx`

`SelectedImagePreview` currently creates an object URL during render using `useMemo`:

```tsx
const previewUrl = useMemo(() => URL.createObjectURL(file), [file]);
```

Review the object URL lifecycle and correct the preview behaviour so newly selected local images display correctly.

## Scope

Primary file:

```text
customComponents/FileInput.tsx
```

Only inspect other files if necessary to understand how `FileInput` is consumed.

Do **not** modify `UpdateDisposalForm` or other consuming components unless the issue cannot be fixed safely inside `FileInput.tsx`.

If another file genuinely requires a change, stop and explain why before modifying it.

## Compatibility guardrail

`FileInput` is a shared component.

Before making the change, inspect its usages sufficiently to confirm that the fix will not change its existing public API or expected behaviour.

Do not:

- rename props
- add required props
- remove existing props
- change returned file data structures
- change upload behaviour
- change validation behaviour
- change existing-image handling
- refactor unrelated FileInput logic

The objective is only to fix local preview rendering and correctly manage any object URLs created for `File` objects.

## Implementation guardrails

Prefer the smallest possible change.

If using `URL.createObjectURL`, ensure object URLs are cleaned up using the appropriate React lifecycle mechanism such as `useEffect`.

Do not introduce:

- new dependencies
- new packages
- new components unless strictly necessary
- broad refactoring
- styling changes
- formatting changes outside the affected code
- unrelated TypeScript improvements
- unrelated lint fixes

Preserve all existing behaviour except for the broken local preview.

## Testing restrictions

Do **not** run a full application build.

Specifically, do not run:

```text
npm run build
npm build
vite build
tsc --build
npx tsc --build
```

Do not run the entire test suite.

Do not run repository-wide linting.

Testing must be limited to the smallest reasonable checks related to this change.

Allowed checks include:

- inspecting TypeScript/React correctness of the modified component
- running an existing targeted test specifically for `FileInput`, if one already exists
- running a targeted lint/type check against the modified file only, if the repository already supports this

Do not create new tests unless they are required to validate this specific bug.

## Repository guardrails

Do not:

- inspect the entire repository unnecessarily
- search unrelated directories
- modify package files
- modify lock files
- modify configuration files
- modify generated files
- modify API/backend code
- change routing
- change forms unrelated to this preview issue

Limit repository exploration to `FileInput.tsx` and the minimum number of consuming components required to confirm compatibility.

## Expected result

After the fix:

1. Newly selected `File` images render correctly as thumbnails.
2. Existing remote/server images continue working unchanged.
3. Object URLs are not leaked.
4. Replacing or removing a selected file does not leave stale preview URLs.
5. Existing `FileInput` consumers remain compatible.
6. No public API of `FileInput` changes.

## Completion response

When finished, return only:

1. Root cause.
2. File(s) changed.
3. Exact change made.
4. Compatibility impact.
5. Targeted validation performed.
6. Confirmation that no full build or full test suite was run.

Do not perform additional cleanup or improvements after the requested fix is complete.
