## Assets Transfer Module

### Overview

The Assets Transfer Module provides a controlled process for transferring assets between business units, facilities, departments, or custodians.

The module ensures that all transfers are formally requested, approved, tracked, and acknowledged before the asset record is updated.

The solution is implemented using an event-driven serverless architecture on AWS and integrates with the Asset Management System.

---

### Problem

Prior to implementing the transfer workflow, asset movements could occur without a formal approval process or reliable audit trail.

This introduced several challenges:

- Assets could be moved without authorization.
- There was limited visibility into who requested or approved a transfer.
- Asset locations could become inaccurate.
- No confirmation existed that the receiving party had physically received the asset.
- Auditing and compliance reporting required manual investigation.
  The organization required a process that would provide accountability and traceability throughout the entire transfer lifecycle.

---

### Solution

The Assets Transfer Module introduces a controlled workflow consisting of:

1. Transfer Request Submission
2. Administrative Approval or Rejection
3. Transport Arrangement
4. Transfer Initiation
5. Recipient Acknowledgement
6. Asset Location Update

Every transfer is recorded in the `asset_transfer_table`, creating a complete history of:

- Requestor
- Recipient
- Approver
- Transfer reason
- Approval decision
- Transfer dates
- Current transfer status

Asset records are not updated when approval occurs.

Approval only authorizes the movement of the asset.

The asset remains assigned to the source location until the requestor confirms the asset has physically been dispatched.

When dispatch occurs, the transfer status changes to:

APPROVED → IN_TRANSIT

Only after the recipient confirms receipt does the workflow progress to:

IN_TRANSIT → RECEIVED

At this point the asset record is updated to reflect the new ownership or location.

All state transitions are enforced using DynamoDB conditional updates to prevent invalid transitions and duplicate processing.

Valid status transitions are:

```text
PENDING → APPROVED
PENDING → REJECTED
PENDING → EXPIRED
APPROVED → CANCELLED
APPROVED → IN_TRANSIT
IN_TRANSIT → RECEIVED
```

---

### User Experience

#### Requestor

The requestor can:

- Initiate a transfer request (Only assets located in user base location)
- Specify recipient and destination
- Provide a transfer reason
- Initiate the transfer once transport has been arranged
- Track transfer status
- Cancel an approved transfer before it is in transit
  Typical workflow:

```text
Create Request
    ↓
Await Approval
    ↓
Receive Approval/Rejection Notification
    ↓
Arrange Transport → Mark In Transit
    ↓
Await Recipient Confirmation
```

#### Administrator

The administrator can:

- Review pending requests
- Approve requests
- Reject requests
- Receive reminder notifications for pending approvals
  Typical workflow:

```text
Receive Notification
    ↓
Review Request
    ↓
Approve or Reject Request
```

#### Recipient

The recipient can:

- Receive transfer notifications
- Confirm asset receipt
- Complete the transfer process
  Typical workflow:

```text
Receive Notification
    ↓
Physically Receive Asset
    ↓
Confirm Receipt
```

---

### Scope

#### Included

- Asset transfer requests
- Approval workflow
- Approval cancellation (post-approval, pre-transit)
- Approval reminders
- Transfer rejection workflow
- Recipient acknowledgement
- Asset location updates
- Transfer audit history
- In-app notification delivery (via `notifications_table` / `GET /notifications`)
- Email notification delivery (via SNS)

#### Excluded

- Physical asset transportation
- Asset maintenance activities
- Asset disposal workflows
- Asset procurement workflows
- Multi-stage approval chains

---

### Architecture

<p align="center">
  <img src="./src/assets/transfer_request_25062026.svg" alt="Asset Transfer Architecture" width="1000">
</p>
<p align="center">
  <em>Figure 1: Asset Transfer Module Architecture</em>
</p>

#### High-Level Workflow

```text
Requestor
    ↓
Transfer Request
    ↓
Admin Approval
    ↓
Requestor Marks In Transit
    ↓
Recipient Notification
    ↓
Physical Transfer
    ↓
Recipient Confirmation
    ↓
Asset Location Update
```

#### Transfer Status Lifecycle

```text
PENDING
    ↓
APPROVED
    ↓
IN_TRANSIT
    ↓
RECEIVED
```

Alternative outcomes:

```text
PENDING
    ↓
REJECTED
```

```text
PENDING
    ↓
EXPIRED
```

```text
PENDING
    ↓
CANCELLED
```

```text
APPROVED
    ↓
CANCELLED
```

