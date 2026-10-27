
# HPC Dashboard — Playwright Test Automation

An end-to-end (E2E) test automation project for a High-Performance Computing (HPC) Dashboard, built with **Playwright, TypeScript, and GitHub Actions**.

The framework covers core application workflows, including job uploads, recurring job management, data analysis, and job operations. It integrates reusable test helpers, sequential test execution, automated test data cleanup, and Docker-based CI.

## Tech Stack

| Technology | Purpose |
|---|---|
| Playwright | Browser-based E2E test automation |
| TypeScript | Test implementation |
| Node.js | Test runtime |
| GitHub Actions | Continuous integration |
| Docker Compose | Application environment orchestration |
| PostgreSQL | Application database |
| Playwright HTML Reporter | Test reports and debugging |

## Test Coverage

### Job Upload
- Validate required input fields and submission errors.
- Submit jobs using test input files.
- Create jobs associated with recurring jobs.
- Verify successful submissions.

### Profile & Recurring Job Management
- Rename recurring jobs and verify updated information.
- Cancel rename operations.
- Delete recurring jobs with confirmation.
- Cancel deletion operations.
- Verify recurring job search behavior.

### Recurring Job Analysis
- Search recurring jobs using names and Job IDs.
- Verify matching and nonmatching search results.
- Switch between CPU and memory usage charts.

### Job Management
- Search jobs by name and ID.
- View job details and export PDF reports.
- Export job data and JSON.
- Delete jobs.
- Verify filtering functionality.

### Test Data Cleanup
- Identify test-created jobs using dedicated naming prefixes.
- Delete test-created jobs and recurring jobs.
- Handle cleanup when no matching test data exists.
- Execute cleanup after the test workflow, including when functional tests fail.

## Project Structure

```text
HPC-dashboard-test-automation/
├── .github/
│   └── workflows/
├── docs/
│   └── images/
├── helpers/
│   ├── navigation.ts
│   └── search.ts
├── test-data/
├── tests/
│   ├── upload-validation.spec.ts
│   ├── profile-validation.spec.ts
│   ├── analysis-validation.spec.ts
│   ├── jobs-validation.spec.ts
│   └── clearTestData-validation.spec.ts
├── .gitignore
├── package.json
├── package-lock.json
├── playwright.config.ts
└── playwright.e2e.config.ts
```

## Test Automation Design

### Reusable Test Helpers

Common navigation and search operations are implemented as reusable helper functions to reduce duplicated code and improve maintainability.

### Sequential E2E Execution

The E2E workflow uses Playwright project dependencies to coordinate tests that share application data.

```text
Upload
   ↓
Upload (Second Run)
   ↓
Profile
   ↓
Recurring Job Analysis
   ↓
Jobs
   ↓
Cleanup
```

The sequential approach ensures that test data created during upload is available to downstream scenarios.

### Automated Test Data Cleanup

Test-created records use identifiable naming conventions:

```text
playwright-job-*
playwright-recurring-*
```

The cleanup suite removes matching test records without intentionally modifying unrelated application data.

Playwright project teardown triggers cleanup after the dependent workflow finishes, including when functional tests fail.

## Getting Started

### Prerequisites

- Node.js and npm
- Access to a running HPC Dashboard application
- Playwright browser dependencies

The application under test is maintained in a separate private repository. Its source code is not included in this public test automation repository.

### Installation

```bash
git clone https://github.com/TianqiGeng/HPC-dashboard-test-automation.git
cd HPC-dashboard-test-automation

npm ci
npx playwright install
```

The default application URL is:

```text
http://localhost:5173
```

### Run the Sequential E2E Suite

```bash
npx playwright test --config=playwright.e2e.config.ts
```

This is the recommended execution mode for the complete workflow because the test suites share application data.

### Run an Individual Test File

```bash
npx playwright test tests/upload-validation.spec.ts --project=chromium
```

Individual suites may require appropriate application data or prior setup.

### Default Cross-Browser Configuration

```bash
npx playwright test
```

The default configuration defines Chromium, Firefox, and WebKit browser projects.

For the complete data-dependent E2E workflow, use the dedicated sequential configuration instead.

## Test Reports & Debugging

Playwright provides HTML reports, screenshots, and trace-based debugging.

### HTML Report

```bash
npx playwright show-report
```

### Screenshots

Screenshots are automatically captured when tests fail.

### Traces

The default configuration captures traces on the first retry. For local debugging, traces can be enabled explicitly:

```bash
npx playwright test --project=chromium --trace on
```

### Test Execution Report

![Playwright HTML Report](docs/images/playwright-html-report.png)

## CI/CD Integration

The project uses a two-repository CI architecture.

The **public test repository** hosts the Playwright automation framework and its independent CI checks.

The **private HPC Dashboard repository** hosts a dedicated GitHub Actions workflow that runs the full E2E suite against the Dockerized application.

### CI Workflow

```text
GitHub Actions (Private Repository)
                |
                v
     Checkout HPC Dashboard
                |
                v
     Checkout Public Test Repository
                |
                v
       Docker Compose Up
                |
                v
    Backend / Frontend Readiness
                |
                v
      Install Playwright
                |
                v
     Run Chromium E2E Tests
                |
                v
      Upload Test Report
                |
                v
      Docker Compose Down
```

The workflow automatically:

1. Checks out the application and test repositories.
2. Builds and starts the frontend, backend, and PostgreSQL services using Docker Compose.
3. Verifies that the frontend and backend HTTP services are responding.
4. Installs Playwright and Chromium.
5. Executes the sequential E2E suite.
6. Uploads Playwright test reports and execution artifacts.
7. Stops and removes the Docker environment.

The dedicated **Playwright E2E Tests** GitHub Actions workflow has completed successfully.

It is manually triggered using `workflow_dispatch`. The CI pipeline currently executes the sequential suite in Chromium. The default Playwright configuration also defines Firefox and WebKit projects.

### Successful GitHub Actions Execution

![Successful Playwright E2E CI run](docs/images/github-actions-success.png)

## Project Highlights

- Automated end-to-end validation of real application workflows.
- Reusable Playwright and TypeScript test utilities.
- Sequential test orchestration using Playwright project dependencies.
- Automated test data cleanup using teardown.
- Docker Compose integration with frontend, backend, and PostgreSQL.
- Successful browser E2E execution in GitHub Actions.
- HTML reports, failure screenshots, and trace-based debugging.
