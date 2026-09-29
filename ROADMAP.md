# DevSecOps Roadmap for Current AWS Serverless Application

## Objective

Transform the existing serverless AWS application into a production-style DevSecOps project demonstrating:

- Infrastructure as Code
- Secure CI/CD
- Automated testing
- Security scanning
- Monitoring and observability
- Incident detection
- Deployment controls
- AWS security engineering
- Operational documentation

Current technology base:

- React / Vite / TypeScript
- Python AWS Lambda
- API Gateway
- DynamoDB
- S3
- CloudFront
- Cognito
- EventBridge
- SQS
- Terraform
- GitHub Actions

---

# Phase 1 — Strengthen Terraform Foundations

## Goal

Ensure all AWS infrastructure is repeatable, validated and safely deployed through Terraform.

### Terraform structure

- [ ] Review existing Terraform repository structure
- [ ] Separate reusable Terraform modules where appropriate
- [ ] Separate environment-specific variables
- [ ] Remove unnecessary hard-coded values
- [ ] Use consistent naming conventions
- [ ] Add Terraform outputs for important infrastructure values
- [ ] Store Terraform state remotely
- [ ] Enable DynamoDB state locking if applicable
- [ ] Encrypt Terraform state
- [ ] Restrict access to Terraform state

Suggested structure:

```text
terraform/
├── modules/
│   ├── api-gateway/
│   ├── lambda/
│   ├── dynamodb/
│   ├── cognito/
│   ├── cloudfront/
│   ├── s3/
│   ├── monitoring/
│   └── security/
│
├── environments/
│   ├── dev/
│   ├── staging/
│   └── prod/
```

### Terraform validation

Add the following checks locally and in CI:

- [ ] `terraform fmt -check`
- [ ] `terraform init`
- [ ] `terraform validate`
- [ ] `terraform plan`
- [ ] Add `tflint`

Example flow:

```text
Terraform
    ↓
terraform fmt
    ↓
terraform validate
    ↓
tflint
    ↓
security scan
    ↓
terraform plan
```

---

# Phase 2 — Terraform Security Scanning

## Goal

Detect insecure infrastructure before it reaches AWS.

### Tools

Start with:

- [ ] Checkov
- [ ] Trivy IaC scanning

Optional later:

- [ ] tfsec if useful for additional Terraform checks
- [ ] OPA / Conftest
- [ ] AWS-native policy validation

### Checks to detect

Configure scanning for issues such as:

- [ ] Public S3 buckets
- [ ] Unencrypted resources
- [ ] Excessive IAM permissions
- [ ] Open security groups
- [ ] Missing logging
- [ ] Missing encryption
- [ ] Unsafe API Gateway configuration
- [ ] Missing DynamoDB protections
- [ ] Missing CloudTrail
- [ ] Missing security monitoring

### Pipeline requirement

A serious security finding should be able to fail the pipeline.

```text
terraform plan
      ↓
Checkov
      ↓
Security issue?
   ┌──┴──┐
  Yes    No
   │      │
Fail    Continue
```

---

# Phase 3 — Upgrade GitHub Actions

## Goal

Move from a simple deployment workflow to a proper CI/CD pipeline.

## Pull Request pipeline

Every pull request should run:

- [ ] Install dependencies
- [ ] TypeScript checks
- [ ] ESLint
- [ ] Unit tests
- [ ] Python linting
- [ ] Python tests
- [ ] Dependency scanning
- [ ] Secret scanning
- [ ] SAST
- [ ] Terraform formatting
- [ ] Terraform validation
- [ ] Terraform security scanning
- [ ] Terraform plan

Example:

```text
Pull Request
     │
     ├── Frontend lint
     ├── Frontend tests
     ├── Backend tests
     ├── SAST
     ├── Dependency scan
     ├── Secret scan
     ├── Terraform validate
     ├── TFLint
     ├── Checkov
     └── Terraform plan
```

The PR should not be mergeable when critical checks fail.

---

# Phase 4 — Replace AWS Access Keys with GitHub OIDC

## Goal

Remove permanent AWS credentials from GitHub.

### Current pattern to avoid

```text
GitHub Secrets
    │
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
    │
    ▼
AWS
```

### Target architecture

```text
GitHub Actions
      │
      │ OIDC
      ▼
AWS IAM Role
      │
      ▼
Temporary credentials
```

Tasks:

