Status = `Complete`

Investigate and fix performance stuttering when opening and closing modals in the React application.

Treat this as a separate task from the sidebar investigation.

## Problem

Modals visibly stutter or hesitate when opening and closing on localhost.

The problem appears across multiple modal implementations, so investigate whether there is a shared rendering, overlay, portal, animation, or parent-state issue.

## Investigation

Locate all major modal implementations and identify whether they:

- use a shared modal component;
- use Radix/shadcn-style dialogs;
- use React portals;
- are manually rendered;
- share overlay/backdrop classes;
- share animation utilities.

Inspect:

- state controlling modal visibility;
- modal parent components;
- dialog content;
- backdrop/overlay;
- portal usage;
- data-fetching triggered when opening;
- forms mounted inside the modal;
- React Hook Form initialization;
- Zod validation;
- large select lists;
- image components;
- tables;
- API hooks;
- expensive derived data.

## Render path

Trace what re-renders when a modal opens.

For example, determine whether:

```tsx
setModalOpen(true);
```

causes the entire page to re-render.

Pay particular attention to pages containing:

- GenericTable
- large asset/job arrays
- filters
- dashboard charts
- React Hook Form forms
- ImageGallery
- TanStack Table
- Recharts

Identify unrelated expensive components that re-render during modal interaction.

Do not blindly memoise the application.

Use `React.memo`, `useMemo`, and `useCallback` only where profiling or code inspection demonstrates unnecessary repeated work.

## Modal mount cost

Check whether modal contents are only mounted when opened:

```tsx
{
  open && <Modal />;
}
```

and whether opening causes expensive initialization such as:

- React Hook Form setup;
- schema parsing;
- transforming large datasets;
- building select options;
- loading images;
- fetching API data.

If mount cost is substantial, determine whether some data/preparation can occur earlier or independently from the animation.

Do not keep every modal permanently mounted unless there is a clear performance benefit.

## Animation and CSS

Inspect animation properties.

Prefer:

```text
transform
opacity
```

over:

```text
width
height
top
left
right
margin
padding
```

for animated transitions.

Inspect overlay classes for expensive effects such as:

```text
backdrop-blur
blur
filter
large box-shadow
drop-shadow
```

A full-screen blurred backdrop can cause large repaint costs.

Test whether removing or reducing such effects significantly improves performance.

Preserve the current visual design where possible.

## Portals and DOM placement

Verify whether modals are rendered through a portal.

If they are rendered deeply inside complex page layouts instead of at the document root, determine whether DOM structure or stacking/layout recalculation contributes to the problem.

Do not introduce a portal unless it improves the current implementation and is compatible with existing behaviour.

## Form-specific checks

For modals containing React Hook Form:

Check whether opening the modal performs expensive:

```tsx
reset(...)
setValue(...)
watch(...)
trigger(...)
```

operations.

Also inspect `watch()` usage that may subscribe the whole form to every field change.

Where appropriate, prefer scoped field subscriptions rather than making the entire form re-render.

Check whether Zod validation is running unnecessarily during modal initialization.

## Network and query behaviour

Determine whether opening a modal triggers:

- TanStack Query requests;
- asset lookups;
- user lookups;
- location/equipment loading;
- comments;
- images;
- job details.

Ensure network activity does not unnecessarily block or compete with the open animation.

## Development vs production

Compare behaviour under:

```bash
npm run dev
```

and:

```bash
npm run build
npm run preview
```

Document whether React development mode makes the issue worse.

The final fix should still target real unnecessary rendering or expensive CSS where present.

## Deliverables

Provide:

1. Modal implementations investigated.
2. Exact causes of modal stuttering.
3. Components that unnecessarily re-render.
4. Expensive mount-time work identified.
5. Expensive CSS/overlay effects identified.
6. Files changed.
7. Code changes made.
8. Before/after reasoning for each optimization.
9. Whether development and production differ.
10. A verification checklist.

Do not redesign the modal system unless the existing architecture itself is clearly responsible for the performance problem.
