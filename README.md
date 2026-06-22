# Atlantic Meats Project

A custom-built asset and maintenance management system designed specifically for a Atlantic Meats to streamline the management of assets across multiple store locations. The platform centralises all maintenance activity into a single digital system, replacing manual WhatsApp tracking methods with structured, traceable job cards and a unified asset register.

It provides a consolidated view of all assets across stores, enabling clear visibility into maintenance history, ongoing work, and asset performance. Each maintenance action is recorded digitally, ensuring a complete and reliable history of work performed on every asset.

# Aim of the Platform

The primary aim is to reduce maintenance expenditure and improve the efficiency and accuracy of asset management across all customer store locations.

Key objectives include:

- Reducing overall maintenance spend through improved visibility and preventative insights
- Providing store-level and asset-level insights into maintenance activity and recurring issues
- Centralising asset management across all customer locations into a single system
- Replacing manual processes with digital job cards for consistent and traceable maintenance records
- Maintaining a complete maintenance history per asset to support troubleshooting and decision-making
- Identifying patterns and root causes of recurring faults to enable long-term corrective actions

# Table of Contents

- [Introduction](#introduction)
- [Tech Stack](#tech-stack)
- [Feautures](#features)
- [Project Structure](#project-structure)
- [Installation](#installation)
  - [Clone the Repository](#clone-the-repository)
  - [Navigate to the project](#navigate-to-the-project)
  - [Install Dependencies](#install-dependencies)
  - [Start Development Server](#start-development-server)
- [Environment Variables](#environment-variables)
- [Github Secrets](#github-secrets)
- [Available Scripts](#available-scripts)
- [Build](#build)
- [Deployment](#deployment)
- [EsLint Configuration](#eslint-configuration)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Application Modules](#application-modules)
  - [Jobs Module](#jobs-module)
    - [Overview](#overview)
    - [Problem](#problem)
    - [Solution](#solution)
    - [User Experience](#user-experience)
    - [Scope](#scope)
    - [Architecture](#architecture)
    - [Infrastructure](#infrastructure)
    - [Prerequisites](#prerequisites)
    - [Open Questions](#open-questions)

  - [Assets Module](#assets-module)
    - [Overview](#overview)
    - [Problem](#problem)
    - [Solution](#solution)
    - [User Experience](#user-experience)
    - [Scope](#scope)
    - [Architecture](#architecture)
    - [Infrastructure](#infrastructure)
    - [Prerequisites](#prerequisites)
    - [Open Questions](#open-questions)
  - [Assets Transfer Module](#assets-transfer-module)
    - [Overview](#overview)
    - [Problem](#problem)
    - [Solution](#solution)
    - [User Experience](#user-experience)
    - [Scope](#scope)
    - [Architecture](#architecture)
    - [Infrastructure](#infrastructure)
    - [Prerequisites](#prerequisites)
    - [Open Questions](#open-questions)
  - [Stock Management Module](#stock-management-module)
    - [Overview](#overview)
    - [Problem](#problem)
    - [Solution](#solution)
    - [User Experience](#user-experience)
    - [Scope](#scope)
    - [Architecture](#architecture)
    - [Infrastructure](#infrastructure)
    - [Prerequisites](#prerequisites)
    - [Open Questions](#open-questions)
  - [Comments Module](#comments-module)
    - [Overview](#overview)
    - [Problem](#problem)
    - [Solution](#solution)
    - [User Experience](#user-experience)
    - [Scope](#scope)
    - [Architecture](#architecture)
    - [Infrastructure](#infrastructure)
    - [Prerequisites](#prerequisites)
    - [Open Questions](#open-questions)
  - [Users Module](#users-module)
    - [Overview](#overview)
    - [Problem](#problem)
    - [Solution](#solution)
    - [User Experience](#user-experience)
    - [Scope](#scope)
    - [Architecture](#architecture)
    - [Infrastructure](#infrastructure)
    - [Prerequisites](#prerequisites)
    - [Open Questions](#open-questions)
  - [WhatsApp Comment Notifications MOdule](#whatsapp-comment-notifications-module)
    - [Overview](#overview)
    - [Problem](#problem)
    - [Solution](#solution)
    - [User Experience](#user-experience)
    - [Scope](#scope)
    - [Architecture](#architecture)
    - [Infrastructure](#infrastructure)
    - [Prerequisites](#prerequisites)
    - [Open Questions](#open-questions)

- [Contact](#contact)

---

# Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router Dom
- React Query
- AWS
- Terraform

# Features

- User authentication
- Responsive dashboard
- API integration
- Github actions deployment
- Role-based access

# Project Structure

```bash
src/
├── assets/
├── auth/
├── components/
├── context/
├── data/
├── hooks/
├── lib/
├── pages/
├── routes/
├── schemas/
├── styles/
└── utils/
```

---

# Installation

## Clone the repository

```bash
git clone https://github.com/Fabian-Petersen/atlantic-meats-app-fabian-portfolio.git
```

## Navigate to the project

```bash
cd atlantic-meats-app
```

## Install dependencies

```bash
npm install
```

## Start development server

```bash
npm run dev
```

Application runs on:

```bash
http://localhost:5173
```

---

# Environment Variables

Create a `.env` file in the root directory:

```env
VITE_COGNITO_USERPOOL_ID=
VITE_COGNITO_CLIENT_ID=
VITE_SITE_URL=
```

# Github Secrets

API_GATEWAY_URL=
AWS_ACCESS_KEY_ID=
AWS_S3_BUCKET=
AWS_SECRET_ACCESS_KEY=
CLOUDFRONT_DISTRIBUTION_ID=
COGNITO_CLIENT_ID=
COGNITO_USERPOOL_ID=

---

# Available Scripts

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start development server |
| `npm run build`   | Create production build  |
| `npm run preview` | Preview production build |
| `npm run lint`    | Run ESLint               |

---

# Build

```bash
npm run build
```

Production files are generated in:

```bash
dist/
```

---

# Deployment

Example deployment platforms:

- AWS Amplify
- AWS S3 + CloudFront

---

# ESLint Configuration

This project uses ESLint with TypeScript support.

Example plugins:

- eslint-plugin-react
- eslint-plugin-react-hooks
- typescript-eslint

---

# Usage

Content here...

---

# API Reference

Content here...

---

# Application Modules

## Jobs Module

### Overview

### Problem

### Solution

### User Experience

### Scope

### Architecture

### Infrastructure

### Prerequisites

### Open Questions

---

## Assets Module

### Overview

### Problem

### Solution

### User Experience

### Scope

### Architecture

### Infrastructure

### Prerequisites

### Open Questions

---

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
3. Transfer Notification
4. Recipient Acknowledgement
5. Asset Location Update

Every transfer is recorded in the `transfer_table`, creating a complete history of:

- Requestor
- Recipient
- Approver
- Transfer reason
- Approval decision
- Transfer dates
- Current transfer status

Asset records are only updated after the recipient confirms receipt of the asset.

This ensures that the system reflects actual custody rather than intended custody.

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

### Key Design Principles

#### Controlled Asset Movement

Asset locations are not updated when a request is approved.

The location update only occurs after the recipient acknowledges receipt of the asset.

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

---

## Stock Management Module

### Overview

### Problem

### Solution

### User Experience

### Scope

### Architecture

### Infrastructure

### Prerequisites

### Open Questions

---

## Comments Module

### Overview

### Problem

### Solution

### User Experience

### Scope

### Architecture

### Infrastructure

### Prerequisites

### Open Questions

---

## Users Module

### Overview

### Problem

### Solution

### User Experience

### Scope

### Architecture

### Infrastructure

### Prerequisites

### Open Questions

---

## WhatsApp Comment Notifications Module

### Overview

When a comment is added to a job, all relevant users receive a WhatsApp message containing the comment — no login required.

### Problem

Users miss job updates because they need to log in to the app to see new comments. This creates delays in communication and response times.

### Solution

Automatically send a WhatsApp notification to all users when a comment is posted on a job. The message mirrors what is shown in the app, giving users the full context directly in WhatsApp.

### User Experience

**Trigger:** A comment is posted on a job via `POST /comments`.

**What the user receives:**

```
New comment on Job-BTX-20260501-0001

"Please confirm the site visit for Thursday morning.
Materials have been delivered."

Leon Mathlay (Maintenance Manager)
Posted: 13 May 2025, 09:42
```

Users see the job reference, full comment, author, and timestamp — no need to open the app.

### Scope

| In scope                                   | Out of scope                        |
| ------------------------------------------ | ----------------------------------- |
| Notify all users of the store plus admin   | Per-user notification preferences   |
| Send on every new comment                  | Edit / delete comment notifications |
| Include job ID, comment, author, timestamp | Two-way WhatsApp replies            |

---

### Architecture

<img src="/src/assets/whatsapp_comment_notification_flow.svg" alt="watsapp-messaging-diagram" width="100%" height="500" style="border-radius:12px; max-width:100%" />

**Key design decisions:**

- **Async delivery** — the API returns `201` immediately; WhatsApp sending happens out of band via Lambda.
- **AWS End User Messaging Social** — native AWS service, no third-party WhatsApp providers needed.
- **Fan-out via Lambda** — one Lambda invocation fetches all users by location (inclduing admin users) and sends messages in parallel.

### Infrastructure

| Component              | Service                       |
| ---------------------- | ----------------------------- |
| API                    | AWS APIGateway                |
| Database               | AWS DynamoDB                  |
| Event bus              | AWS EventBridge               |
| Notification function  | AWS Lambda (Python 3.12)      |
| WhatsApp delivery      | AWS End User Messaging Social |
| Infrastructure-as-code | Terraform                     |

### Prerequisites

- WhatsApp Business Account (WABA) linked in AWS End User Messaging Social
- Users must have a `phoneNumber` attribute in the Users table
- WhatsApp message template approved by Meta (required for outbound notifications)

### Open Questions

- Should certain roles be excluded from notifications (e.g. admins who posted the comment)?
- Do we notify only users associated with the job, or all users?
- What happens if a user's phone number is invalid or unregistered on WhatsApp?

---

# Contact

<p>Fabian Petersen</p>

_Last updated: May 2025_
