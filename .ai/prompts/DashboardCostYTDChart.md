Investigate and update the `MaintenanceCost` / Maintenance Cost YTD chart so that cost data is scoped correctly according to the authenticated user's group.

## Context

The Maintenance Cost YTD chart displays maintenance costs for jobs.

The current behaviour is incorrect for users in the `maintenance` technician group.

Currently, a technician sees maintenance costs based on the location where the technician is assigned/based.

This is incorrect because a technician may complete jobs across multiple locations.

For example:

```text
Technician home location:
Distribution Centre

Jobs worked on:
Distribution Centre
Central Services
Golden Acre
Maitland
```

The technician's Maintenance Cost YTD chart must include the costs from **all jobs assigned to that technician**, regardless of which location those jobs belong to.

The backend must determine technician ownership using the authenticated Cognito user's `sub`.

Do not use the technician's `userLocation` to determine their Maintenance Cost YTD data.

## Required investigation

Trace the complete data flow for the Maintenance Cost YTD chart before making changes.

Inspect, as applicable:

- the `MaintenanceCost` chart/container component
- its parent dashboard component
- the hook used to retrieve maintenance cost data
- the corresponding API route
- the backend Lambda/function supplying maintenance cost metrics
- dashboard schemas/types
- authenticated user/group handling
- any existing cost aggregation helper
- any existing `location` filtering
- how job assignment is represented, particularly `assign_to_sub`
- how completed job costs are calculated

Identify exactly where technician data is currently being restricted using the technician's location.

Do not patch the frontend by combining unrelated datasets. Correct the access/filtering logic at the appropriate backend/data-source level.

## Required access behaviour

The Maintenance Cost YTD data must follow these rules.

### Admin

Admin must see maintenance costs for **all jobs across all locations**.

Admin access must not be restricted by:

```text
location
technician sub
```

The existing admin drilldown/filter behaviour should remain functional unless it is directly responsible for the issue.

Example:

```text
Maintenance Cost YTD — 2026

Maitland              R25,000
Bellville             R18,000
Central Services      R14,000
Golden Acre           R9,000
Distribution Centre   R12,000
```

Admin represents the complete maintenance cost picture.

### Technician / `maintenance`

A user belonging to the `maintenance` group must see the costs associated with **all jobs assigned to that technician**.

Determine technician ownership using:

```python
claims["sub"]
```

matched against the job assignment field, expected to be:

```python
assign_to_sub
```

or the existing equivalent field in the repository.

The technician must NOT be filtered by their stored/home location.

For example, if:

```text
Technician:
sub = abc-123

Home location:
Distribution Centre
```

and the technician completed jobs at:

```text
Distribution Centre   R2,000
Central Services      R1,500
Golden Acre           R3,000
Maitland               R4,000
```

their Maintenance Cost YTD must represent:

```text
R10,500
```

or the equivalent monthly/location breakdown expected by the existing chart.

It must NOT return only:

```text
Distribution Centre   R2,000
```

simply because that is the technician's assigned user location.

The technician may work across any location.

Therefore:

```text
maintenance group
    -> filter by assign_to_sub / authenticated sub
    -> DO NOT filter by userLocation
```

### Manager / User

Manager and standard user access must remain location-based.

They must see maintenance costs only for their assigned location.

For example:

```text
Manager location:
Maitland
```

The Maintenance Cost YTD data must contain costs relating only to Maitland jobs.

The backend should enforce the location using the authenticated user's stored location.

Do not rely solely on a location supplied by the frontend for access control.

## Required backend access model

Where practical, use a clear three-scope model:

```text
admin
    -> all jobs

maintenance
    -> jobs where assign_to_sub == claims["sub"]

manager / user / other location-scoped groups
    -> jobs where location == authenticated user's location
```

The authenticated Cognito claims must be the source of truth.

The frontend must NOT send a technician's `sub` for access-control purposes.

Do not allow a technician to request another technician's costs by changing a frontend/query-string parameter.

## Cost calculation

Preserve the existing definition of maintenance cost.

Do not change which cost fields are included unless investigation shows that the current calculation itself is incorrect.

If maintenance cost currently consists of fields such as:

```text
parts
sundries
contractor cost
other existing job/action costs
```

continue using the existing calculation.

This task is primarily about **which jobs contribute to the cost aggregation**, not redefining maintenance cost.

## Technician aggregation

Technician cost must be calculated from jobs/actions associated with jobs assigned to that technician.

