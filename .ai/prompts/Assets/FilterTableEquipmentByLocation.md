Investigate the Assets Register table filters for **Location** and **Equipment** and implement dependent filtering between them.

## Current Behaviour

The Assets Register Table "/assets/list" currently has at least two table filters:

- `Location`
- `Equipment`

When a user selects a Location, the table correctly filters the assets by that location.

However, the **Equipment filter still displays the full equipment list**, including equipment that does not exist at the selected location.

## Required Behaviour

Update the filtering logic so that the **Equipment filter options depend on the selected Location**.

### Expected behaviour

1. If no Location is selected:
   - Equipment should display the complete list of available equipment.
   - Existing filtering behaviour should remain unchanged.

2. If a Location is selected:
   - Filter the Assets table by that Location as it currently does.
   - The Equipment dropdown must only contain equipment that exists within the selected Location.

Example:

If `phillipi` contains:

- Forklift
- Printer
- Laptop

Then after selecting `phillipi`, the Equipment filter should only show:

- Forklift
- Printer
- Laptop

Equipment belonging only to other locations must not appear.

3. If the Location filter is cleared:
   - Restore the complete Equipment options list.
   - The table should return to the normal unfiltered/location-independent state.

4. If an Equipment value is already selected and the user changes the Location to one where that equipment does not exist:
   - Clear/reset the Equipment selection automatically.
   - Do not leave an invalid Equipment filter applied.

## Investigation

Before making changes, inspect the current implementation and determine:

- Where the Location and Equipment filter options are generated.
- Whether they come from:
  - the assets API response,
  - table faceted values,
  - a helper/hook such as `useAssetFilters`,
  - separate API requests,
  - or hardcoded/generated option arrays.
- How TanStack Table filtering is currently implemented.
- Whether there is already reusable location → equipment filtering logic elsewhere in the Assets module.

Prefer extending existing filtering utilities/hooks rather than introducing duplicate filtering logic.

## Preferred Implementation

Where practical, derive the available equipment from the asset data using logic equivalent to:

```ts
const availableEquipment = selectedLocation
  ? assets
      .filter((asset) => asset.location === selectedLocation)
      .map((asset) => asset.equipment)
  : assets.map((asset) => asset.equipment);
```

Then remove duplicates and invalid/empty values.

The implementation does not need to follow this exact structure if the existing architecture already provides a cleaner solution.

## Important

Filtering comparisons must follow the application's existing handling of location/equipment values, including any lowercase/normalisation logic already used by the Assets module.

Do not introduce title-case conversions or new data transformations unless the existing implementation specifically requires them.

## Guardrails

- Limit changes to the Assets Register filtering functionality.
- Do not refactor unrelated table components.
- Do not modify backend/Lambda code unless investigation proves the frontend does not have enough data to implement this correctly.
- Reuse existing hooks/helpers where possible.
- Do not add a new API request if the current assets dataset already contains the required Location and Equipment values.
- Do not change the existing Location filtering behaviour.
- Ensure other Assets table filters continue working.
- Avoid changing shared components in a way that could affect other tables.
- Do not perform a full project build unless required.
- Use targeted type checking/tests for the files changed.

## Validation

Verify the following scenarios:

1. No Location selected → all Equipment options are available.
2. Select Location A → only Equipment belonging to Location A is available.
3. Select Equipment → table filters correctly by both Location and Equipment.
4. Clear Location → full Equipment list becomes available again.
5. Change from Location A to Location B while an incompatible Equipment value is selected → Equipment selection is cleared.
6. Locations/equipment with duplicate asset records only appear once in the dropdown.
7. Empty/null Equipment values are not displayed as filter options.

First inspect the current implementation, identify the relevant files and existing filtering flow, then make the smallest safe change required to implement this behaviour.
