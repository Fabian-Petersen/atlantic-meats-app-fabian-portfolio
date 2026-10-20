Status = `Pending`

Investigate and fix performance stuttering when opening and closing sidebars in the React application.

Focus specifically on sidebars such as:

- Comments sidebar
- Notification sidebar
- Chat sidebar
- Any other slide-in panels using the same pattern

## Problem

When a sidebar is opened or closed on localhost, the animation is noticeably jerky/stuttery.

The issue is especially visible when opening the comments sidebar.

Do not assume this is caused by Vite or localhost itself. Trace the render and animation path first.

## Investigation

Inspect:

- The component that owns the sidebar `open` state
- The sidebar component itself
- Parent components that re-render when sidebar state changes
- Data-fetching hooks triggered when the sidebar opens
- TanStack Query usage
- Large tables/forms/charts on the same page
- Expensive `.map()`, `.filter()`, `.sort()` or derived-data operations
- `useEffect` calls triggered by the open state
- Image rendering
- Context providers whose values change when the sidebar opens
- Tailwind/CSS animation classes
- Backdrop/overlay rendering
- `console.log` calls occurring during render or state changes

## Rendering investigation

Determine which components re-render when the sidebar `open` state changes.

Look for cases where a state change like:

```tsx
setCommentsOpen(true);
```

causes a large page component to re-render, including unrelated components such as:

- tables
- charts
- forms
- image galleries
- filters
- job data
- other sidebars

Identify expensive render work and explain why it is being repeated.

Do not blindly add `useMemo`, `useCallback`, or `React.memo`.

Only add memoisation where the render path shows it is useful.

## Animation investigation

Check whether the sidebar uses layout-triggering properties such as:

```css
width
height
left
right
margin
padding
```

for animation.

Prefer compositor-friendly animation using:

```css
transform
opacity
```

For example:

```tsx
className={`
  fixed right-0 top-0 h-full w-96
  transform transition-transform duration-300
  ${open ? "translate-x-0" : "translate-x-full"}
`}
```

rather than animating width or `right`.

Also check for expensive effects such as:

```text
backdrop-blur
large shadows
multiple overlays
filter
drop-shadow
```

Test whether these contribute to repaint cost.

## Mounting behaviour

Determine whether the sidebar is conditionally mounted:

```tsx
{
  open && <CommentsSidebar />;
}
```

If heavy initialization occurs when mounted, consider keeping the sidebar mounted and controlling visibility through transform/opacity instead.

For example:

```tsx
<CommentsSidebar open={open} />
```

with:

```text
translate-x-full
translate-x-0
```

This should only be changed if profiling shows mount cost is contributing to the stutter.

## Data fetching

Check whether opening the sidebar triggers API calls.

If comments or related data are fetched on open:

- verify whether this blocks or competes with the animation;
- check whether the request causes large state updates;
- determine whether data can be prefetched or fetched independently;
- ensure loading state changes do not unnecessarily re-render the whole page.

Do not remove required fetching behaviour.

## Development vs production

Compare:

```bash
npm run dev
```

against:

```bash
npm run build
npm run preview
```

Determine whether the problem only exists in React development mode or whether it also affects production.

Do not dismiss the problem merely because development mode is slower.

## Deliverables

Provide:

1. The exact cause or causes of the sidebar stutter.
2. The component render path when the sidebar opens.
3. Any unnecessary re-renders identified.
4. Any expensive CSS/layout operations identified.
5. Files changed.
6. Code changes made.
7. Why each change improves performance.
8. Whether production mode behaves differently.
9. A short verification checklist.

Do not modify unrelated components or application behaviour.
