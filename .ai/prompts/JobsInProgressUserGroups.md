Status: `partial complete`

Task 1:
Update the maintenance in progress jobs table so that normal users can view their jobs, but only the maintenance group can see the `Action` actions.

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
  - Must NOT see `Action`.

- `maintenance` group:
  - Can view jobs.
  - Can see and use `Action`.

Use the existing authenticated `user` state/context. Do not call `useGetUser()` again inside the table or action component.

Create a permission variable such as:

```ts
const canApproveOrReject = user?.group?.toLowerCase() === "maintenance";
```

Then use it only around the `Action` action item:

```tsx
{
  canApproveOrReject && <>{/* existing Action action */}</>;
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
Remove the "Action Job" button when the group is anything other than "maintenance"

- The user must be able to view the job when selecting a job in progress from the table or the card for mobile.
- The "Action Job" button for users can be replaced with "update" and "delete" options in the view page.
- The rest of the page can remain as is that is show the details, images and other metadata of the request.
- The groups other than "maintenance" cannot "action" the request in progress.

- Maintain the button styling for the rest of the app using sharedStyles. The current button "Action Job" styling is not consitent with the app. The size of the button can remain the same. **_`Not Completed`_**

- The edit and delete button styling for the other groups must also comply to the app theme, ignore if it complies already.

Important:

- Keep the implementation only to the component necessary to make this change.
- Keep testing to a minimum, only to the affected components or related components impacted by the change.
- Do not do a full test and build test for the basic styling changes.
