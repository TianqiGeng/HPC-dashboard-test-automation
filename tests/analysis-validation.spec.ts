import { test, expect, Page } from '@playwright/test';


import { openAnalysis } from '../helpers/navigation';
import { getSearchInput } from '../helpers/search';

// Common Helpers
async function openAnalysis(page: Page) {
  await page.goto('/');
  await page.getByText('Recurring Analysis', { exact: true }).click();
}

function getSearchInput(page: Page) {
  return page.getByPlaceholder('Search by Job Name or Job ID...');
}

// Test Data

async function getFirstRecurringJob(page: Page) {
  const jobIdElement = page.getByText(/^Job ID:/).first();

  await expect(jobIdElement).toBeVisible();

  const jobIdText = await jobIdElement.innerText();
  const jobId = jobIdText.replace(/^Job ID:\s*/, '').trim();
  //jobid
  const recurringName = jobId.replace(/^dev:1_/, '');

  return { recurringName, jobId };
}




//clear
test('Test 1:Clear search and restore all recurring jobs', async ({ page }) => {
  await openAnalysis(page);

  const { recurringName } = await getFirstRecurringJob(page);
  const search = getSearchInput(page);

  // Get all Job IDs before searching
  const jobIds = page.getByText(/^Job ID:/);
  const originalJobIds = await jobIds.allInnerTexts();

  expect(originalJobIds.length).toBeGreaterThan(0);

  await search.fill(recurringName);
  await expect(search).toHaveValue(recurringName);

  // Clear search
  await search.clear();
  await expect(search).toHaveValue('');

  // Verify all original jobs are restored
  await expect(jobIds).toHaveText(originalJobIds);
});
// Test 2: Case-insensitive Search
test('Test 2: Search recurring jobs case-insensitively', async ({ page }) => {
  await openAnalysis(page);
  
  const { recurringName } = await getFirstRecurringJob(page);
  const search = getSearchInput(page);
  const jobIds = page.getByText(/^Job ID:/);

  const job = page.getByText(recurringName, { exact: true });
  

  await search.fill(recurringName.toLowerCase());
  await expect(job).toBeVisible();
  const lowerResults = await jobIds.allInnerTexts();
 
  await search.fill(recurringName.toUpperCase());
  await expect(job).toBeVisible();
  const upperResults = await jobIds.allInnerTexts();
  console.log('lowerResults='+lowerResults)
  expect(lowerResults).toEqual(upperResults);
  console.log('upperResults='+upperResults)
  expect(lowerResults.length).toBeGreaterThan(0);
});

// Test 3: No Matching Results
test('Test 3: Show no recurring jobs for unmatched search', async ({ page }) => {
  await openAnalysis(page);

  const search = getSearchInput(page);
  const { recurringName } = await getFirstRecurringJob(page);
  await search.fill('$(recurringName)+${Date.now()}');

  await expect(
    page.getByText(recurringName)
  ).toHaveCount(0);
});

// Test 4: Search by Job ID
test('Test 4: Search recurring jobs by Job ID', async ({ page }) => {
  await openAnalysis(page);
  const {jobId } = await getFirstRecurringJob(page);
  const search = getSearchInput(page);

  await search.fill(jobId);

  await expect(
    page.getByText(`Job ID: ${jobId}`, { exact: true })
  ).toBeVisible();

  const jobIds = page.getByText(/^Job ID:/);
  // Verify every returned Job ID contains the search keyword
  const results = await jobIds.allInnerTexts();

  expect(results.length).toBeGreaterThan(0);

  for (const result of results) {
    expect(result.toLowerCase()).toContain(jobId.toLowerCase());
 }
});

//Test 5: Switch CPU / Memory Chart

test('Test5: Switch between CPU and Memory usage charts', async ({ page }) => {
  await openAnalysis(page);

  // Default CPU
  await expect(
    page.locator('h3').getByText('CPU Usage Trend', { exact: true }).first()
  ).toBeVisible();

  // Switch to Memory
  await page.getByRole('button', { name: 'Memory' }).first().click();

  await expect(
    page.locator('h3').getByText('Memory Usage Trend', { exact: true }).first()
  ).toBeVisible();

  // Switch back to CPU
  await page.getByRole('button', { name: 'CPU', exact: true }).first().click();

  await expect(
    page.locator('h3').getByText('CPU Usage Trend', { exact: true }).first()
  ).toBeVisible();
});