- [ ] Create GitHub OIDC provider in AWS using Terraform
- [ ] Create dedicated GitHub deployment IAM role
- [ ] Create trust policy for repository
- [ ] Restrict role to appropriate branches
- [ ] Restrict permissions using least privilege
- [ ] Remove long-lived AWS access keys
- [ ] Test GitHub authentication
- [ ] Document the OIDC implementation

This is an important DevSecOps portfolio item.

---

# Phase 5 — Separate CI and CD

## Goal

Do not automatically deploy everything simply because code was committed.

### CI

Continuous Integration should perform:

```text
Commit
  ↓
Build
  ↓
Lint
  ↓
Test
  ↓
Security scan
  ↓
Validate
```

### CD

Continuous Deployment should perform:

```text
Merge
  ↓
Build artifact
  ↓
Terraform plan
  ↓
Deploy
  ↓
Smoke tests
  ↓
Monitoring
```

Checklist:

- [ ] Separate validation workflow from deployment workflow
- [ ] Deploy only from approved branches
- [ ] Prevent feature branches from deploying production
- [ ] Protect `main`
- [ ] Require passing checks before merge
- [ ] Require pull requests for production changes

---

# Phase 6 — Introduce Development and Production Environments

## Goal

Avoid deploying every change directly to production.

Start with:

```text
DEV
 ↓
PROD
```

Later:

```text
DEV
 ↓
STAGING
 ↓
PROD
```

Tasks:

- [ ] Create separate Terraform configurations
- [ ] Create separate environment variables
- [ ] Create separate Lambda deployments
- [ ] Separate DynamoDB tables where practical
- [ ] Separate S3 resources
- [ ] Separate API endpoints
- [ ] Separate secrets/configuration
- [ ] Configure GitHub Environments
- [ ] Add production approval gate

Eventually consider:

```text
AWS Organization

├── Security
├── Development
├── Staging
└── Production
```

Do this later rather than immediately.

---

# Phase 7 — Build a Testing Strategy

## Goal

Demonstrate that deployments are automatically validated.

## Frontend testing

- [ ] Component tests
- [ ] Form validation tests
- [ ] Utility function tests
- [ ] API hook tests where appropriate

Possible tools:

- Vitest
- React Testing Library

## Backend testing

- [ ] Lambda unit tests
- [ ] Validation tests
- [ ] Authorization tests
- [ ] Error handling tests
- [ ] DynamoDB interaction tests
- [ ] Event-processing tests

Possible tool:

```text
pytest
```

## Integration testing

Test application flows such as:

- [ ] Create maintenance request
- [ ] Approve maintenance request
- [ ] Create asset transfer
- [ ] Approve transfer
- [ ] Update transfer status
- [ ] Create disposal
- [ ] Verify asset
- [ ] Retrieve dashboard metrics

---

# Phase 8 — Add Post-Deployment Smoke Tests

## Goal

Ensure that a successful deployment actually works.

Example:

```text
Deploy
   ↓
GET /api/assets
   ↓
GET /api/dashboard/metrics
   ↓
Test expected status
   ↓
Test response schema
   ↓
Deployment successful
```

Tasks:

- [ ] Check important API endpoints
- [ ] Confirm expected HTTP status
- [ ] Validate response structure
- [ ] Check authentication
- [ ] Check protected endpoints
- [ ] Fail deployment if smoke tests fail

Later:

- [ ] Add automated rollback strategy

---

# Phase 9 — CloudWatch Logging

## Goal

Create useful operational logs rather than only application debug output.

### Lambda logging

Standardise Lambda logs.

Include useful fields such as:

```json
{
  "level": "ERROR",
  "function": "postMaintenanceRequest",
  "requestId": "...",
  "userSub": "...",
  "resource": "maintenance-request",
  "error": "..."
}
```

Tasks:

- [ ] Implement structured JSON logging
- [ ] Standardise log levels
- [ ] Add request IDs
- [ ] Add correlation IDs where practical
- [ ] Remove sensitive information from logs
- [ ] Configure log retention periods
- [ ] Create log groups through Terraform
- [ ] Restrict access to logs

---

# Phase 10 — CloudWatch Dashboard

## Goal

Create a central operational dashboard for the application.

Build the dashboard with Terraform.

## API Gateway

Monitor:

- [ ] Request count
- [ ] 4xx errors
- [ ] 5xx errors
- [ ] Latency
- [ ] Integration latency

## Lambda

Monitor:

- [ ] Invocations
- [ ] Errors
- [ ] Error percentage
- [ ] Duration
- [ ] Throttles
- [ ] Concurrent executions

