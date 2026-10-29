# Playwright Automation — Development Log

This repository contains Playwright tests written in TypeScript for a locally running HPC Dashboard application. The application source code is private and is not included here.

I'm using this project to practice Playwright and build a small, maintainable UI automation test suite.

## Day 1 — Project Setup

Set up the Playwright project and connected it to GitHub.

- Initialized Playwright with TypeScript.
- Installed dependencies and browser binaries.
- Configured the test directory and local application URL.
- Ran the sample test to check that Playwright was working.
- Committed and pushed the initial project to GitHub.

## Day 2 — Upload Tests

Started with the Upload module and wrote five test cases.

The tests cover file uploads, job submission, and recurring job workflows.

A few things took longer than expected:

- Some locators matched multiple elements, so I had to make them more specific.
- Test execution was not always stable. I disabled fully parallel execution while investigating.
- Some test steps were repeated, so I extracted them into helper functions.

All five Upload tests passed locally.

I also looked into running the tests with GitHub Actions and Docker Compose. This is still pending because the application currently runs locally and is not available to GitHub-hosted runners.

## Day 3 — More Test Cases

Added tests for the other three modules: Profile, Recurring Analysis, and Job Explorer.

The new tests cover:

- Renaming and deleting jobs
- Searching by job name or ID
- Switching between analysis charts
- Viewing job details
- Exporting PDF and JSON files
- Filtering jobs by date range and resetting filters

One useful thing I learned was how to locate the correct Job Card when several cards contain similar buttons.

I used an XPath ancestor selector to find the card associated with a particular Job ID, then searched for buttons within that card instead of the entire page.

For file downloads, I used `page.waitForEvent('download')` before clicking the export button, then checked the downloaded file name and failure status.

The tests passed locally.

## Day 4 — Code Review and Cleanup

Went back through the tests to review the code and understand a few things I had used without fully thinking through.

### Locators

Reviewed how Playwright locators work, especially when multiple elements have the same text or button name.

I also looked more closely at the XPath selector used to find a Job Card.

### Waiting and timing

Ran into an issue with `locator.count()`. It returns the current number of matching elements instead of waiting for them to appear.

I reviewed how to use `expect(locator).toBeVisible()` and `toHaveCount()` to wait for the page to reach the expected state.

There are still a few fixed waits in the tests that I want to replace.



### Shared helpers
Some navigation and search code was repeated across test files.
I decided to keep the structure simple for now, using two shared helper files:

```text
helpers/
  navigation.ts
  search.ts
```

Started moving the repeated functions into these files. I still need to finish updating the tests and run them again.

## Day 5 — Refactoring, Test Data Management & CI Integration
### 1. Test Code Refactoring
- Extracted common navigation and search operations into reusable helper functions to reduce code duplication.
- Consolidated related test cases into the same TypeScript test files for better organization and execution.

### 2. Test Execution & Data Management
- Configured sequential test execution using Playwright project dependencies.
- Implemented automated cleanup of test-generated jobs and recurring jobs using Playwright teardown.
- Used dedicated naming prefixes to identify test data and avoid affecting unrelated records.
- Executed the Upload suite twice to ensure sufficient test data for downstream scenarios.

### 3. GitHub Actions CI Integration
- Encountered permission issues when attempting to access the private application repository from the public test repository.
- Resolved the issue by creating a GitHub Actions workflow in the private repository that checks out the public Playwright tests.
- Integrated Docker Compose to start the application, verify frontend/backend readiness, execute E2E tests, upload reports, and clean up the environment.
- **Result:** Successfully completed the E2E workflow in **2m 55s**.

### 4. Documentation
- Updated the README with test coverage, framework design, execution instructions, and CI integration.
- Added GitHub Actions execution evidence and updated the development log.

## Summary
Improved test maintainability, established automated test data management, and successfully integrated the Playwright E2E suite into a Docker-based GitHub Actions CI workflow.


**Day 6:**
- Wrote and organized technical blog posts about the Playwright E2E automation testing project.
- Documented practical examples covering Locators, Helpers, browser events, and test data cleanup.

**Day 7:**
- Continued writing Playwright technical blogs, focusing on Project Dependencies, Teardown, and CI/CD integration.
- Documented the Docker Compose + GitHub Actions workflow for running E2E tests.
- Organized the blog series and updated related screenshots and documentation.
[CSDN](https://blog.csdn.net/u013716535/category_13221467.html)