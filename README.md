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
