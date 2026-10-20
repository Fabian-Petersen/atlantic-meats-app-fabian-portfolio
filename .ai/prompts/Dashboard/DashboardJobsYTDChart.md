Status: `Task 1 - Complete`
Task 1
Investigate and fix the `MaintenanceJobs.tsx` chart so that it displays **job counts by status and store/location**, rather than maintenance cost data.

## Context

`MaintenanceJobs.tsx` is responsible for displaying Maintenance Jobs YTD.

The chart must use the job metrics returned by the backend and behave differently based on the authenticated user's group.

The current issue is that the chart is displaying data such as:

```json
{
  "location": "distribution centre",
  "year": "2026",
  "data": {
    "2026": [
      { "name": "Jan", "value": 0 },
      { "name": "Feb", "value": 0 },
      { "name": "Mar", "value": 0 },
      { "name": "Apr", "value": 0 },
      { "name": "May", "value": 0 },
      { "name": "Jun", "value": 0 },
      { "name": "Jul", "value": 0 },
      { "name": "Aug", "value": 0 },
      { "name": "Sep", "value": 0 },
      { "name": "Oct", "value": 7095 },
      { "name": "Nov", "value": 0 },
      { "name": "Dec", "value": 0 }
    ]
  }
}
```

The value `7095` is clearly cost-related data and is not the correct dataset for this chart.

The correct job-count data is already available. The existing `console.log("technician-jobs", ...)` shows a response such as:

```json
{
  "pending": {
    "2026": []
  },
  "in progress": {
    "2026": []
  },
  "complete": {
    "2026": [
      {
        "name": "central services",
        "code": "CTS",
        "value": 1
      },
      {
        "name": "golden acre",
        "code": "GAC",
        "value": 1
      }
    ]
  },
  "cancelled": {
    "2026": []
  }
}
```

This is the dataset that should drive the Maintenance Jobs YTD chart.

## Required investigation

Trace the data flow used by `MaintenanceJobs.tsx` before making changes.

Specifically inspect:

- `MaintenanceJobs.tsx`
- the hook/hooks used by this component
- the dashboard parent component that passes `data`
- `useStoreJobMetrics`
- any cost-metrics hook that may incorrectly be used by this chart
- the relevant dashboard schemas/types
- `JobsChart`
- the authenticated user/group data used by the dashboard

Identify exactly why the chart is currently receiving or rendering cost data instead of job-count data.

Do not simply patch the displayed value. Fix the incorrect data source or data flow.

## Required behaviour

### Admin

Admin must see:

- all maintenance jobs across all locations
- grouped by location/store
- filtered by selected job status
- filtered by selected year

Example:

```text
Status: Complete
Year: 2026

Central Services    5
Golden Acre         3
Maitland             7
Bellville            2
```

Admin may continue to use the existing site drilldown behaviour if already implemented correctly.

### Technician / `maintenance`

A user in the `maintenance` group must see:

- only jobs assigned to that technician
- assignment filtering is handled by the backend using the authenticated user's `sub`
- jobs may belong to multiple locations
- the frontend must NOT filter technician jobs by `userLocation`
- the frontend must NOT send the technician's `sub` as a query parameter
- the frontend must display whatever authorised technician job data the backend returns
- status and year filtering must still work

Example backend response:

```json
{
  "complete": {
    "2026": [
      {
        "name": "central services",
        "code": "CTS",
        "value": 1
      },
      {
        "name": "golden acre",
        "code": "GAC",
        "value": 1
      }
    ]
  }
}
```

The chart should therefore display:

```text
Central Services    1
Golden Acre         1
```

The technician chart title must NOT imply that the technician belongs to one specific site.

Use an appropriate title such as:

```text
My Completed Jobs YTD
```

or the equivalent that fits the existing chart-heading conventions.

Do not display titles such as:

```text
distribution centre — Completed Jobs 2026
```

for the technician's top-level chart because technicians may have jobs across multiple locations.

### Manager / User

Manager and user groups must see:

- jobs for their assigned location only
- backend remains responsible for enforcing the user's location
- status filtering must work
- year filtering must work

Do not introduce additional client-side access-control logic that attempts to replace backend authorisation.

## Job statuses

The chart must correctly support the existing backend status values:

```text
pending
in progress
complete
cancelled
```

Do not rename backend status values unless there is an actual schema/API mismatch that must be corrected.

The visible UI labels may remain:

```text
Pending
In Progress
Completed
Cancelled
```

## Data requirements

`MaintenanceJobs.tsx` must render values from the job-count dataset:

```ts
data[selectedStatus][selectedYear];
```

or the equivalent existing typed structure.

Each chart item represents:

```ts
{
  name: string;
  code?: string;
  value: number;
}
```

For the top-level Maintenance Jobs YTD chart:

```text
value = number of jobs
```

It must NOT represent:

```text
value = maintenance cost
```

Ensure no store-cost dataset, cost hook, cost selector, or cost drilldown is being accidentally passed to `MaintenanceJobs`.

## Preserve existing architecture

Prefer the smallest correct change.

Reuse existing:

- hooks
- schemas
- chart components
- authenticated-user state
- status selector
- year selector
- loading states
- empty states
- drilldown behaviour

where they are already correct.

Do not duplicate existing API calls if the required job data is already being returned by the dashboard request.

If the top-level dashboard response already contains the correct job data, use that data rather than introducing another unnecessary request.

## Important constraints

- Do not modify backend code as part of this task.
- Assume the backend already returns authorised data according to the authenticated user's group.
- Do not pass `sub` from the frontend for technician filtering.
- Do not implement security/access control solely in React.
- Do not modify unrelated dashboard components.
- Do not modify unrelated hooks.
- Do not change styling unless required to correct the chart title or behaviour.
- Do not refactor unrelated code.
- Do not add new dependencies.
- Do not perform expensive or broad testing unless necessary.
- Follow the repository's existing TypeScript, React, TanStack Query, and component patterns.
- Follow `AGENTS.md`.

## Validation

After implementing the fix, verify at minimum:

1. `admin`
   - sees job counts by location
   - can switch between Pending / In Progress / Completed / Cancelled
   - year selection works

2. `maintenance`
   - sees only the locations/jobs returned by the technician-scoped backend response
   - is not restricted by `userLocation`
   - chart values are job counts
   - title is not tied to one location

3. `manager` / `user`
   - sees data only for their assigned location
   - status and year selection continue to work

4. The value `7095` or other maintenance-cost values no longer appear in the Maintenance Jobs YTD chart unless that genuinely represents a job count.

5. Existing loading, empty-state, status-selector and year-selector behaviour remains functional.

## Testing

Run only the minimum appropriate checks after making the change:

```bash
npm run lint
```

and, if the changes affect TypeScript compilation or shared types:

```bash
npm run build
```

Do not run unrelated or expensive tests.

## Final response

After completing the task, report:

1. the root cause
2. the files changed
3. the key logic changed
4. how behaviour now differs for admin, maintenance, and manager/user
5. the validation commands run and their results

Status = `Task 2 - Pending`
Task 2:
Make the state "completed" the default for the technicians/maintenance groups for "My Jobs YTD" chart. The pending jobs will rarely have data unless the techncian himself requested a job.