Status transitions are protected using DynamoDB conditional writes to ensure that:

- Duplicate events cannot update a transfer more than once.
- Invalid workflow transitions are rejected.
- Lambda retries do not result in inconsistent data.
  Examples:

```text
PENDING → APPROVED ✓
PENDING → CANCELLED ✓
PENDING → REJECTED ✓
PENDING → EXPIRED ✓

APPROVED → IN_TRANSIT ✓
APPROVED → CANCELLED ✓

IN_TRANSIT → RECEIVED ✓

PENDING → RECEIVED ✗
PENDING → IN_TRANSIT ✗
REJECTED → APPROVED ✗
EXPIRED → APPROVED ✗
RECEIVED → IN_TRANSIT ✗
```

### Key Design Principles

#### Controlled Asset Movement

Asset locations are not updated when a request is approved.

Approval indicates authorization to move the asset but does not confirm that the asset has physically left the source location.

Once transportation has been arranged and the asset is physically dispatched, the requestor initiates the transfer and the status is updated to IN_TRANSIT.

The asset location is only updated after the recipient acknowledges receipt and the transfer status changes to RECEIVED.

#### Auditability

All transfer actions are recorded in the `asset_transfer_table`, including:

- Who requested
- Who approved
- Who received
- Why the transfer occurred
- When actions occurred

#### Event-Driven Processing

Writes to the API land directly in `asset_transfer_table`. DynamoDB Streams capture every `INSERT`/`MODIFY` and feed an **EventBridge Pipe**, which forwards each change as an event onto a custom **EventBridge** bus. **EventBridge Rules** pattern-match on the new transfer status (`PENDING`/`REQUEST`, `APPROVED`, `IN_TRANSIT`, `RECEIVED`, `EXPIRED`, `REMINDER`) and fan out to the appropriate downstream Lambda(s), decoupling the write path from notification and side-effect processing.

#### Notification Delivery (Two Channels)

Two notification surfaces are maintained in parallel:

- **In-app notifications** — `handleNotifications` consumes status-change events and writes records to `notifications_table`, surfaced to users via `GET /notifications` (`getNotifications` Lambda).
- **Email notifications** — four status-specific Lambdas (`assetTransferRequest`, `assetTransferApproval`, `assetTransferTransit`, `assetTransferReceipt`) each publish to their own dedicated SNS topic, which delivers to the relevant actor(s) (requestor, admin, recipient). `assetTransferTransit` is additionally buffered behind an SQS queue with a DLQ. `assetTransferReceipt` carries the extra responsibility of updating the asset's location in `assets_table` once receipt is confirmed.

#### Approval Timeouts

When a request is created, an **EventBridge Scheduler** one-time schedule is also created for `now + xDays`. If the request has not progressed to `IN_TRANSIT` by then, `checkApprovalTimeout` fires, writes `EXPIRED` to `asset_transfer_table`, and emits a reminder event back onto the EventBridge bus for the admin notification path.

#### Fault Tolerance

An SQS queue with a dead-letter queue (`maxReceiveCount = 3`) sits in front of the `assetTransferTransit` Lambda, providing retry capability and preventing message loss on transient failures.

### Data Model

#### Single-Item, Progressive Enrichment Pattern

Each transfer is represented by **one item** in `asset_transfer_table`, keyed by `transferId`. The item is created at request time with a `PENDING` status and a base set of fields, then progressively enriched in place as the transfer advances — `approval`, `inTransit`, and `receipt` are nested attribute blocks added to the same item at each respective stage, rather than separate records. This keeps the full transfer history and current state co-located on one item, which is what makes the item itself double as the audit trail described under Auditability above.

Fields fall into two categories:

- **Client-supplied** — provided by the requestor/recipient/admin through the API (e.g. `recipientSub`, `transferReason`, `condition`).
- **Backend-derived** — set by the Lambda from the authenticated Cognito session or server clock, never trusted from client input (e.g. `requestorSub`, `dateApproved`, `approvedBySub`). This distinction matters for both validation (reject any client attempt to set a backend-derived field) and for IAM/Cognito claim mapping in the Lambda implementation.

#### `asset_transfer_table`

