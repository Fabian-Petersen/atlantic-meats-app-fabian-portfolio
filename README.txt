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
2. Administrative Approval
3. Transport Arrangement
4. Transfer Initiation
5. Recipient Acknowledgement
6. Asset Location Update

Every transfer is recorded in the `transfer_table`, creating a complete history of:

* Requestor
* Recipient
* Approver
* Transfer reason
* Approval decision
* Transfer dates
* Current transfer status

The transfer record serves as both the workflow record and audit trail for the transaction.

Asset records are only updated after the recipient confirms receipt of the asset.

This ensures that the system reflects actual custody rather than intended custody.

The workflow uses DynamoDB conditional writes to enforce valid state transitions and prevent duplicate event processing.

Valid status transitions are:

```text
PENDING → APPROVED
APPROVED → IN_TRANSIT
PENDING → REJECTED
PENDING → EXPIRED
APPROVED → RECEIVED
```
---

### User Experience

#### Requestor

The requestor can:

- Initiate a transfer request
- Specify recipient and destination
- Provide a transfer reason
- Track transfer status

Typical workflow:

```text
Create Request
    ↓
Await Approval
    ↓
Receive Approval/Rejection Notification
    ↓
Await Recipient Confirmation
```

---

### Administrator

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
Approve or Reject
```

---

### Recipient

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
- Approval reminders
- Transfer rejection workflow
- Recipient acknowledgement
- Asset location updates
- Transfer audit history
- Notification delivery

### Excluded

- Physical asset transportation
- Asset maintenance activities
- Asset disposal workflows
- Asset procurement workflows
- Multi-stage approval chains

---

### Architecture

<p align="center">
  <img src="./src/assets/transfer_request.svg" alt="Asset Transfer Architecture" width="1000">
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

Status transitions are protected using DynamoDB conditional writes to ensure that:

* Duplicate events cannot update a transfer more than once.
* Invalid workflow transitions are rejected.
* Lambda retries do not result in inconsistent data.

Examples:

```text
PENDING → APPROVED ✓
PENDING → REJECTED ✓
PENDING → EXPIRED ✓

APPROVED → IN_TRANSIT ✓

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

All transfer actions are recorded in the transfer table, including:

- Who requested
- Who approved
- Who received
- Why the transfer occurred
- When actions occurred

#### Event-Driven Processing

Business events are processed asynchronously using AWS managed services to improve scalability and reliability.

#### Fault Tolerance

SQS queues and dead-letter queues provide retry capabilities and prevent message loss.

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

| Lambda Function      | Purpose                              |
| -------------------- | ------------------------------------ |
| postTransferRequest  | Create transfer request              |
| postApproval         | Process approval decision            |
| postAcceptAsset      | Process recipient acknowledgement    |
| handleRequest        | Notify administrators                |
| handleApproval       | Notify requestor and recipient       |
| handleUpdateAsset    | Update asset records                 |
| checkApprovalTimeout | Handle approval reminders and expiry |

#### Data Layer

| Table          | Purpose                             |
| -------------- | ----------------------------------- |
| transfer_table | Transfer workflow and audit history |
| assets_table   | Current asset information           |

#### Event Processing

| Service               | Purpose                     |
| --------------------- | --------------------------- |
| EventBridge           | Event routing               |
| EventBridge Scheduler | Approval timeout scheduling |
| SQS                   | Event buffering and retries |
| DLQ                   | Failed message handling     |
| SNS                   | Notification delivery       |

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

- Requestor
- Administrator
- Recipient

---

### Open Questions

#### Business Questions

- What is the approval expiry period?
- How many reminder notifications should be sent?
- Can administrators override expired requests?
- Can a transfer be cancelled after approval?
- Should transfers support multiple recipients?

#### Technical Questions

- Should transfer history be immutable?
- Should approval comments be mandatory?
- Should recipient confirmation capture geolocation?
- Should transfer events be exposed for reporting integrations?
- Should support be added for multi-level approvals in future?

#### Future Enhancements

- Multi-stage approval workflows
- Escalation paths for overdue approvals
- Transfer analytics dashboard
- Mobile approval workflow
- QR code-based transfer confirmation
- Integration with maintenance workflows