## DynamoDB

Monitor:

- [ ] Read throttles
- [ ] Write throttles
- [ ] System errors
- [ ] Request latency

## SQS

Monitor:

- [ ] Messages available
- [ ] Messages in flight
- [ ] Oldest message
- [ ] DLQ messages

## CloudFront

Monitor:

- [ ] Requests
- [ ] Error rate
- [ ] Cache hit ratio

---

# Phase 11 — CloudWatch Alarms

## Goal

Move from monitoring dashboards to actual alerting.

A dashboard tells you:

> Something is wrong.

An alarm tells you:

> Something has become wrong.

Create Terraform-managed alarms for:

### Lambda

- [ ] Error rate threshold
- [ ] High execution duration
- [ ] Throttling

### API Gateway

- [ ] High 5xx rate
- [ ] High latency
- [ ] Unusual 4xx rate

### SQS

- [ ] Messages accumulating
- [ ] Oldest message age
- [ ] DLQ has messages

### DynamoDB

- [ ] Throttled requests
- [ ] System errors

Alert through:

```text
CloudWatch Alarm
       ↓
      SNS
       ↓
Email / notification
```

Tasks:

- [ ] Create SNS topic
- [ ] Create alarm subscriptions
- [ ] Manage alarms through Terraform
- [ ] Test alarms deliberately

---

# Phase 12 — Dead-Letter Queue Monitoring

This is particularly useful for the existing EventBridge/SQS architecture.

Example:

```text
DynamoDB Stream
      ↓
EventBridge Pipe
      ↓
EventBridge
      ↓
SQS
      ↓
Lambda
      ↓
Failure
      ↓
DLQ
```

Tasks:

- [ ] Configure DLQs
- [ ] Monitor DLQ message count
- [ ] Create CloudWatch alarm for DLQ messages
- [ ] Document how messages are replayed
- [ ] Test failed message handling

---

# Phase 13 — SAST

## Goal

Detect insecure application code during CI.

Potential tool:

```text
Semgrep
```

Tasks:

- [ ] Scan TypeScript
- [ ] Scan Python
- [ ] Configure scan in PR workflow
- [ ] Fail on critical findings
- [ ] Document exceptions where required

Look for:

- SQL/NoSQL injection patterns
- insecure input handling
- unsafe subprocess calls
- credentials
- weak crypto
- authorization problems

---

# Phase 14 — Dependency Security

## Frontend

Implement:

- [ ] npm audit
- [ ] Dependabot
- [ ] Dependency review

## Python

Implement one of:

- [ ] pip-audit
- [ ] Dependabot
- [ ] Trivy filesystem scanning

Monitor:

- [ ] Critical vulnerabilities
- [ ] High vulnerabilities
- [ ] Outdated dependencies

---

# Phase 15 — Secret Scanning

## Goal

Prevent credentials entering the repository.

Implement:

- [ ] GitHub secret scanning where available
- [ ] Gitleaks or equivalent
- [ ] Pipeline secret scanning
- [ ] `.gitignore` review
- [ ] Prevent `.env` files being committed

Search for:

```text
AWS keys
API keys
passwords
tokens
private keys
database credentials
```

---

# Phase 16 — IAM Security Review

## Goal

Apply least privilege throughout the system.

Review:

- [ ] Lambda IAM roles
- [ ] GitHub deployment role
- [ ] API Gateway permissions
- [ ] S3 policies
- [ ] EventBridge permissions
- [ ] SQS permissions
- [ ] DynamoDB permissions

Avoid:

```json
{
  "Action": "*",
  "Resource": "*"
}
```

wherever possible.

Create policies such as:

```text
Lambda A
   ↓
Only DynamoDB Table A

Lambda B
   ↓
Only S3 Prefix B
```

---

# Phase 17 — CloudTrail

## Goal

Track administrative changes to AWS.

Tasks:

- [ ] Enable CloudTrail
- [ ] Create trail with Terraform
- [ ] Store logs securely in S3
- [ ] Encrypt logs
- [ ] Restrict log bucket access
- [ ] Enable log integrity validation
- [ ] Review IAM activity
- [ ] Review infrastructure changes

Test activities such as:

```text
IAM policy changed
S3 policy changed
Lambda configuration changed
Security Group changed
```

---

# Phase 18 — AWS Config

## Goal

Continuously evaluate infrastructure configuration.

Tasks:

