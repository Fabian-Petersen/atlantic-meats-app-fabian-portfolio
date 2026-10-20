Status = `Partial Complete`

# Maintenance Cost YTD — Fix Technician Chart and Drilldown

## Status

The previous implementation is only partially correct.

The **Admin Maintenance Cost YTD chart now works correctly and must be treated as the reference implementation**.

The remaining issue is specifically the `maintenance` / technician user.

Do not redesign the admin chart and do not create a separate technician chart implementation.

The technician must have the **exact same chart hierarchy, drilldown behaviour, labels, tooltips, currency formatting, and navigation behaviour as Admin**.

The only difference is the dataset the technician is authorised to see.

---

# Required behaviour

## Admin

Admin sees maintenance costs for all authorised jobs across all locations.

The working hierarchy is:

```text
Location
    -> Month
        -> Job
```

This existing Admin behaviour must remain unchanged.

Example top-level Admin response:

```json
[
  {
    "name": "middestad mall",
    "code": "MSM",
    "value": 0
  },
  {
    "name": "distribution centre",
    "code": "DCN",
    "value": 7095
  },
  {
    "name": "central services",
    "code": "CTS",
    "value": 5000
  },
  {
    "name": "maitland",
    "code": "VTR",
    "value": 55296
  },
  {
    "name": "khayelitsha",
    "code": "IKH",
    "value": 0
  },
  {
    "name": "golden acre",
    "code": "GAC",
    "value": 1950
  },
  {
    "name": "bellville",
    "code": "BTX",
    "value": 13165
  },
  {
    "name": "wynberg",
    "code": "WBG",
    "value": 0
  },
  {
    "name": "phillipi",
    "code": "PHP",
    "value": 0
  },
  {
    "name": "atlantic meat store",
    "code": "AMS",
    "value": 0
  }
]
```

When a location is selected, Admin receives the monthly breakdown:

```json
[
  {
    "name": "Jan",
    "value": 0
  },
  {
    "name": "Feb",
    "value": 0
  },
  {
    "name": "Mar",
    "value": 0
  },
  {
    "name": "Apr",
    "value": 0
  },
  {
    "name": "May",
    "value": 34325
  },
  {
    "name": "Jun",
    "value": 1595
  },
  {
    "name": "Jul",
    "value": 0
  },
  {
    "name": "Aug",
    "value": 3056
  },
  {
    "name": "Sep",
    "value": 8540
  },
  {
    "name": "Oct",
    "value": 7780
  },
  {
    "name": "Nov",
    "value": 0
  },
  {
    "name": "Dec",
    "value": 0
  }
]
```

When a month is selected, Admin receives the individual jobs:

```json
{
  "May": [
    {
      "name": "RT-0006",
      "value": 3795
    },
    {
      "name": "RT-0006",
      "value": 4795
    },
    {
      "name": "RT-0006",
      "value": 10150
    },
    {
      "name": "RT-0208",
      "value": 4795
    },
    {
      "name": "RT-0036",
      "value": 3295
    },
    {
      "name": "RT-0025",
      "value": 2400
    },
    {
      "name": "RT-0040",
      "value": 2500
    },
    {
      "name": "RT-0024",
      "value": 2595
    }
  ]
}
```

This Admin flow currently works correctly.

Use it as the reference implementation.

---

# Technician current incorrect behaviour

The technician currently receives this at the initial chart level:

```json
[
  {
    "name": "Jan",
    "value": 0
  },
  {
    "name": "Feb",
    "value": 0
  },
  {
    "name": "Mar",
    "value": 0
  },
  {
    "name": "Apr",
    "value": 0
  },
  {
    "name": "May",
    "value": 0
  },
  {
    "name": "Jun",
    "value": 0
  },
  {
    "name": "Jul",
    "value": 0
  },
  {
    "name": "Aug",
    "value": 0
  },
  {
    "name": "Sep",
    "value": 0
  },
  {
    "name": "Oct",
    "value": 5000
  },
  {
    "name": "Nov",
    "value": 0
  },
  {
    "name": "Dec",
    "value": 0
  }
]
```

This is incorrect.

The technician is starting at the **month level**, whereas Admin starts at the **location level**.

The first technician drilldown then returns:

```json
[
  {
    "name": null,
    "value": 5000
  }
]
```

