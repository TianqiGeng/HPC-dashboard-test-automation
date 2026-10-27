/**
 * Upload Module - E2E Tests
 *
 * Test coverage:
 * - Required field validation
 * - Regular job upload
 * - New recurring job creation
 * - Associate multiple jobs with an existing recurring job
 *
 * Framework: Playwright + TypeScript
 */

import { test, expect, type Page } from '@playwright/test';



async function openUploadPage(page: Page) {
  await page.goto('/');
  await page.getByText('Upload', { exact: true }).click();

  await expect( page.getByRole('button', { name: 'Submit Job data' }) ).toBeVisible();
}


async function uploadFiles(page: Page) {
  const fileInputs = page.locator('input[type="file"]');

  await fileInputs.nth(0).setInputFiles('test-data/demo_job_12.txt');
  await fileInputs.nth(1).setInputFiles('test-data/demo_metrics_13.jsonl');
}

async function submitJob(page: Page, jobName: string,  recurring?: {
    name: string;
    mode: 'new' | 'existing';
}) 
{
//   await page.getByLabel('Job Name').fill(jobName);
  await page.locator('#job-name').fill(jobName);
  

  if (recurring) {
    await page.getByRole('checkbox', {
      name: 'Recurring job'
    }).check();

    if (recurring.mode === 'new') {
      await page.getByLabel('New recurring job name')
        .fill(recurring.name);
    } else {
      await page.locator('select').selectOption({
        label: recurring.name
      });
      await page.waitForTimeout(1000)
    }
  }

  const submitButton = page.getByRole('button', {
    name: 'Submit Job data'
  });

  await expect(submitButton).toBeEnabled();
  await submitButton.click();

  //successfully
  await expect(
    page.getByText('Success! Stored job successfully', { exact: false })
  ).toBeVisible({ timeout: 15000 });

}




test('Test1: Submit is disabled without Metrics JSON', async ({ page }) => {
  await openUploadPage(page);
  const fileInputs = page.locator('input[type="file"]');
  await fileInputs.nth(0).setInputFiles('test-data/demo_job_12.txt');
  await expect(
    page.getByRole('button', { name: 'Submit Job data' })
  ).toBeDisabled();
});

test('Test2: Submit disabled without Job Name', async ({ page }) => {
  await openUploadPage(page);
  await uploadFiles(page);
  await expect(
    page.getByRole('button', { name: 'Submit Job data' })
  ).toBeDisabled();
});



test('Test3: Submit enabled when form is complete - job', async ({ page }) => {
  const jobName = `playwright-job-${Date.now()}`;
  await openUploadPage(page);
  await uploadFiles(page);
  await submitJob(page,jobName);
 
  await page.getByText('Jobs', { exact: true }).click();
  const start = Date.now();
  await expect(
    page.getByText(jobName, { exact: true })
  ).toBeVisible({ timeout: 1000 });
  console.log('Job visible after ' + (Date.now() - start) + 'ms');
});


test('Test4: Submit enabled when form is complete - recurring job', async ({ page }) => {
    const recurringName = `playwright-recurring-${Date.now()}`;
    const jobName = `playwright-job-${Date.now()}`;  

    await openUploadPage(page);
    await uploadFiles(page);
     await submitJob(page,jobName,{
        name:recurringName,
        mode:'new'
    });

 
    await page.getByText('Profile', { exact: true }).click();
   
    await expect(
    page.getByText(recurringName, { exact: true })
    ).toBeVisible();
});

test('Test5: Submit enabled when form is complete - recurring job2', async ({ page }) => {
  const recurringName = `playwright-recurring-${Date.now()}`;
  const jobName = `playwright-job-${crypto.randomUUID()}`;  
   
  await openUploadPage(page);
  await uploadFiles(page);
  await submitJob(page,jobName,{
        name:recurringName,
        mode:'new'
    });

  const recurringName1=recurringName
  
  
  //second
  await page.waitForTimeout(1000)
  const jobName2 = `playwright-job-${crypto.randomUUID()}`;
  await uploadFiles(page);
  await submitJob(page,jobName2,{
    name:recurringName1,
    mode:'existing'
  });

//   const jobName2 = `playwright-job-${Date.now()}`;
//   await page.getByLabel('Job Name').fill(jobName2);
//   await page.getByText('Recurring job', { exact: true }).click();

//   await page.locator('select').selectOption({
//   label: recurringName1
// });

//   await page.getByRole('button', { name: 'Submit Job data' }).click();


  await page.getByText('Recurring Analysis', { exact: true }).click();


  const card = page.locator('article').filter({
  has: page.getByRole('heading', {
    name: recurringName1,
    exact: true
  })
});

 await expect(
   card.getByText('2 runs', { exact: true })
 ).toBeVisible();
});

