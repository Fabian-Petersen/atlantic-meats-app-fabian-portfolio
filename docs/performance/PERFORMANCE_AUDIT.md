## Updated production audit

The previous TypeScript errors are resolved. The repository is clean at commit `5d91573`, and `npm run build` now succeeds.

However, several production risks remain.

### Build results

- `npm run build`: **Passed**
- `npm run lint`: **Failed — 2 errors, 14 warnings**
- JavaScript bundle: **2,154 kB minified / 628.58 kB gzip**
- CSS bundle: **145.58 kB / 23.48 kB gzip**
- Vite reports the JavaScript chunk exceeds its 500 kB warning threshold.
- 3,955 modules are transformed during the build.
- Four CSS optimizer warnings originate from the `::picker(select)::-webkit-scrollbar` selectors in [index.css](<C:/Users/user/Documents/Atlantic Meat/frontend/atlantic-meats-app-fabian-portfolio/src/index.css:134>).

## Findings

### 1. Critical: Production API environment-variable conflict remains

The deployment workflow provides `VITE_PUBLIC_API_URL`:

[deploy.yml](<C:/Users/user/Documents/Atlantic Meat/frontend/atlantic-meats-app-fabian-portfolio/.github/workflows/deploy.yml:7>)

Axios reads `VITE_SITE_URL`:

[apiClient.ts](<C:/Users/user/Documents/Atlantic Meat/frontend/atlantic-meats-app-fabian-portfolio/src/utils/apiClient.ts:6>)

Unless `VITE_SITE_URL` is supplied through an untracked production mechanism, deployed API requests will use an undefined base URL. Standardize the variable and validate it during the CI build.

### 2. Critical: Invalid `/login` redirects remain

The application’s public login route is `/`, but two places navigate to `/login`:

- [apiClient.ts](<C:/Users/user/Documents/Atlantic Meat/frontend/atlantic-meats-app-fabian-portfolio/src/utils/apiClient.ts:31>)
- [LoginButton.tsx](<C:/Users/user/Documents/Atlantic Meat/frontend/atlantic-meats-app-fabian-portfolio/src/components/login/LoginButton.tsx:22>)

There is no `/login` route in [App.tsx](<C:/Users/user/Documents/Atlantic Meat/frontend/atlantic-meats-app-fabian-portfolio/src/App.tsx:87>). Session expiry could therefore leave users on an unmatched route.

### 3. High: Initial JavaScript bundle remains very large

All route pages are statically imported from [App.tsx](<C:/Users/user/Documents/Atlantic Meat/frontend/atlantic-meats-app-fabian-portfolio/src/App.tsx:5>), producing one 2.15 MB JavaScript chunk.

This affects initial download, JavaScript parsing and execution, particularly on mobile devices.

Recommended correction:

- Lazy-load route components.
- Split dashboard charts, barcode scanning, admin pages and complex forms.
- Load modal content only when opened.
- Keep React Query Devtools development-only; it is currently unconditional in [main.tsx](<C:/Users/user/Documents/Atlantic Meat/frontend/atlantic-meats-app-fabian-portfolio/src/main.tsx:13>).

### 4. High: Desktop and mobile tables are still processed together

At least nine list pages construct a mobile `useReactTable` instance and also render a separate desktop `TableGeneric`. CSS hiding does not prevent the hidden implementation from performing React and table calculations.

Examples:

- [AssetsOverviewPage.tsx](<C:/Users/user/Documents/Atlantic Meat/frontend/atlantic-meats-app-fabian-portfolio/src/pages/assets/AssetsOverviewPage.tsx:81>)
- [JobsInProgressListPage.tsx](<C:/Users/user/Documents/Atlantic Meat/frontend/atlantic-meats-app-fabian-portfolio/src/pages/jobs/JobsInProgressListPage.tsx:143>)
- [TransfersRequestsListPage.tsx](<C:/Users/user/Documents/Atlantic Meat/frontend/atlantic-meats-app-fabian-portfolio/src/pages/transfers/TransfersRequestsListPage.tsx:109>)
- [UsersListPage.tsx](<C:/Users/user/Documents/Atlantic Meat/frontend/atlantic-meats-app-fabian-portfolio/src/pages/users/UsersListPage.tsx:92>)

Render only the active responsive version or share one table instance.

### 5. High: Large global context causes broad rerenders

[AppProvider.tsx](<C:/Users/user/Documents/Atlantic Meat/frontend/atlantic-meats-app-fabian-portfolio/src/context/AppProvider.tsx:18>) combines theme, searches, users, sidebars, dialogs, selected rows and feedback state. Its provider value is recreated at [line 105](<C:/Users/user/Documents/Atlantic Meat/frontend/atlantic-meats-app-fabian-portfolio/src/context/AppProvider.tsx:105>).

