# Updated production performance audit

The application now passes its code-quality gates, but it still has several significant production performance and configuration issues.

Audit performed against clean commit `d259135`.

## Current build health

- `npm run lint`: **Passed — zero findings**
- `npm run build`: **Passed**
- JavaScript: **2,154.43 kB minified / 628.66 kB gzip / 501.08 kB Brotli**
- CSS: **143.72 kB / 23.30 kB gzip**
- Modules transformed: **3,955**
- Vite large-chunk warning: **Present**
- CSS optimizer warnings: **4**
- Previous `useReactTable` warnings: **Resolved**

## Must fix before production

### 1. Production API URL mismatch

The deployment workflow supplies:

```text
VITE_PUBLIC_API_URL
```

[deploy.yml](<C:/Users/user/Documents/Atlantic Meat/frontend/atlantic-meats-app-fabian-portfolio/.github/workflows/deploy.yml:7>)

Axios reads:

```text
VITE_SITE_URL
```

[apiClient.ts](<C:/Users/user/Documents/Atlantic Meat/frontend/atlantic-meats-app-fabian-portfolio/src/utils/apiClient.ts:6>)

A local `.env` exists, which explains why local builds can work, but `.env` files are not available in GitHub Actions. The deployed application may therefore have no API base URL.

Fix by standardizing one variable and adding build-time validation that fails when it is missing.

### 2. Invalid `/login` redirect

The registered login route is `/`, but the application redirects to `/login`:

- [apiClient.ts](<C:/Users/user/Documents/Atlantic Meat/frontend/atlantic-meats-app-fabian-portfolio/src/utils/apiClient.ts:31>)
- [LoginButton.tsx](<C:/Users/user/Documents/Atlantic Meat/frontend/atlantic-meats-app-fabian-portfolio/src/components/login/LoginButton.tsx:22>)

A 401 response can therefore send the user to an unmatched route. Either add `/login` or consistently redirect to `/`.

### 3. Initial JavaScript bundle is too large

All pages are eagerly imported from [App.tsx](<C:/Users/user/Documents/Atlantic Meat/frontend/atlantic-meats-app-fabian-portfolio/src/App.tsx:5>), producing one 2.15 MB JavaScript file.

Users downloading the login page also receive code for:

- Dashboard charts
- Barcode scanning
- Admin asset management
- Transfers and disposals
- Job forms
- User management
- Signature and image processing
- Every modal and responsive variant

Fix with `React.lazy()` and dynamic imports. Split at least by route/domain:

- Authentication
- Dashboard
- Jobs
- Assets and barcode scanner
- Transfers
- Disposals
- Users
- Stocks

This is the most important end-user performance improvement.

### 4. Desktop and mobile tables still run simultaneously

The table memoization work prevents unnecessary model rebuilding, but each list page still constructs a mobile `useReactTable` instance and renders a separate desktop `TableGeneric` instance.

Examples:

- [AssetsOverviewPage.tsx](<C:/Users/user/Documents/Atlantic Meat/frontend/atlantic-meats-app-fabian-portfolio/src/pages/assets/AssetsOverviewPage.tsx:90>)
- [JobsInProgressListPage.tsx](<C:/Users/user/Documents/Atlantic Meat/frontend/atlantic-meats-app-fabian-portfolio/src/pages/jobs/JobsInProgressListPage.tsx:156>)
- [TransfersRequestsListPage.tsx](<C:/Users/user/Documents/Atlantic Meat/frontend/atlantic-meats-app-fabian-portfolio/src/pages/transfers/TransfersRequestsListPage.tsx:119>)
- [DisposalRequestsListPage.tsx](<C:/Users/user/Documents/Atlantic Meat/frontend/atlantic-meats-app-fabian-portfolio/src/pages/disposals/DisposalRequestsListPage.tsx:123>)
- [UsersListPage.tsx](<C:/Users/user/Documents/Atlantic Meat/frontend/atlantic-meats-app-fabian-portfolio/src/pages/users/UsersListPage.tsx:90>)

