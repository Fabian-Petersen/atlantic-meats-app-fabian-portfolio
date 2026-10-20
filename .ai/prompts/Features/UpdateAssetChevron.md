Status: `Complete`
Update all instances of the asset chevron/expandable asset section so that they are **closed/collapsed by default** when the component or form first renders.

Goal:
Reduce the initial vertical space used by forms. Users should explicitly open an asset section if they want to view or edit that asset.

Requirements:

- Find every place in the frontend where an asset section/card/row uses an accordion, collapsible panel, disclosure component, or similar expand/collapse behaviour e.g. "Update Maintenance Request dialog", "CreateAssetForm", "CreateJobForm", "TransferAssetForm" etc.
- Change the default state so every asset section starts **collapsed/closed**.
- Do not automatically expand the first asset.
- Do not automatically expand newly rendered asset sections unless existing functionality explicitly requires it for an error or validation workflow.
- Users must click the chevron/header to open an asset section.
- Preserve all existing asset data, form fields, validation, image handling, add/remove behaviour, and submission logic.
- Do not remove or alter the chevron itself.
- Preserve the existing open/close animation and styling where applicable.
- If multiple assets are rendered, they should all initially appear collapsed.
- Apply this consistently everywhere the shared asset component is used. Prefer changing the shared component/default state rather than patching every page individually, if the application architecture allows it.
- Check for state such as:

```ts
useState(true);
```

or default accordion values such as:

```tsx
defaultOpen
defaultValue={...}
```

and update them so the initial state is closed.

Examples:

```ts
const [isOpen, setIsOpen] = useState(false);
```

instead of:

```ts
const [isOpen, setIsOpen] = useState(true);
```

For arrays of expanded asset indexes/IDs, the initial value should be empty, for example:

```ts
const [expandedAssets, setExpandedAssets] = useState<string[]>([]);
```

or:

```ts
const [expandedAssets, setExpandedAssets] = useState<number[]>([]);
```

Do not change the user interaction after initial render: once the user clicks the chevron, the asset section should open and close normally.

Also check forms where assets are dynamically added. A newly added asset should follow the same collapsed-by-default behaviour unless opening it is required for the user to enter mandatory data.

Make the smallest clean change possible and avoid duplicating state logic.

After implementation, report:

1. Which files/components were changed.
2. Whether there is a shared asset chevron/accordion component.
3. What default state/value was changed.
4. Whether all usages now start collapsed.
