# AGENTS.md

## Repository overview

This is a Vite single-page React application for Atlantic Meats operational workflows: dashboard, maintenance jobs, assets and verification, asset transfers, stock, users, comments, and notifications. It talks to an AWS-backed API and uses Amazon Cognito through AWS Amplify for authentication.

## Commands

```bash
npm install
npm ci            # Clean, lockfile-based install used by CI
npm run dev       # Vite development server
npm run lint      # ESLint over .ts/.tsx files
npm run build     # Type-check with tsc -b, then create dist/
npm run preview   # Serve the production build
```

There is no test script or test framework configured in `package.json`.

## Stack and application composition

- TypeScript (strict, no unused locals/parameters) with React 19 and Vite.
- React Router DOM defines all routes in `src/App.tsx`; `main.tsx` installs the provider tree: React Query, `AuthProvider`, `BrowserRouter`, `AppProvider`, and Sonner.
- Tailwind CSS v4 is imported from `src/index.css`, with project tokens in `tailwind.config.ts`. `components.json` configures shadcn-style UI components in `src/components/ui` and the `@/` alias.
- Forms use React Hook Form plus Zod and `zodResolver`. Shared config-driven forms live in `src/components/forms/DynamicForm.tsx`; field configurations live in `src/components/forms/configs/`.
- Server state is primarily handled with TanStack React Query. `src/utils/api.ts` provides reusable query/mutation hooks and typed API route/redirect unions; `src/hooks/useFormSubmit.ts` composes form submission, optional image compression, presigned-URL uploads, and success/error callbacks.
- `src/utils/apiClient.ts` is the authenticated Axios client used by the generic API hooks. Direct `fetch` is intentionally used for S3 presigned-URL uploads, and a few older helpers/actions use Axios directly.
- Cognito configuration is in `aws/amplifyConfig.ts`. The application code requires `VITE_COGNITO_USERPOOL_ID`, `VITE_COGNITO_CLIENT_ID`, and `VITE_SITE_URL`; do not commit `.env` files.

## Layout and code organization

- `src/pages/` contains route-level screens, grouped by domain (`assets`, `jobs`, `transfers`, `users`, `stocks`).
- `src/components/` contains domain components, shared feature components, tables, dialogs, dashboard/chart UI, and separate responsive mobile components under `components/mobile/`.
- `customComponents/` holds form primitives used by `DynamicForm`.
- `src/schemas/` defines the Zod request/response schemas and their inferred types; shared exports are available from `@/schemas`.
- `src/hooks/` and `src/customHooks/` contain domain and UI hooks. `src/lib/` contains shared helpers/configuration; `src/utils/` includes API, AWS auth helpers, and utility functions.
- `src/context/AppProvider.tsx` owns cross-cutting UI state (theme, sidebars, dialogs, global feedback, table actions). Use it for existing global UI flows rather than duplicating that state locally.

## Routing, auth, and authorization

- Public routes are `/` and `/forgot-password`. Authenticated application routes are nested under `ProtectedRoute` and `AppLayout`.
- `RoleGaurdRoute` (the existing filename/export spelling) protects roles from Cognito groups. The application uses `admin`, `manager`, `user`, `maintenance`, and `contractor` groups. Keep new routes aligned with the established guard structure in `src/App.tsx`.
- `AppLayout` supplies the navbar, dashboard sidebar, modal manager, chat/notification sidebars, success/error overlays, and route outlet. Asset verification is intentionally a full-screen route outside that layout.

## Implementation patterns and constraints

- Prefer the `@/` alias for imports within `src`; it resolves to `src` in Vite and TypeScript.
- Forms commonly pair a Zod schema with `zodResolver`; use the corresponding inferred types. The create/edit forms that upload files use `useFormSubmit`, which sends metadata first and then uploads files to backend-supplied presigned URLs.
- For requests handled through `src/utils/api.ts`, use the existing generic hooks (`useGetAll`, `useById`, `usePOST`, `useUpdateItem`, `useDeleteItem`) and supply the query key that the mutation should invalidate. Their `Resource` type constrains supported backend paths.
- `apiClient` attaches the Cognito bearer token and signs out on a 401. Use it for new authenticated API calls unless the request is intentionally a presigned upload or has a different existing flow.
- For config-driven forms, use typed `DynamicFormField<T>` definitions. `DynamicForm` owns a `<form>` by default; when it is embedded inside another form (as in the transfer form with `useFieldArray`), use `renderFieldsOnly` to avoid nested forms.
- Desktop and mobile variants coexist for several list/detail flows; check `src/components/mobile/` before changing a responsive feature.
- Keep React Query's existing defaults in mind: focus and reconnect refetching are disabled, while mount refetching is enabled.

## Repository-specific caveats

- `README.md` describes the product and AWS deployment context. `README_ASSET_TRANSFER.md` and `README_ASSET_DISPOSAL.md` contain design material as well as explicit open questions and future enhancements; verify behavior in source code before implementing from those sections.
- GitHub Actions deploys `main` using Node 24: it runs `npm ci`, builds, syncs `dist/` to S3, and invalidates CloudFront. The workflow currently supplies `VITE_PUBLIC_API_URL`, whereas `apiClient.ts` reads `VITE_SITE_URL`; resolve that discrepancy deliberately when changing deployment or API configuration.
- The Axios 401 interceptor redirects to `/login`, while the public login route is `/`; preserve or correct that inconsistency deliberately rather than assuming the routes match.
- `asset-import/` is a separate Python/DynamoDB import utility. Its scripts write directly to configured/hard-coded DynamoDB tables and should not be run or changed as part of frontend work without explicit scope and AWS credentials.
- `dist/` is build output. Preserve unrelated worktree changes.