- [ ] Enable AWS Config
- [ ] Create configuration recorder
- [ ] Add selected managed rules
- [ ] Detect public resources
- [ ] Detect encryption problems
- [ ] Detect IAM issues
- [ ] Detect configuration drift

Use Terraform to manage the configuration.

---

# Phase 19 — GuardDuty

## Goal

Introduce AWS-native threat detection.

Tasks:

- [ ] Enable GuardDuty
- [ ] Review findings
- [ ] Understand severity levels
- [ ] Configure EventBridge handling for findings
- [ ] Create alerting for important findings
- [ ] Document investigation procedure

---

# Phase 20 — Security Hub

## Goal

Create centralised security posture reporting.

Tasks:

- [ ] Enable Security Hub
- [ ] Review AWS security standards
- [ ] Integrate GuardDuty
- [ ] Integrate Inspector
- [ ] Integrate Config
- [ ] Review findings
- [ ] Remediate selected findings

---

# Phase 21 — Amazon Inspector

Use Inspector where supported by the resources you introduce.

Tasks:

- [ ] Enable Inspector
- [ ] Review vulnerability findings
- [ ] Understand CVSS scores
- [ ] Prioritise vulnerabilities
- [ ] Document remediation workflow

This becomes especially useful if the project later includes:

- EC2
- ECR
- Lambda package scanning

---

# Phase 22 — Encryption and KMS

Review encryption throughout the application.

### Check:

- [ ] DynamoDB encryption
- [ ] S3 encryption
- [ ] SQS encryption
- [ ] SNS encryption
- [ ] CloudTrail encryption
- [ ] Sensitive application configuration

Learn:

- [ ] AWS-managed keys
- [ ] Customer-managed KMS keys
- [ ] Key policies
- [ ] Key rotation
- [ ] IAM + KMS interaction

---

# Phase 23 — Secrets Management

## Goal

Remove sensitive configuration from code and deployment files.

Evaluate:

- [ ] AWS Systems Manager Parameter Store
- [ ] AWS Secrets Manager

Store:

- [ ] API credentials
- [ ] Service credentials
- [ ] sensitive configuration

Where possible, retrieve them through:

```text
Lambda IAM Role
       ↓
Secrets Manager / SSM
```

rather than storing secrets directly in Lambda environment variables.

---

# Phase 24 — Incident Simulation

This is one of the most important parts of the project.

Do not only build monitoring.

Break the system deliberately.

## Incident 1 — Lambda failure

- [ ] Introduce Lambda exception
- [ ] Generate requests
- [ ] Detect CloudWatch error
- [ ] Receive alarm
- [ ] Investigate logs
- [ ] Fix problem
- [ ] Deploy through pipeline
- [ ] Verify recovery

## Incident 2 — SQS backlog

- [ ] Break consuming Lambda
- [ ] Generate queue messages
- [ ] Watch queue depth increase
- [ ] Trigger CloudWatch alarm
- [ ] Resolve issue
- [ ] Confirm queue drains

## Incident 3 — API failure

- [ ] Create API 500 response
- [ ] Generate traffic
- [ ] Detect API Gateway 5xx increase
- [ ] Investigate Lambda
- [ ] Deploy fix

## Incident 4 — IAM failure

- [ ] Remove required permission
- [ ] Observe `AccessDenied`
- [ ] Locate error through logs
- [ ] Correct IAM policy
- [ ] Redeploy

---

# Phase 25 — Create Incident Reports

For each major simulated incident create:

```text
Incident
Date
Impact
Detection
Timeline
Root cause
Resolution
Preventative action
Lessons learned
```

Example:

```text
INCIDENT: SQS Notification Backlog

Impact:
Asset transfer notification messages were not processed.

Detection:
CloudWatch alarm detected ApproximateAgeOfOldestMessage
exceeding the defined threshold.

Root Cause:
Deployment introduced an invalid Lambda environment variable.

Resolution:
Environment configuration corrected and redeployed through
GitHub Actions.

Prevention:
Added environment validation to deployment pipeline.
```

This becomes strong interview material.

---

# Phase 26 — Deployment Observability

Track deployments themselves.

Record:

- [ ] Git commit SHA
- [ ] deployment timestamp
- [ ] environment
- [ ] workflow run
- [ ] version

Consider exposing something like:

```json
{
  "version": "1.4.2",
  "commit": "a4f12cd",
  "environment": "production"
}
```

from an application health/version endpoint.

---

