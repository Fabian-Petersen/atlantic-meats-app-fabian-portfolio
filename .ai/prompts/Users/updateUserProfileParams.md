status = `Pending`

# Investigate UserAccountProfileForm cache refresh and route ID handling

Investigate and fix the behaviour in:

`src/components/users/UserAccountProfileForm.tsx`

## Issue 1 — Users table does not update after profile changes

After updating a user from `UserAccountProfileForm.tsx`, the Users table does not immediately reflect the changes. The updated values only appear after a full page refresh.

### Tasks

- Check the TanStack Query `queryKey` / `queryKeys` used by:
  - `UserAccountProfileForm.tsx`
  - the Users table/list component
  - the user-by-id query
- Confirm whether the mutation is invalidating the correct query key after a successful update.
- Fix the cache invalidation/refetch so that the Users table immediately displays the updated user data after the mutation succeeds.
- Prefer using the application's existing query-key conventions rather than introducing a new pattern.
- If appropriate, invalidate both:
  - the users list query
  - the individual user query
- Do not use `window.location.reload()` or another full-page refresh as the solution.
- Do not add unnecessary manual state syncing if TanStack Query cache invalidation can handle it correctly.

## Issue 2 — Use route param `id` instead of state-dependent ID

Investigate how `UserAccountProfileForm.tsx` obtains the user ID.

Currently, part of the workflow appears to rely on an ID stored in component/navigation state. If that state is lost, such as after navigation or refresh, the component can remain in a loading state and require another refresh/re-navigation.

### Tasks

- Check whether the route already contains an `:id` parameter.
- Where possible, use the route parameter via `useParams()` as the authoritative user ID.
- Remove unnecessary dependency on an ID stored in local/component/navigation state.
- Ensure the user query can run correctly after:
  - direct navigation to the URL
  - browser refresh
  - React Router state being unavailable
- Make sure the query is only enabled when a valid route ID exists.
- Handle a missing/invalid ID gracefully instead of leaving the component in a permanent loading state.

## Investigation requirements

Before making changes:

1. Inspect the route definition for `UserAccountProfileForm`.
2. Inspect the Users table/list query and its query key.
3. Inspect the user-by-id query.
4. Inspect the update mutation and its `onSuccess` behaviour.
5. Check existing query-key conventions elsewhere in the project and follow the same pattern.

## Expected result

After the fix:

- Updating a user immediately updates the Users table without refreshing the page.
- The individual user query also reflects the latest data.
- Opening or refreshing a URL such as `/users/:id` continues to load the correct user.
- The form no longer depends on transient state for the user ID when the route parameter is available.
- The component does not get stuck indefinitely in a loading state when navigation state is missing.

## Guardrails

- Keep the change narrowly scoped to this issue.
- Do not refactor unrelated user components.
- Do not modify backend APIs unless investigation proves it is required.
- Do not change API request/response structures.
- Reuse existing hooks and query-key patterns where possible.
- Do not add new dependencies.
- Do not run a full production build.
- Only run targeted lint/type checks/tests relevant to the modified files if necessary.
- Report:
  1. the root cause,
  2. files changed,
  3. query keys invalidated,
  4. how the route ID handling was changed,
  5. any remaining concerns.