```json
{
  "id": "string (PK)",
  "assetId": "string (PK)",
  "transferCreated": "string (ISO 8601, backend-derived) (SK)",
  "status": "PENDING | APPROVED | REJECTED | EXPIRED | CANCELLED | IN_TRANSIT | RECEIVED",

  "requestorSub": "string (backend-derived from Cognito claim)",
  "approverSub": "string | null (intended/assigned approver, set at request time)",
  "recipientSub": "string (client-supplied)",

  "description": "string",
  "transferReason": "string",
  "locationFrom": "string",
  "locationTo": "string",
  "expectedDate": "string (ISO 8601, client-supplied)",

  "approval": {
    "dateApproved": "string (ISO 8601, backend-derived)",
    "approvedBySub": "string (backend-derived from Cognito claim)",
    "status": "APPROVED | REJECTED"
  },

  "inTransit": {
    "dateCreated": "string (ISO 8601, backend-derived)",
    "inTransitSub": "string (backend-derived from Cognito claim)",
    "status": "IN_TRANSIT",
    "transferDate": "string (ISO 8601, client-supplied)",
    "transportType": "company | courier | contractor | individual",
    "transportName": "string",
    "transportCost": "number | null",
    "invoiceUrl": "string | null (optional attachment)",
    "imageUrls": "string[] | null (optional)"
  },

  "receipt": {
    "dateReceived": "string (ISO 8601, backend-derived)",
    "receivedBySub": "string (backend-derived from Cognito claim)",
    "status": "RECEIVED",
    "condition": "excellent | damaged",
    "damageDetails": "string | null (required if condition = damaged)",
    "imageUrls": "string[] | null (optional)",
    "deliveryNoteUrl": "string | null (optional)"
  },

  "cancelled": {
    "dateReceived": "string (ISO 8601, backend-derived)",
    "cancelledBySub": "string (backend-derived from Cognito claim)",
    "cancelReason": "string"
    "status": "CANCELLED"
  }
}
```

#### `notifications_table`

```json
{
  "notificationId": "string (PK)",
  "status": "PENDING | APPROVED | REJECTED | EXPIRED | CANCEL | IN_TRANSIT | RECEIVED",
  "sub": "string (Cognito sub of the recipient of this notification)",
  "notificationDate": "string (ISO 8601, backend-derived)"
}
```

---

### Infrastructure

#### Frontend

| Service    | Purpose                            |
| ---------- | ---------------------------------- |
| CloudFront | Content delivery and secure access |
| S3         | Static website hosting             |

#### Authentication

| Service | Purpose                          |
| ------- | -------------------------------- |
| Cognito | Authentication and authorization |

#### API Layer

| Service     | Purpose              |
| ----------- | -------------------- |
| API Gateway | Secure API endpoints |

#### Compute

| #   | Lambda Function       | Purpose                                                            |
| --- | --------------------- | ------------------------------------------------------------------ |
| 1   | postTransferRequest   | Create transfer request (status: PENDING)                          |
| 2   | postTransferApproval  | Process approval decision (status: APPROVED / REJECTED)            |
| 3   | postTransferTransit   | Mark transfer in transit (status: IN_TRANSIT)                      |
| 4   | postTransferReceipt   | Process recipient acknowledgement (status: RECEIVED)               |
| 5   | postTransferCancel    | Process cancelled tranfer request (status: CANCELLED)              |
| 6   | getNotifications      | Retrieve in-app notifications for the current user                 |
| 7   | handleNotifications   | Write in-app notification records to `notifications_table`         |
| 8   | assetTransferRequest  | Notify admin of a new transfer request via SNS                     |
| 9   | assetTransferApproval | Notify requestor and recipient of approval/rejection via SNS       |
| 10  | assetTransferTransit  | Notify requestor that the transfer is in transit via SNS (via SQS) |
| 11  | assetTransferReceipt  | Notify recipient/requestor of receipt and update `assets_table`    |
| 12  | checkApprovalTimeout  | Detect approval expiry and emit EXPIRED / reminder events          |

#### Data Layer

| Table                | Purpose                                 |
| -------------------- | --------------------------------------- |
| asset_transfer_table | Transfer workflow and audit history     |
| assets_table         | Current asset information               |
| notifications_table  | In-app notification records             |
| users_table          | Provide details of users to be notified |

#### Event Processing

| Service               | Purpose                                         |
| --------------------- | ----------------------------------------------- |
| DynamoDB Streams      | Captures changes on `asset_transfer_table`      |
| EventBridge Pipes     | Routes stream records onto the custom event bus |
| EventBridge           | Custom event bus and rule-based routing         |
| EventBridge Rules     | Status-based fan-out to handler Lambdas         |
| EventBridge Scheduler | Approval timeout scheduling                     |
| SQS                   | Event buffering and retries (transit path)      |
| DLQ                   | Failed message handling (maxReceiveCount = 3)   |
| SNS                   | Email notification delivery (4 status topics)   |