# Phase 27 — Application Health Checks

Create endpoints such as:

```text
GET /health
```

Example response:

```json
{
  "status": "healthy",
  "environment": "production",
  "version": "1.4.2"
}
```

Tasks:

- [ ] Create health endpoint
- [ ] Include build version
- [ ] Include environment
- [ ] Use in smoke tests
- [ ] Use in monitoring

Avoid returning sensitive infrastructure information.

---

# Phase 28 — GitHub Repository Security

Strengthen the repositories themselves.

Configure:

- [ ] Branch protection
- [ ] Pull request requirement
- [ ] Required status checks
- [ ] CODEOWNERS
- [ ] Dependabot
- [ ] Secret scanning
- [ ] Dependency review
- [ ] Signed commits if useful
- [ ] Protected production environment

---

# Phase 29 — Documentation

Your repository should explain the system professionally.

Create:

```text
README.md
ARCHITECTURE.md
DEPLOYMENT.md
SECURITY.md
MONITORING.md
INCIDENT_RESPONSE.md
RUNBOOK.md
```

Include diagrams for:

```text
Application architecture
CI/CD pipeline
Monitoring architecture
Security architecture
Event-driven architecture
```

---

# Phase 30 — Runbook

Create procedures for common failures.

Example sections:

```text
Lambda errors
API Gateway 5xx errors
DynamoDB errors
SQS backlog
DLQ messages
Failed deployments
Cognito authentication issues
S3 upload failures
CloudFront issues
```

Each should contain:

```text
Symptoms
Where to investigate
Relevant CloudWatch logs
Relevant metrics
Common causes
Resolution
Escalation
```

---

# Phase 31 — Cost Monitoring

DevOps also includes operational cost awareness.

Tasks:

- [ ] Configure AWS Budget
- [ ] Configure billing alarms
- [ ] Review cost explorer
- [ ] Tag resources
- [ ] Track environment cost
- [ ] Identify unnecessary resources

Suggested tags:

```text
Environment
Application
Owner
ManagedBy
CostCentre
```

Example:

```text
Environment = production
Application = asset-management
ManagedBy = terraform
```

---

# Phase 32 — Optional Container Project

Your current serverless application does not need containers.

However, for DevSecOps exposure, later add a smaller containerised workload.

Example:

```text
Docker
  ↓
ECR
  ↓
ECS Fargate
```

Pipeline:

```text
Build image
   ↓
Trivy scan
   ↓
Push ECR
   ↓
Deploy ECS
```

This lets you demonstrate container security without rewriting your existing application.

Do this after the serverless DevSecOps pipeline is working.

---

# Recommended Implementation Order

## Priority 1 — CI/CD Foundation

- [ ] Improve GitHub Actions structure
- [ ] Add PR workflow
- [ ] Add Terraform validation
- [ ] Add Terraform plan
- [ ] Add branch protection
- [ ] Add GitHub environments
- [ ] Implement GitHub OIDC
- [ ] Remove long-lived AWS credentials

---

## Priority 2 — Security Pipeline

- [ ] Checkov
- [ ] TFLint
- [ ] Semgrep
- [ ] Trivy
- [ ] Dependency scanning
- [ ] Secret scanning
- [ ] Pipeline security gates

---

## Priority 3 — Testing

- [ ] Frontend unit tests
- [ ] Lambda unit tests
- [ ] Integration tests
- [ ] Post-deployment smoke tests

---

## Priority 4 — Monitoring

- [ ] Structured Lambda logging
- [ ] CloudWatch dashboard
- [ ] Lambda metrics
- [ ] API Gateway metrics
- [ ] DynamoDB metrics
- [ ] SQS metrics
- [ ] CloudFront metrics

---

## Priority 5 — Alerting

- [ ] CloudWatch alarms
- [ ] SNS notifications
- [ ] Lambda error alerts
- [ ] API 5xx alerts
- [ ] SQS backlog alerts
- [ ] DLQ alerts

---

## Priority 6 — AWS Security

- [ ] CloudTrail
- [ ] AWS Config
- [ ] GuardDuty
- [ ] Security Hub
- [ ] Inspector
- [ ] KMS
- [ ] Secrets Manager
- [ ] IAM review

---

## Priority 7 — Operational Experience

- [ ] Simulate Lambda failure
- [ ] Simulate API failure
- [ ] Simulate IAM failure
- [ ] Simulate SQS backlog
- [ ] Create incident reports
- [ ] Create runbooks
- [ ] Practice troubleshooting

