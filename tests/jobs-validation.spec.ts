import { test, expect, type Page } from '@playwright/test';
import { openJobsPage } from '../helpers/navigation';
import { getJobSearch } from '../helpers/search';

// async function openJobsPage(page: Page) {
//   await page.goto('/');
//   await page.getByText('Jobs', { exact: true }).click();

//   await expect( page.getByRole('button', { name: 'Export JSON' }) ).toBeVisible();
// }


// function getJobSearch(page: Page) {
//   return page.getByPlaceholder(
//     'Search by Job ID, Name, or Recommendation tip...'
//   );
// }

async function getFirstJob(page: Page) {
  const jobIdElement = page.getByText(/^Job ID:/).first();
  await expect(jobIdElement).toBeVisible();

  const jobIdText = await jobIdElement.innerText();
  const jobId = jobIdText.replace(/^Job ID:\s*/, '').trim();


  const jobCard = jobIdElement.locator(
    'xpath=ancestor::div[.//button[normalize-space()="View Details"]][1]'
  );

  const jobName = (
    await jobCard.locator('h2, h3, h4').first().innerText()
  ).trim();

  return { jobCard, jobName, jobId };
}


test('Test1: Search job by name', async ({ page }) => {
  await openJobsPage(page);

  const { jobName } = await getFirstJob(page);
  const search = getJobSearch(page);

  await search.fill(jobName);

  await expect(page.getByText(/^Job ID:/)).toHaveCount(1);
  await expect(
    page.getByText(jobName, { exact: true })
  ).toBeVisible();
});

test('Test2: Search job by id', async ({ page }) => {
  await openJobsPage(page);

  const { jobId } = await getFirstJob(page);
  const search = getJobSearch(page);

  await search.fill(jobId);

  await expect(page.getByText(/^Job ID:/)).toHaveCount(1);
  await expect(
    page.getByText(`Job ID: ${jobId}`, { exact: true })
  ).toBeVisible();
});

test('Test3: View job details and export PDF', async ({ page }) => {
  await openJobsPage(page);

  const { jobCard, jobId } = await getFirstJob(page);

  // 1. Open job details
  await jobCard.getByRole('button', {
    name: 'View Details'
  }).click();

  // 2. Verify the correct job details
  await expect(
    page.getByText(`Job ID: ${jobId}`, { exact: true })
  ).toBeVisible();

  // 3. Export PDF
  const downloadPromise = page.waitForEvent('download');

  await page.getByRole('button', {
    name: 'Export as PDF'
  }).click();

  const download = await downloadPromise;

  // 4. Verify PDF download
  expect(download.suggestedFilename()).toMatch(/\.pdf$/i);
  expect(await download.failure()).toBeNull();
});

test('Test4: Export job data', async ({ page }) => {
  await openJobsPage(page);

  const { jobCard, jobName } = await getFirstJob(page);

  // 1. Open job details
  await jobCard.getByRole('button', {
    name: `Open actions for ${jobName}`
  }).click();



  const downloadPromise = page.waitForEvent('download');

  await page.getByText('Export Job Data', {
    exact: true
  }).click();

  const download = await downloadPromise;

  // 4. Verify PDF download
  expect(download.suggestedFilename()).toMatch(/\.json$/i);
  expect(await download.failure()).toBeNull();
});

test('Test5: Delete job data', async ({ page }) => {
  await openJobsPage(page);

  const { jobCard, jobName } = await getFirstJob(page);

  await jobCard.getByRole('button', {
    name: `Open actions for ${jobName}`
  }).click();
  console.log(jobName)

  await page.getByText('Delete Job', {
    exact: true
  }).click();

  
  await expect(
    page.getByText(jobName, { exact: true })
  ).toBeVisible();
});

test('Test6: Export JSON', async ({ page }) => {
  await openJobsPage(page);

  const { jobCard, jobName } = await getFirstJob(page);

  // 1. Open job details
  await jobCard.getByRole('button', {
    name: `Open actions for ${jobName}`
  }).click();

  await jobCard.locator('input').first().click()

  // 3. Export PDF
  const downloadPromise = page.waitForEvent('download');

  await page.getByText('Export JSON', {
    exact: true
  }).click();

  const download = await downloadPromise;

  // 4. Verify PDF download
  expect(download.suggestedFilename()).toMatch(/\.json$/i);
  expect(await download.failure()).toBeNull();
});

test('Test7: Filter', async ({ page }) => {
  await openJobsPage(page);

  const jobIds = page.getByText(/^Job ID:/);
  await expect(jobIds.first()).toBeVisible();
  const originalCount = await jobIds.count();
  expect(originalCount).toBeGreaterThan(0);

  const startDate = page.locator('input[type="date"]').nth(0);
  const endDate = page.locator('input[type="date"]').nth(1);

  // 1. Date range includes existing jobs
  await startDate.fill('2025-09-25');
  await endDate.fill('2025-09-27');

  await expect(jobIds).toHaveCount(originalCount);

  // 2. Date range excludes existing jobs
  await startDate.fill('2025-10-01');
  await endDate.fill('2025-10-02');

  await expect(jobIds).toHaveCount(0);

  // 3. Reset date filters
  await page.getByRole('button', { name: 'Reset' }).click();

  await expect(startDate).toHaveValue('');
  await expect(endDate).toHaveValue('');
  await expect(jobIds).toHaveCount(originalCount);
});