---

### Prerequisites

The following components must exist before the module can operate:

- Asset Management Module
- Asset Registry (`assets_table`)
- User Authentication (Cognito)
- User Roles and Permissions
- Email Notification Configuration
- EventBridge Infrastructure
- SQS Queues and DLQs
- SNS Topics and Subscriptions
  Required roles:
- Requestor (User, Manager or Admin)
- Administrator (Admin)
- Recipient (User, Manager)

---

### Open Questions

#### Business Questions

- What is the approval expiry period?
- How many reminder notifications should be sent?
- Can administrators override expired requests?
- Should transfers support multiple recipients?
- What is the cancellation policy once a transfer is APPROVED but not yet IN_TRANSIT?

#### Technical Questions

- Should transfer history be immutable?
- Should approval comments be mandatory?
-
- Should transfer events be exposed for reporting integrations?
- Should support be added for multi-level approvals in future?
- Should the `assetTransferRequest`/`Approval`/`Transit` notification Lambdas also sit behind SQS + DLQ, consistent with `assetTransferTransit`?

#### Future Enhancements

- Multi-stage approval workflows
- Escalation paths for overdue approvals
- Transfer analytics dashboard (no transfers completed, most transfers by location, no pending transfers)
- Mobile approval workflow
- QR code-based transfer confirmation (scan asset to confirm location and barcode number)
- Integration with maintenance workflows

---

### Architecture Review Notes & Recommendations

The points below were identified and evaluated against AWS best practices for event-driven serverless systems (reliability, security, operational excellence, and cost pillars of the Well-Architected Framework).

**Recommendation**: <br/> Have notification Lambdas check/record an idempotency key (e.g. `transferId#status` written to a small DynamoDB idempotency table with a TTL, or conditional-put against `notifications_table`) before publishing to SNS, to avoid double-notifying a recipient on retried events. This is cheap to add now versus a confusing "why did I get two emails" bug report later.

#### 1. Approval cancellation path needs an explicit notification rule

The status diagram now includes `APPROVED → CANCEL`, but it's not clear from the diagram which EventBridge Rule/Lambda picks up `CANCEL` for notification purposes — it doesn't appear to map cleanly to `assetTransferApproval` (which seems oriented around APPROVED/REJECTED) or any other existing topic.

**Recommendation**: <br/> Decide explicitly whether `CANCEL` reuses the `assetTransferApproval` topic (with a distinguishing message attribute) or needs its own rule/topic, and document it. This is one of the nine discrepancies worth nailing down before Terraform, since IAM policies and SNS filter policies need to know about it upfront.

#### 2. Observability: no mention of structured logging, tracing, or alarms

The architecture has six EventBridge Rules, an EventBridge Pipe, a Scheduler, SQS+DLQ, and nine Lambdas. With this much asynchronous fan-out, **AWS X-Ray tracing** (or at minimum correlation IDs propagated through `detail` payloads) becomes important for debugging "why didn't the recipient get notified" support questions.

**Recommendation**: <br/> Add a `transferId`-keyed correlation ID to every event `detail` payload from the source Lambda all the way through to SNS message attributes, and enable X-Ray active tracing on the API Gateway → Lambda → EventBridge chain. Also add a CloudWatch Alarm on the DLQ's `ApproximateNumberOfMessagesVisible` (you already have the DLQ — alarming on it is the missing half) so failed transit notifications surface immediately rather than being discovered during an audit.

#### 3. Least-privilege IAM scoping given prior `EntityAlreadyExists` history

Given the noted history of `EntityAlreadyExists` IAM issues, when writing the Terraform for these ~9 Lambdas it's worth scoping each Lambda's execution role to only the specific table/topic/queue ARNs it touches (rather than a shared broad role), both for security and to reduce the chance of cross-module naming collisions during `terraform plan`/`apply`.
A `for_each`-driven module per Lambda with explicit `dynamodb:Query`/`PutItem`/`UpdateItem` actions scoped to the specific table ARN (and index ARN where GSIs are used) will also make future audits straightforward given how central auditability is to this module's purpose.

#### 4. Confirm EventBridge Scheduler cleanup

One-time schedules created per transfer request for `checkApprovalTimeout` should be deleted once a transfer leaves `PENDING` (either by being approved, rejected, or expiring) — otherwise stale schedules accumulate. Worth confirming the approval/rejection Lambda also deletes the corresponding Scheduler schedule, not just the expiry Lambda consuming it.