---

# Target Architecture

```text
                         Developer
                             │
                             ▼
                           GitHub
                             │
                    Pull Request / Commit
                             │
                             ▼
                      GitHub Actions
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
        Tests          Security Scans       Terraform
          │                  │                  │
      Vitest             Semgrep          fmt / validate
      pytest              Trivy              TFLint
                          Checkov              plan
                          Gitleaks
          │                  │                  │
          └──────────────────┼──────────────────┘
                             │
                       Security Gate
                             │
                             ▼
                      GitHub OIDC
                             │
                             ▼
                         AWS IAM Role
                             │
                             ▼
                       AWS Environment
                             │
          ┌──────────────────┼───────────────────┐
          │                  │                   │
     API Gateway           Lambda             CloudFront
          │                  │                   │
          │            ┌─────┼─────┐             │
          │            │     │     │             │
          │        DynamoDB  S3   SQS             │
          │                       │                │
          │                  EventBridge           │
          │                                        │
          └────────────────────┬───────────────────┘
                               │
                               ▼
                           CloudWatch
                               │
                    ┌──────────┼───────────┐
                    │          │           │
                  Logs      Metrics      Alarms
                                           │
                                           ▼
                                          SNS
                                           │
                                           ▼
                                         Alert
```

Security layer:

```text
AWS Environment
      │
      ├── IAM
      ├── KMS
      ├── CloudTrail
      ├── AWS Config
      ├── GuardDuty
      ├── Security Hub
      ├── Inspector
      └── Secrets Manager
```

---

# What This Project Should Demonstrate on Your CV

Once completed, you should be able to truthfully describe experience such as:

- Built and maintained CI/CD pipelines using GitHub Actions for React, Python Lambda and Terraform workloads.
- Implemented GitHub OIDC federation with AWS to eliminate long-lived deployment credentials.
- Integrated Terraform validation, TFLint and Checkov into pull-request pipelines.
- Integrated SAST, dependency, secret and infrastructure security scanning into CI/CD.
- Built AWS CloudWatch dashboards and alarms for API Gateway, Lambda, DynamoDB and SQS.
- Implemented structured application logging and operational monitoring.
- Created automated post-deployment smoke tests.
- Configured event-driven monitoring for SQS queues and dead-letter queues.
- Implemented least-privilege IAM policies for serverless workloads.
- Implemented AWS CloudTrail, Config, GuardDuty and Security Hub controls.
- Performed simulated production incidents and root-cause analysis.
- Created operational runbooks and incident reports.
- Managed AWS infrastructure through Terraform and automated deployment pipelines.

---

# Overall Progress Tracker

## Infrastructure

- [ ] Terraform cleaned and modularised
- [ ] Remote state secured
- [ ] Dev environment
- [ ] Production environment
- [ ] Resource tagging

## CI/CD

- [ ] Pull-request validation
- [ ] Automated testing
- [ ] Terraform plan
- [ ] Security scans
- [ ] GitHub OIDC
- [ ] Deployment workflow
- [ ] Production approval
- [ ] Smoke testing

## Application Security

- [ ] SAST
- [ ] Dependency scanning
- [ ] Secret scanning
- [ ] IaC scanning
- [ ] IAM least privilege
- [ ] Secrets management

## Monitoring

- [ ] Structured logs
- [ ] CloudWatch dashboard
- [ ] API Gateway monitoring
- [ ] Lambda monitoring
- [ ] DynamoDB monitoring
- [ ] SQS monitoring
- [ ] DLQ monitoring

## Alerting

- [ ] SNS
- [ ] API alerts
- [ ] Lambda alerts
- [ ] Queue alerts
- [ ] DLQ alerts

## AWS Security

- [ ] CloudTrail
- [ ] Config
- [ ] GuardDuty
- [ ] Security Hub
- [ ] Inspector
- [ ] KMS

## Operations

- [ ] Health endpoint
- [ ] Runbook
- [ ] Incident response process
- [ ] Failure simulations
- [ ] Root-cause analysis reports
- [ ] Deployment documentation

## Portfolio

- [ ] Architecture diagram
- [ ] CI/CD diagram
- [ ] Security architecture diagram
- [ ] Monitoring diagram
- [ ] README
- [ ] SECURITY.md
- [ ] MONITORING.md
- [ ] INCIDENT_RESPONSE.md
- [ ] Project screenshots
- [ ] CV project bullets