A search-field update can consequently rerender unrelated navigation, modal and sidebar consumers.

Split the provider by domain and memoize values and callbacks.

### 6. High: Query refetching and cache-key fragmentation remain

Queries have zero default `staleTime` and `refetchOnMount: true`:

[main.tsx](<C:/Users/user/Documents/Atlantic Meat/frontend/atlantic-meats-app-fabian-portfolio/src/main.tsx:22>)

Navigation therefore makes cached queries immediately eligible for refetching. Query and invalidation keys also remain inconsistent across assets, jobs, transfers, disposals and comments.

Recommended correction:

- Add resource-appropriate `staleTime` values.
- Establish query-key factories.
- Ensure mutations invalidate list and affected detail keys.
- Include filters, IDs and pagination parameters consistently in keys.

### 7. Medium: Duplicate authentication work remains

Authentication/session information is independently resolved by the auth provider, route guards, sidebar, dashboard and role hooks. Every Axios request also resolves the Cognito token in [apiClient.ts](<C:/Users/user/Documents/Atlantic Meat/frontend/atlantic-meats-app-fabian-portfolio/src/utils/apiClient.ts:13>).

Centralize user groups, role, user ID and session data in the auth provider. Remove the unused group lookup in [Dashboard.tsx](<C:/Users/user/Documents/Atlantic Meat/frontend/atlantic-meats-app-fabian-portfolio/src/pages/Dashboard.tsx:52>).

### 8. Medium: Dependency duplication remains

The bundle includes competing or overlapping dependency families:

- `motion` and `framer-motion`
- Individual Radix packages and the `radix-ui` umbrella package
- `html5-qrcode`, `@zxing/browser` and `@zxing/library`

Application imports mix `motion/react` and `framer-motion`. Standardize one import source and remove confirmed-unused direct dependencies before measuring the bundle again.

### 9. Medium: Client-side table scaling remains

Lists are fetched as complete arrays and filtered, sorted and paginated in the browser. Search filtering runs immediately on every keystroke.

For growing job, asset and history tables, introduce:

- Backend pagination
- Backend filtering/sorting
- Debounced search
- Row virtualization where necessary

### 10. Medium: Duplicate route remains

`/jobs/:id/complete` is declared twice under overlapping role guards:

- [App.tsx](<C:/Users/user/Documents/Atlantic Meat/frontend/atlantic-meats-app-fabian-portfolio/src/App.tsx:117>)
- [App.tsx](<C:/Users/user/Documents/Atlantic Meat/frontend/atlantic-meats-app-fabian-portfolio/src/App.tsx:216>)

Consolidate it into one route with the combined allowed roles.

### 11. Medium: Images are not lazily decoded

No active image components use `loading="lazy"` or `decoding="async"`. The gallery loads its main image and thumbnails immediately:

[ImageGallery.tsx](<C:/Users/user/Documents/Atlantic Meat/frontend/atlantic-meats-app-fabian-portfolio/src/components/features/ImageGallery.tsx:56>)

Additionally, `public/images` contains approximately **18 MB** of apparently unused sample photos that are copied into every production deployment.

### 12. Quality gate still fails

Lint reports:

- Error: cascading render warning in [AuthProvider.tsx](<C:/Users/user/Documents/Atlantic Meat/frontend/atlantic-meats-app-fabian-portfolio/src/auth/AuthProvider.tsx:35>)
- Error: mixed component/helper exports in [form.tsx](<C:/Users/user/Documents/Atlantic Meat/frontend/atlantic-meats-app-fabian-portfolio/src/components/ui/form.tsx:159>)
- Missing effect dependencies in [NotificationCard.tsx](<C:/Users/user/Documents/Atlantic Meat/frontend/atlantic-meats-app-fabian-portfolio/src/components/notifications/NotificationCard.tsx:71>) and [AssetVerification.tsx](<C:/Users/user/Documents/Atlantic Meat/frontend/atlantic-meats-app-fabian-portfolio/src/pages/assets/AssetVerification.tsx:76>)
- Ten React Compiler compatibility warnings involving TanStack Table
- One React Hook Form compiler warning

The TanStack warnings are mainly optimization limitations, but the effect dependency warnings could cause stale behavior.

## Recommended release order

1. Correct the API environment variable and `/login` redirects.
2. Make lint pass.
3. Add route-level code splitting.
4. Eliminate double desktop/mobile table processing.
5. Split the global context.
6. Standardize React Query keys and freshness.
7. Consolidate auth/session lookups and dependencies.
8. Add server pagination and image lazy loading.

The successful build resolves the immediate TypeScript blocker, but I would still treat items 1–4 as pre-production priorities.
