# Investigate and Implement Assets Register Filter State Persistence

Investigate and update the **Assets Register table filters** so that the user's current filter selections are preserved while navigating between the Assets Register and asset-related pages.

## Expected Behaviour

The Assets Register should remember the user's current table filter state when they navigate to an asset and then return to the register.

For example:

1. User opens the Assets Register.
2. User selects filters such as:
   - Location = `Maitland`
   - Area = a specific area
   - Equipment = a specific equipment type
   - Verification status or other existing filters
   - Search value, if applicable
3. User opens an asset from the filtered table.
4. User navigates to:
   - Asset Details
   - Asset History
   - Verification History
   - or another asset-related page.
5. When the user returns to the Assets Register, the previous filters should still be applied.

The user should not have to reselect the location, area, equipment, or other filters each time they inspect an asset.

## State Lifetime

The filter state should only persist while the user remains within the **Assets workflow/module**.

The stored Assets Register filter state should be cleared when the user deliberately navigates away from the Assets area to an unrelated application section.

Examples where the state should be cleared:

- Dashboard
- Users
- Jobs
- Transfers
- Disposals
- Other unrelated top-level application modules

Therefore:

`Assets Register → Asset Details → Asset History → Assets Register`

should preserve the filters.

But:

`Assets Register → Dashboard → Assets Register`

should start with the default/cleared filter state.

## Investigation

Before making changes:

1. Locate the Assets Register table and identify:
   - Where the filter values are currently stored.
   - Whether they use local component state, URL search parameters, context, Zustand, Redux, router state, or another state mechanism.
   - How the Assets Register component is mounted/unmounted during navigation.
   - How navigation occurs between the register, asset details, and asset history pages.
   - Whether there is already an application-level or Assets-level state mechanism that can be reused.

2. Identify all existing Assets Register filters, including where applicable:
   - Location
   - Area
   - Equipment
   - Verification status
   - Search
   - Other current table filters
   - Pagination/sorting if these are logically part of the table state.

3. Determine the smallest appropriate mechanism for preserving this state without introducing unnecessary global state.

4. Check how the application can reliably distinguish between:
   - navigation within the Assets module; and
   - navigation away from the Assets module.

## Required Implementation

Implement state persistence so that the Assets Register remembers the user's filter selections while navigating within asset-related routes.

For example:

`/assets`
→ `/assets/:id`
→ asset history/verification related routes
→ `/assets`

should restore the previous Assets Register state.

The implementation should preserve the existing dependencies between filters.

For example, if:

`Location = Maitland`

causes the Equipment filter to only show equipment available at Maitland, restoring the state must maintain that same behaviour.

## Clearing the State

When the user navigates from the Assets module to an unrelated top-level module, clear the stored Assets Register state.

Do not clear the state simply because the Assets Register component unmounts.

The clearing logic should be based on leaving the Assets workflow rather than individual component lifecycle events.

Avoid brittle logic based on individual buttons if the router/navigation structure provides a cleaner way to determine whether the user has left `/assets` related routes.

## Important Considerations

Investigate whether the state should include:

- Selected location
- Selected area
- Selected equipment
- Verification filter
- Search query
- Sorting
- Current page/page size

Only persist values that are part of the existing Assets Register browsing experience.

Do not add new filters or change existing filtering behaviour as part of this task.

## Important Guardrails

- Do not redesign the Assets Register.
- Do not change backend APIs.
- Do not introduce a new state-management dependency solely for this feature.
- Reuse the application's existing state/router patterns where practical.
- Do not store the filter state permanently in `localStorage` unless there is a clear existing application pattern requiring it.
- The state should not survive unrelated navigation when the expected behaviour is to reset it.
- Do not change existing location/equipment dependent filtering behaviour.
- Do not modify unrelated modules.
- Do not perform broad refactoring.
- Keep the implementation narrowly scoped to Assets Register navigation state.
- Do not run a full application build.
- Only run targeted tests/checks relevant to the files changed.

Before editing, report:

1. How the Assets Register filters are currently managed.
2. Why they are currently lost during navigation.
3. The proposed state persistence mechanism.
4. How the implementation will detect leaving the Assets module and clear the state.
5. The files/functions that need to change.

After implementation, briefly report:

- What was changed.
- Which table state is preserved.
- When the state is cleared.
- Any targeted tests/checks performed.