This is also incorrect.

It causes:

- no meaningful X-axis label
- incorrect drilldown hierarchy
- broken/missing drilldown presentation
- tooltip/popover behaviour differing from Admin
- missing currency formatting in the popup/tooltip

Do not patch `name: null` in React.

Find why the backend/aggregation returns the wrong technician structure.

---

# Correct Technician behaviour

A technician must use the exact same hierarchy as Admin:

```text
Location
    -> Month
        -> Job
```

The difference is only which jobs are included.

Technician scope must be:

```python
job["assign_to_sub"] == claims["sub"]
```

or the equivalent existing repository field.

The technician must NOT be restricted using:

```text
userLocation
location from users table
home/base location
frontend supplied technician sub
```

A technician may work at multiple locations.

Therefore the technician's top-level data must contain the locations where the technician's assigned jobs contribute maintenance cost.

For example, if the authenticated technician has:

```text
sub = abc-123
```

and has assigned jobs at:

```text
DCN -> R2,000
CTS -> R5,000
GAC -> R1,500
VTR -> R4,000
```

the technician top-level chart should follow the Admin data contract:

```json
[
  {
    "name": "distribution centre",
    "code": "DCN",
    "value": 2000
  },
  {
    "name": "central services",
    "code": "CTS",
    "value": 5000
  },
  {
    "name": "golden acre",
    "code": "GAC",
    "value": 1500
  },
  {
    "name": "maitland",
    "code": "VTR",
    "value": 4000
  }
]
```

If the existing Admin implementation intentionally returns locations with zero values as well, preserve that exact behaviour for technician data rather than introducing a new contract.

The important requirement is:

```text
Same response shape as Admin
+
Same drilldown hierarchy as Admin
+
Technician-scoped jobs only
```

---

# Location codes on X-axis

For the **top-level location chart**, display the location `code` on the X-axis rather than the full location `name`.

For example:

```text
MSM
DCN
CTS
VTR
IKH
GAC
BTX
WBG
PHP
AMS
```

Do this for Admin and Technician wherever the same top-level location chart is rendered.

Do NOT replace the underlying location identity with the code.

Keep both:

```json
{
  "name": "distribution centre",
  "code": "DCN",
  "value": 7095
}
```

Use:

```text
code
```

for the compact X-axis label.

Continue using the full location name where appropriate for:

- tooltips
- headings
- breadcrumb/drilldown context
- accessibility
- internal filtering

The chart does not have sufficient horizontal space for the full location names.

---

# Technician drilldown

When the technician clicks a location such as:

```text
CTS
```

the next level must show the monthly costs for **that technician's jobs at Central Services only**.

For example:

```json
[
  {
    "name": "Jan",
    "value": 0
  },
  {
    "name": "Feb",
    "value": 0
  },
  {
    "name": "Mar",
    "value": 0
  },
  {
    "name": "Apr",
    "value": 0
  },
  {
    "name": "May",
    "value": 0
  },
  {
    "name": "Jun",
    "value": 0
  },
  {
    "name": "Jul",
    "value": 0
  },
  {
    "name": "Aug",
    "value": 0
  },
  {
    "name": "Sep",
    "value": 0
  },
  {
    "name": "Oct",
    "value": 5000
  },
  {
    "name": "Nov",
    "value": 0
  },
  {
    "name": "Dec",
    "value": 0
  }
]
```

Then clicking:

```text
Oct
```

must show the individual technician jobs contributing to that R5,000 at that location/month.

For example:

```json
{
  "Oct": [
    {
      "name": "RT-0123",
      "value": 2000
    },
    {
      "name": "RT-0145",
      "value": 3000
    }
  ]
}
```

The actual job identifier must use the same field Admin currently uses.

Do not invent a different job identifier for technicians.

---

# Important filtering rule across drilldown levels

Technician filtering must remain active through every drilldown.

Conceptually:

```text
Top level:
all jobs where assign_to_sub == authenticated sub
    -> aggregate by location

Location selected:
jobs where:
    assign_to_sub == authenticated sub
    AND location == selected location
    -> aggregate by month

Month selected:
jobs where:
    assign_to_sub == authenticated sub
    AND location == selected location
    AND job date belongs to selected month/year
    -> return individual jobs
```