CSS `hidden` only hides DOM output; it does not stop React hooks and table calculations.

Fix by sharing a single table instance between the desktop and mobile renderers, or mounting only the renderer matching the active breakpoint.

## High-priority improvements

### 5. Global context causes widespread rerenders

`useGlobalContext` is referenced in approximately 94 source files. The provider combines search state, theme, users, sidebars, notifications, dialogs, selected rows and feedback into one un-memoized value:

[AppProvider.tsx](<C:/Users/user/Documents/Atlantic Meat/frontend/atlantic-meats-app-fabian-portfolio/src/context/AppProvider.tsx:105>)

Any context state update changes the provider value and rerenders every consumer—even components that use an unrelated field.

Split it into focused providers:

- Theme
- Current user
- Navigation and sidebars
- Modals
- Table actions
- Feedback messages

Memoize each provider value.

### 6. React Query refetches too aggressively

The query client has no active `staleTime` and uses `refetchOnMount: true`:

[main.tsx](<C:/Users/user/Documents/Atlantic Meat/frontend/atlantic-meats-app-fabian-portfolio/src/main.tsx:22>)

Because queries are stale immediately, navigating away and back can trigger repeated API requests.

Suggested starting points:

- Current user and Cognito attributes: 5–15 minutes
- Static form options: 15–60 minutes
- Dashboard metrics: 1–5 minutes
- Workflow lists: 30–60 seconds
- Detail records: 30–60 seconds

Use mutation invalidation for immediate updates.

### 7. Query keys remain inconsistent

Examples include:

- Asset list: `["assets", "list"]`
- Asset deletion: `["assetRequests"]` or `["assets", "asset-elete"]`
- Job list: `["jobs", "pending"]`
- Job deletion: `["jobs", "delete-pending"]`
- User list: `["users", "list"]`
- User update: `["userRequests", "user"]`

Because invalidation uses the supplied key in [api.ts](<C:/Users/user/Documents/Atlantic Meat/frontend/atlantic-meats-app-fabian-portfolio/src/utils/api.ts:237>), many mutations do not invalidate the corresponding list.

Some `useById` callers also put the ID into the supplied key even though `useById` appends it again at [api.ts](<C:/Users/user/Documents/Atlantic Meat/frontend/atlantic-meats-app-fabian-portfolio/src/utils/api.ts:188>).

Create centralized key factories:

```ts
assetKeys.list();
assetKeys.detail(id);
jobKeys.list(status);
jobKeys.detail(id);
transferKeys.list(status);
```

### 8. Tables use client-side pagination

List endpoints fetch full arrays and then paginate, filter and sort in the browser. Page size is only a TanStack Table setting; it is not sent to the API.

This will become progressively slower as asset, job and history records grow.

Add backend pagination with:

- `limit`
- cursor or offset
- sort field and direction
- search/filter parameters

Include those values in the React Query key.

### 9. Authentication state is resolved repeatedly

Cognito session/group information is independently requested by:

- `AuthProvider`
- `RoleGaurdRoute`
- Sidebar
- Dashboard
- `useUserRole`
- Store profile
- Every Axios request

The dashboard call at [Dashboard.tsx](<C:/Users/user/Documents/Atlantic Meat/frontend/atlantic-meats-app-fabian-portfolio/src/pages/Dashboard.tsx:52>) discards its result.

Store user ID, role and groups once in the authentication provider. Remove redundant session lookups. API token access can remain centralized in Axios, but avoid separately resolving the same group information throughout the component tree.

### 10. Notifications can query before the user ID is available

Both notification components query using the same cache key while `userId` may still be `null`:

- [NotificationSidebar.tsx](<C:/Users/user/Documents/Atlantic Meat/frontend/atlantic-meats-app-fabian-portfolio/src/components/notifications/NotificationSidebar.tsx:26>)
- [NotificationButton.tsx](<C:/Users/user/Documents/Atlantic Meat/frontend/atlantic-meats-app-fabian-portfolio/src/components/notifications/NotificationButton.tsx:17>)

