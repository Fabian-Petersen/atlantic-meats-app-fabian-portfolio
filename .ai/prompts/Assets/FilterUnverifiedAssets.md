# Investigate and Fix Assets Register Search for Unverified Assets

Investigate why the **Assets Register table search** does not return all assets with an **unverified** verification status when the user types:

`unverified`

into the table search field.

## Expected Behaviour

The global/table search should allow the user to find assets based on their displayed verification status.

Example:

- The user filters the Assets Register by location **Maitland**.
- The user then searches for `unverified`.
- The table should display **all assets for Maitland that are currently shown as unverified**.

The search should work together with the existing table filters rather than replacing or bypassing them.

## Investigation

Before making changes:

1. Locate the Assets Register table implementation and identify:
   - How the global/table search is implemented.
   - Which fields are included in the searchable data.
   - How verification status is calculated or displayed.
   - Whether `verified` / `unverified` is an actual field in the row data or a derived/display-only value.
   - How the location and equipment filters interact with the search.

2. Determine why typing `unverified` does not match all rows visually displayed as unverified.

3. Check whether the issue is caused by:
   - The verification field not being included in the global search.
   - The displayed status being derived from another field.
   - A custom cell renderer that is not represented in the searchable row value.
   - Search/filter logic only checking selected asset properties.
   - Case sensitivity or value formatting.
   - Pagination/filter ordering causing valid rows to be excluded.

## Required Fix

Implement the smallest appropriate change so that:

- Searching `unverified` returns all assets whose current verification state is unverified.
- Searching `verified` continues to work correctly if applicable.
- Search remains case-insensitive if that is the current behaviour.
- Existing location filtering continues to work.
- Existing equipment filtering continues to work.
- Combined filtering works correctly, for example:

`Location = Maitland` + search `unverified`

should return only unverified Maitland assets.

## Important Guardrails

- Do not redesign or replace the Assets Register table.
- Do not change the backend/API unless investigation proves the required verification information is unavailable to the frontend.
- Do not modify unrelated table filters or components.
- Do not change the meaning or calculation of verification status unless it is currently incorrect.
- Do not introduce a new dependency.
- Reuse the existing table/filter/search architecture.
- Keep the change narrowly scoped to this issue.
- Do not perform broad refactoring.
- Do not run a full application build.
- Only run targeted checks/tests relevant to the modified files.
- Before editing, report the root cause and identify the files/functions that need to change.
- After the change, briefly explain what was changed and why.
