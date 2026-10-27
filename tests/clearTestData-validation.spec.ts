import { test, expect, type Page } from '@playwright/test';
import { openJobsPage, openProfile  } from '../helpers/navigation';

// async function openJobsPage(page: Page) {
//   await page.goto('/');
//   await page.getByText('Jobs', { exact: true }).click();

//   await expect( page.getByRole('button', { name: 'Export JSON' }) ).toBeVisible();
// }


test('Cleanup test jobs', async ({ page }) => {
  await openJobsPage(page);
  await expect(
    page.getByRole('button', { name: 'Export JSON' })
  ).toBeVisible();  
  await page.waitForLoadState('networkidle');
  //console.log(await page.getByText(/^playwright-job-/).count())
  while (await page.getByText(/^playwright-job-/).count() > 0) {
    const job = page.getByText(/^playwright-job-/).first();
    const jobName = (await job.innerText()).trim();

    const card = job.locator(
      'xpath=ancestor::*[.//button[@aria-label]][1]'
    );

    await card.locator(
      'button[aria-label^="Open actions for "]'
    ).click();

    await page.getByText('Delete Job', { exact: true }).click();

    
    await expect(
      page.getByText(jobName, { exact: true })
    ).toHaveCount(0, { timeout: 15000 });

    console.log('Deleted:', jobName);
  }
    //console.log('no job')
});


test('Delete recurring job successful', async ({ page }) => {
  await openProfile(page)
  let deletedRecurringCount = 0;
  await page.waitForLoadState('networkidle');
   //console.log(await page.getByText(/^playwright-recurring-/).count())
   while (true) {
    const recurringJobs = page.getByText(/^playwright-recurring-/);

    if (await recurringJobs.count() === 0) {
      break;
    }

      // 2. prepare Recurring Job
    const recurringJob = page.getByText(/^playwright-recurring-/).first();
    await expect(recurringJob).toBeVisible();

    const name = (await recurringJob.innerText()).trim();

    // 3. rename
    
    page.once('dialog', async (dialog) => {
      expect(dialog.type()).toBe('confirm');
      await dialog.accept();
    });

    // 4. click rename
    const row = recurringJob.locator('..');
    await row.getByTitle('Delete').click();

    // 5. valication Profile 

    await expect(
      page.getByText(name, { exact: true })
    ).toHaveCount(0);

    deletedRecurringCount++;
        console.log('Deleted recurring job:', name);
    }
  
});