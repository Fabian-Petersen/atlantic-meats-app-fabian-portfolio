Task 1:
Status: `Complete`
Update the maintenance pending jobs table so that normal users can view their jobs, but only admins can see the `Approve` and `Reject` actions.

The authenticated user is already stored in state:

```ts
const [user, setUser] = useState<UsersAPIResponse | null>(null);
```

The schema contains:

```ts
export const usersResponseSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  family_name: z.string(),
  username: z.string(),
  email_verified: z.string(),
  status: z.string(),
  group: z.string(),
  location: z.string(),
  userCreated: z.string(),
  updatedAt: z.string(),
  mobile: z.string(),
  position: z.string(),
});
```

Therefore, use `user.group` for authorization.

Requirements:

- `user` group:
  - Can view their own jobs.
  - Must NOT see `Approve`.
  - Must NOT see `Reject`.

- `admin` group:
  - Can view jobs.
  - Can see and use `Approve`.
  - Can see and use `Reject`.

Use the existing authenticated `user` state/context. Do not call `useGetUser()` again inside the table or action component.

Create a permission variable such as:

```ts
const canApproveOrReject = user?.group?.toLowerCase() === "admin";
```

Then use it only around the `Approve` and `Reject` action items:

```tsx
{
  canApproveOrReject && (
    <>
      {/* existing Approve action */}
      {/* existing Reject action */}
    </>
  );
}
```

Important:

- Do not disable the buttons for unauthorized users; do not render them at all.
- Do not hide the whole actions column if that column contains other actions that a normal user is allowed to use.
- Preserve existing View, Details, navigation, filtering, and table behaviour.
- Do not change the backend job-fetching logic.
- Do not add duplicate user-fetching logic.
- Reuse the existing application state/provider that exposes `user`.
- Make the smallest clean change necessary.

After implementation, show:

1. Files changed.
2. Where `user` is obtained from.
3. The exact permission condition used.
4. Which action items are now admin-only.

Task 2:
Status: `Complete`
The user must be able to view the pending jobs detail page, currently it is redirected to the dashboard if the user is not admin.

- The user must be able to view the request when selecting a job from the table or the card for mobile.
- The "Reject" or "Approve" options must be replaced with "update" and "delete" options in the view page.
- The rest of the page can remain as is that is show the details, images and other metadata of the request.
- The groups other than admin cannot "approve" or "reject" the request

Important:

- Keep the implementation only to the component necessary to make this change.
- Keep testing to a minimum, only to the affected components or related components impacted by the change.

Task 3:

- Maintain the button styling for the rest of the app using sharedStyles. The current button styling is not consitent with the app.

- The edit and delete button schema for the other groups must also comply to the app theme, ignore if it complies already.

Important:

- Do not do a full test and build test for the basic styling changes.