The user ID is not part of the query key, and the query is not conditionally enabled.

Use:

```ts
queryKey: ["notifications", userId],
enabled: Boolean(userId),
```

This prevents an unnecessary null-user request and avoids sharing cached notifications between user sessions.

## Medium-priority improvements

### 11. Modal and sidebar code is eagerly bundled

[AppLayout.tsx](<C:/Users/user/Documents/Atlantic Meat/frontend/atlantic-meats-app-fabian-portfolio/src/routes/AppLayout.tsx:4>) statically imports chat, notifications and the complete modal manager. The modal manager then statically imports every dialog even though it normally returns `null`.

Lazy-load large dialog content when the relevant dialog opens.

### 12. Duplicate dependency families remain

The project mixes:

- `motion` and `framer-motion`
- `radix-ui` and individual `@radix-ui/*` packages
- `html5-qrcode`, `@zxing/browser` and `@zxing/library`

No active source imports of the two direct ZXing packages were found. Consolidate Motion imports and remove direct dependencies only after confirming they are not intentionally used by tooling.

Also consider replacing `moment`—used by one formatter—with `Intl.DateTimeFormat` or a small native helper.

### 13. Images load eagerly

No active image element uses `loading="lazy"` or `decoding="async"`.

Affected areas include:

- [ImageGallery.tsx](<C:/Users/user/Documents/Atlantic Meat/frontend/atlantic-meats-app-fabian-portfolio/src/components/features/ImageGallery.tsx:56>)
- Mobile job, transfer and disposal views
- Full-screen image modals
- Avatars

Use lazy loading for below-the-fold thumbnails, explicit dimensions/aspect ratios, and appropriately sized thumbnail URLs rather than loading full-resolution S3 images into small cards.

### 14. Approximately 18 MB of sample images are deployed

`public/images` contains six 2.7–3.5 MB JPEG files with no active application references. They are copied to `dist` and uploaded during every deployment.

They do not affect initial page download unless requested, but they increase deployment time, storage and cache invalidation work. Move them outside `public` or remove them from the production package.

### 15. Duplicate route definition

`/jobs/:id/complete` is declared twice under overlapping role guards:

- [App.tsx](<C:/Users/user/Documents/Atlantic Meat/frontend/atlantic-meats-app-fabian-portfolio/src/App.tsx:117>)
- [App.tsx](<C:/Users/user/Documents/Atlantic Meat/frontend/atlantic-meats-app-fabian-portfolio/src/App.tsx:216>)

Consolidate the route with the complete allowed-role set.

### 16. React Query Devtools is unconditional

[main.tsx](<C:/Users/user/Documents/Atlantic Meat/frontend/atlantic-meats-app-fabian-portfolio/src/main.tsx:13>) imports and renders React Query Devtools for every build.

Make it development-only and dynamically import it.

### 17. CSS optimizer warnings

The four warnings originate from chained customizable-select and WebKit scrollbar selectors:

[index.css](<C:/Users/user/Documents/Atlantic Meat/frontend/atlantic-meats-app-fabian-portfolio/src/index.css:134>)

These do not fail the build, but the affected scrollbar rules may be discarded or behave inconsistently. Separate/remove the unsupported selector combinations and retest the select styling.

## Recommended implementation order

1. Fix the API environment variable and invalid login redirect.
2. Add route-level lazy loading.
3. Stop running separate desktop and mobile table instances.
4. Split the global context.
5. Standardize React Query keys and freshness settings.
6. Add backend pagination.
7. Centralize session, role and group state.
8. Fix notification query identity/enabling.
9. Lazy-load images and modal content.
10. Consolidate dependencies and remove unused public assets.
11. Resolve the duplicate route and CSS warnings.

The application now builds cleanly and its table references are substantially more stable, but the bundle size, duplicated responsive rendering and data/cache architecture are the main remaining performance constraints.