At no stage may selecting a location accidentally expose costs belonging to another technician.

---

# Investigate the incorrect technician response

Trace the backend code responsible for choosing the aggregation level based on user group.

Specifically determine why:

```json
[
  {
    "name": "Oct",
    "value": 5000
  }
]
```

is being returned as the technician's initial dataset instead of a location-level dataset.

Also determine why the subsequent technician response contains:

```json
{
  "name": null,
  "value": 5000
}
```

A `null` category label is not an acceptable response for this chart.

Inspect whether the technician code path is:

- skipping location aggregation
- passing the wrong drilldown parameter
- looking for a location field that does not exist on the action record
- aggregating action records before resolving their maintenance request
- using `userLocation` instead of each job's location
- using the wrong property name for location
- interpreting technician top-level data as month-level data
- passing month names into logic expecting locations
- using different response mapping code from Admin unnecessarily

Follow the data from the maintenance request to the maintenance action if costs and assignment/location information live in different DynamoDB tables.

Do not assume `assign_to_sub` or `location` exists on the maintenance-action record unless confirmed by the repository.

Resolve job ownership/location through the existing request/action relationship where necessary.

---

# Reuse the working Admin implementation

This is important.

Do not maintain two completely independent drilldown implementations such as:

```text
admin -> location -> month -> jobs
maintenance -> month -> location -> jobs
```

That is not required.

Prefer a common aggregation/drilldown pipeline:

```text
determine authorised jobs
        ↓
aggregate authorised jobs by location
        ↓
selected location
        ↓
aggregate by month
        ↓
selected month
        ↓
return contributing jobs
```

The access scope should be determined first:

```text
admin
    -> all authorised jobs

maintenance
    -> jobs where assign_to_sub == claims["sub"]

manager/user
    -> jobs belonging to authenticated user's location
```

After scope is established, reuse the same location/month/job aggregation logic wherever possible.

---

# Tooltip and currency formatting

The technician chart must use the same value formatting as Admin.

All maintenance cost values displayed in:

- chart tooltip
- popup
- drilldown tooltip
- job level
- location level
- month level

must use the existing Admin currency formatter.

For example:

```text
R5,000
R7,095
R55,296
```

Do not create a technician-specific formatter.

Find why technician drilldown currently does not receive/use the same currency formatting path.

If formatting is currently conditional on an Admin-specific chart state, refactor the condition so Maintenance Cost data uses the same formatter regardless of whether the authenticated group is `admin` or `maintenance`.

Do not change formatting for unrelated charts.

---

# X-axis behaviour

Expected labels:

## Location level

Use:

```text
code
```

Examples:

```text
DCN
CTS
VTR
GAC
```

## Month level

Use:

```text
Jan
Feb
Mar
...
Dec
```

## Job level

Use the same job identifier as Admin, for example:

```text
RT-0006
RT-0208
RT-0036
```

There must never be:

```text
null
undefined
""
```

as an X-axis category for valid returned data.

---

# Do not fix this only in the frontend

Do not do something such as:

```ts
name: item.name ?? "Unknown";
```

to hide the problem.

Do not convert the technician monthly response into fake locations client-side.

Do not fetch unrestricted Admin data and filter it in React.

The backend must return the correct authorised dataset and correct drilldown structure.

The frontend should consume the same response contract for Admin and Technician wherever possible.

---

# Preserve Manager/User behaviour

Manager and standard user access remains location scoped.

Do not change their authorisation model as part of this fix.

Their data must continue to be restricted using their authenticated stored location.

---

# Security requirements

Use Cognito claims as the source of truth.

Technician ownership must come from:

```python
claims["sub"]
```

The frontend must not send:

```text
technicianSub
assign_to_sub
user sub
```

for determining authorisation.

The backend must derive this itself.

A technician must not be able to obtain another technician's costs by manipulating:

- location
- query parameters
- path parameters
- request body

Selected location/month parameters may control drilldown only within the technician's already authorised job set.

---

# Expected final architecture

The desired logic is conceptually:

```python
if group == "admin":
    authorised_jobs = all_jobs

elif group == "maintenance":
    authorised_jobs = [
        job
        for job in all_jobs
        if job.get("assign_to_sub") == claims["sub"]
    ]

else:
    authorised_jobs = jobs_for_authenticated_user_location
```