Be careful if the cost information is stored in a different DynamoDB table from the maintenance request.

For example, if:

```text
maintenance-request
    -> contains assign_to_sub, location, status, action_id

maintenance-action
    -> contains parts / sundries / contractor / total cost
```

then ensure technician access is resolved from the job/request assignment before aggregating the corresponding action costs.

Do not assume the action record itself contains `assign_to_sub` unless the repository confirms this.

Reuse existing IDs/relationships between maintenance requests and maintenance actions rather than duplicating assignment information unnecessarily.

## Chart behaviour

Preserve the current Maintenance Cost YTD visualisation unless a small change is required to represent technician data correctly.

The chart must represent:

```text
Admin:
    all authorised maintenance costs

Technician:
    costs for jobs assigned to that technician across all sites

Manager/User:
    costs for their assigned location
```

### Technician chart title

The technician's top-level chart title must not imply that the data belongs to their home location.

For example, avoid:

```text
Distribution Centre — Maintenance Cost YTD
```

when that dataset includes jobs from multiple sites.

Prefer the existing generic heading or an equivalent such as:

```text
My Maintenance Cost YTD
```

If the existing chart is already simply:

```text
Maintenance Cost YTD
```

it may remain unchanged.

Do not make unnecessary title/styling changes.

## Frontend responsibilities

The frontend should primarily display the authorised data returned by the backend.

It may use the user's group to determine presentation/drilldown behaviour where necessary.

However:

- do not use `userLocation` to filter technician cost data
- do not send technician `sub`
- do not reproduce backend authorisation logic in React
- do not fetch all costs and filter sensitive data client-side

The backend must return only data the authenticated user is authorised to see.

## Preserve existing architecture

Prefer the smallest correct change.

Reuse existing:

- cost aggregation functions
- hooks
- API routes
- DynamoDB queries
- dashboard schemas
- chart components
- user claims helpers
- loading states
- empty states
- year selectors
- drilldown behaviour

Do not introduce a new API endpoint if the current Maintenance Cost endpoint can be safely extended to support the correct access scopes.

Do not duplicate cost calculations if an existing helper already calculates them correctly.

## Important constraints

- Do not modify unrelated dashboard functionality.
- Do not modify Maintenance Jobs YTD as part of this task unless shared code genuinely requires it.
- Do not change styling unless necessary for correct group-specific display.
- Do not refactor unrelated code.
- Do not add new dependencies.
- Do not change maintenance cost calculation rules without identifying a real bug.
- Do not expose unrestricted cost data to the frontend and filter it there.
- Do not pass technician `sub` from React.
- Use authenticated Cognito claims on the backend.
- Follow existing repository patterns.
- Follow `AGENTS.md`.
- Avoid expensive or broad testing where unnecessary.

## Validation

Verify at minimum the following cases.

### 1. Admin

Given jobs with costs across multiple sites:

```text
Maitland
Bellville
Golden Acre
Central Services
```

Admin sees all applicable maintenance costs.

### 2. Technician

Given:

```text
Technician sub:
abc-123

Technician home location:
Distribution Centre
```

and jobs assigned to `abc-123` at:

```text
Distribution Centre
Central Services
Golden Acre
Maitland
```

the technician's Maintenance Cost YTD includes costs from **all four locations**.

The technician must not be restricted to Distribution Centre.

### 3. Different technician

Jobs assigned to another technician:

```text
assign_to_sub = xyz-789
```

must NOT contribute to technician `abc-123`'s cost totals.

This applies even if both technicians work at the same location.

### 4. Manager/User

A manager/user assigned to:

```text
Maitland
```

must see only Maitland maintenance costs.

They must not receive costs from another location.

### 5. Frontend

Confirm that technician cost requests are no longer scoped using `userLocation`.

Confirm that the frontend does not send the technician's `sub`.

## Testing

Run only the minimum appropriate checks.

For frontend changes:

```bash
npm run lint
```

Run:

```bash
npm run build
```

only if TypeScript/shared-type changes make it appropriate.

For backend Python changes, perform lightweight syntax/static validation appropriate to the repository.

Do not run broad or expensive test suites unless required.

## Final response

After implementing the change, report:

1. the root cause of technicians being restricted to their home location
2. the backend files changed
3. any frontend files changed
4. how the authenticated group/sub is now used
5. how maintenance cost scope now behaves for:
   - admin
   - maintenance technician
   - manager/user
6. whether the actual cost-calculation formula was changed
7. validation commands run and their results