Then:

```text
no drilldown selected
    -> aggregate authorised_jobs by location

location selected
    -> filter authorised_jobs by location
    -> aggregate by month

location + month selected
    -> filter authorised_jobs by location and month
    -> return job costs
```

Adapt this to the existing DynamoDB/index architecture rather than blindly scanning tables if efficient queries/helpers already exist.

---

# Acceptance criteria

The task is complete only when all of the following are true.

### Admin

```text
Location -> Month -> Job
```

continues to work exactly as before.

### Technician

```text
Location -> Month -> Job
```

now works exactly like Admin.

Technician top-level data is no longer:

```text
Jan, Feb, Mar ... Dec
```

It is location data.

### Technician scope

Only jobs assigned to:

```text
claims["sub"]
```

contribute to any technician values.

Jobs assigned to another technician do not contribute.

### Multi-site technician

If the technician has jobs at:

```text
DCN
CTS
GAC
VTR
```

all applicable locations appear in their top-level Maintenance Cost YTD chart.

The technician's home location does not restrict the result.

### Location label

Top-level X-axis uses:

```text
code
```

rather than the full location name.

### Drilldown labels

No valid technician drilldown response contains:

```json
{
  "name": null
}
```

### Currency

Technician cost tooltips/popups show the same Rand formatting as Admin.

Example:

```text
R5,000
```

not:

```text
5000
```

### Security

Frontend does not send technician `sub`.

Backend derives it from authenticated Cognito claims.

---

# Implementation constraints

- Follow `AGENTS.md`.
- Preserve the current working Admin implementation.
- Prefer the smallest correct change.
- Reuse the Admin chart/drilldown logic.
- Do not duplicate an entire technician-specific implementation.
- Do not introduce a new endpoint unless genuinely required.
- Do not change the maintenance-cost calculation formula unless an independent calculation bug is found.
- Do not modify Maintenance Jobs YTD.
- Do not modify unrelated dashboard charts.
- Do not add dependencies.
- Do not perform broad unrelated refactors.
- Do not expose Admin/global data to technicians.
- Do not mask backend `null` values in React instead of fixing their source.

---

# Validation

Test these exact flows.

## Admin

```text
Maintenance Cost YTD
-> click VTR
-> monthly chart
-> click May
-> individual jobs
```

Confirm existing behaviour remains correct.

## Technician

Use a technician with jobs at more than one location.

Expected:

```text
Maintenance Cost YTD
-> location codes on initial chart
-> click location
-> Jan-Dec monthly breakdown
-> click month
-> individual technician jobs
```

Verify that the sum of the technician location totals equals the authorised technician's YTD maintenance cost.

Verify that the monthly total for a selected location equals the sum of the jobs displayed beneath that location/month.

Verify that another technician's jobs are excluded even if they occur at the same location.

Verify:

```text
X-axis location = location code
X-axis month = month abbreviation
X-axis job = job identifier
tooltip value = Rand currency
```

There must be no `null` X-axis categories.

Run the minimum appropriate frontend/backend checks after implementation.

---

# Final response

After completing the change, report:

1. Why technician top-level data was returning months instead of locations.
2. Why the technician drilldown returned `"name": null`.
3. Whether the problem originated in backend aggregation, frontend drilldown state, or both.
4. Backend files changed.
5. Frontend files changed.
6. How technician filtering now uses `claims["sub"]`.
7. How the shared Location -> Month -> Job flow is now used for Admin and Technician.
8. How location `code` is used for the X-axis while retaining the full location name.
9. How currency formatting was corrected for technician tooltips/popups.
10. Confirmation that Manager/User scope was not changed.
11. Confirmation that the maintenance-cost calculation formula itself was not changed, unless a separate calculation bug was identified.
12. Validation commands run and their results.

Task 2:
The technician month drilldown chart is almost 100% correct. The problem is handling `No Barcode` jobs.

- The chart show no Asset ID which is correct, however if the assetID is missing use a placeholder "No Barcode" instead of showing a blank x label.
- The popups for the bars overflow with large text, ensure the popup width always fit to content.
- The popup must also use a placeholder if the repair has no barcode ID instead of showing e.g. `No Barcode:R5000` and `RT-5000:R5000` if there is a valid ID.
