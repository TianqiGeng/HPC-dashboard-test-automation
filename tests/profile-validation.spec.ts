import { test, expect, type Page  } from '@playwright/test';
import { openProfile } from '../helpers/navigation';

// 1. Open Profile
export async function openProfile(page: Page) {
  await page.goto('/');
  await page.getByText('Profile', { exact: true }).click();
}

// 2. Find recurring job and get its name
export async function getRecurringJob(page: Page) {
  const recurringJob = page.getByText(/^playwright-recurring-/).first();

  await expect(recurringJob).toBeVisible();

  const oldRecurringName = (await recurringJob.innerText()).trim();
  const row = recurringJob.locator('..');
  return { row, oldRecurringName };
}

// 3. Verify recurring job exists
export async function verifyRecurringJobExists(
  page: Page,
  name: string
) {
  await expect(
    page.getByText(name, { exact: true })
  ).toBeVisible();
}

// 4. Verify recurring job does not exist
export async function verifyRecurringJobNotExists(
  page: Page,
  name: string
) {
  await expect(
    page.getByText(name, { exact: true })
  ).toHaveCount(0);
}


export async function openAnalysis(page: Page) {
  await page.getByText('Recurring Analysis', { exact: true }).click();
}

test('Test1: Rename recurring job name successfly', async ({ page }) => {

  await openProfile(page)

  const { row, oldRecurringName }=  await getRecurringJob(page)

  const newRecurringName = `${oldRecurringName}-${Date.now()}`;

  page.once('dialog', async (dialog) => {
    expect(dialog.type()).toBe('prompt');
    await dialog.accept(newRecurringName);
  });
  await row.getByTitle('Rename').click();
  
  await verifyRecurringJobExists(page,newRecurringName)
  await verifyRecurringJobNotExists(page,oldRecurringName)
  await openAnalysis(page)
  await verifyRecurringJobExists(page,newRecurringName)


  /* old code
  // await page.goto('/');
  // await page.getByText('Profile', { exact: true }).click();

  // 2. prepare Recurring Job
  // const recurringJob = page.getByText(/^playwright-recurring-/).first();
  // await expect(recurringJob).toBeVisible();

  // const oldName = (await recurringJob.innerText()).trim();
  // const newName = `${oldName}-${Date.now()}`;

  // 3. rename
  
  // page.once('dialog', async (dialog) => {
  //   expect(dialog.type()).toBe('prompt');
  //   await dialog.accept(newName);
  // });

  // 4. click rename
  // const row = recurringJob.locator('..');
  // await row.getByTitle('Rename').click();

  // 5. valication Profile 
  // await expect(
  //   page.getByText(newName, { exact: true })
  // ).toBeVisible();

  // await expect(
  //   page.getByText(oldName, { exact: true })
  // ).toHaveCount(0);

  // 6.  Recurring Analysis
  await page.getByText('Recurring Analysis', { exact: true }).click();

  // 7. newname
  await expect(
    page.getByText(newName, { exact: true })
  ).toBeVisible();

  //console.log(`Renamed: ${oldName} → ${newName}`);
  */
});

test('Test2: Cancel renaming recurring job name', async ({ page }) => {
  await openProfile(page)

  const { row, oldRecurringName }=  await getRecurringJob(page)

  page.once('dialog', async (dialog) => {
    expect(dialog.type()).toBe('prompt');
    await dialog.dismiss();
  });
  await row.getByTitle('Rename').click();
  
  await verifyRecurringJobExists(page,oldRecurringName)
  
  await openAnalysis(page)
  await verifyRecurringJobExists(page,oldRecurringName)
  //version one
  // await page.goto('/');
  // await page.getByText('Profile', { exact: true }).click();

  // // 2. prepare Recurring Job
  // const recurringJob = page.getByText(/^playwright-recurring-/).first();
  // await expect(recurringJob).toBeVisible();

  // const name = (await recurringJob.innerText()).trim();


  // // 3. rename
  
  // page.once('dialog', async (dialog) => {
  //   expect(dialog.type()).toBe('prompt');
  //   await dialog.dismiss();
  // });

  // // 4. click rename
  // const row = recurringJob.locator('..');
  // await row.getByTitle('Rename').click();

  // // 5. valication Profile 
  // await expect(
  //   page.getByText(name, { exact: true })
  // ).toBeVisible();

  // // 6.  Recurring Analysis
  // await page.getByText('Recurring Analysis', { exact: true }).click();

  // // 7. newname
  // await expect(
  //   page.getByText(name, { exact: true })
  // ).toBeVisible({ timeout: 15000 });

});


test('Test3: Delete recurring job successful', async ({ page }) => {
  await openProfile(page)

  const { row, oldRecurringName }=  await getRecurringJob(page)

  page.once('dialog', async (dialog) => {
    expect(dialog.type()).toBe('confirm');
    await dialog.accept();
  });
  await row.getByTitle('Delete').click();
  
  await verifyRecurringJobNotExists(page,oldRecurringName)
  
  await openAnalysis(page)
  await verifyRecurringJobNotExists(page,oldRecurringName)
  // old version
  // await page.goto('/');
  // await page.getByText('Profile', { exact: true }).click();

  // // 2. prepare Recurring Job
  // const recurringJob = page.getByText(/^playwright-recurring-/).first();
  // await expect(recurringJob).toBeVisible();

  // const name = (await recurringJob.innerText()).trim();

  // // 3. rename
  
  // page.once('dialog', async (dialog) => {
  //   expect(dialog.type()).toBe('confirm');
  //   await dialog.accept();
  // });

  // // 4. click rename
  // const row = recurringJob.locator('..');
  // await row.getByTitle('Delete').click();

  // // 5. valication Profile 

  // await expect(
  //   page.getByText(name, { exact: true })
  // ).toHaveCount(0);

  // // 6.  Recurring Analysis
  // await page.getByText('Recurring Analysis', { exact: true }).click();

  // // 7. newname

  
  // await expect(
  //   page.getByText(name, { exact: true })
  // ).toHaveCount(0);
});

test('Test4: Cancel deleting recurring job', async ({ page }) => {
  await openProfile(page)

  const { row, oldRecurringName }=  await getRecurringJob(page)

  page.once('dialog', async (dialog) => {
    expect(dialog.type()).toBe('confirm');
    await dialog.dismiss();
  });
  await row.getByTitle('Delete').click();
  
  await verifyRecurringJobExists(page,oldRecurringName)
  
  await openAnalysis(page)
  await verifyRecurringJobExists(page,oldRecurringName)

  // await page.goto('/');
  // await page.getByText('Profile', { exact: true }).click();

  // // 2. prepare Recurring Job
  // const recurringJob = page.getByText(/^playwright-recurring-/).first();
  // await expect(recurringJob).toBeVisible();

  // const name = (await recurringJob.innerText()).trim();

  // // 3. rename
  
  // page.once('dialog', async (dialog) => {
  //   expect(dialog.type()).toBe('confirm');
  //   await dialog.dismiss();
  // });

  // // 4. click rename
  // const row = recurringJob.locator('..');
  // await row.getByTitle('Delete').click();

  // // 4. valication Profile 

  // await expect(
  //   page.getByText(name, { exact: true })
  // ).toBeVisible();

  // // 4.  Recurring Analysis
  // await page.getByText('Recurring Analysis', { exact: true }).click();

  // // 6. newname
  // await expect(
  //   page.getByText(name, { exact: true })
  // ).toBeVisible();
});

test('Test5: search particle recurring job name successfly', async ({ page }) => {

  await openProfile(page)

  const { row, oldRecurringName }=  await getRecurringJob(page)
  const timestamp = Date.now().toString();
  const newRecurringName = `search-recurring-${timestamp}`;

  page.once('dialog', async (dialog) => {
    expect(dialog.type()).toBe('prompt');
    await dialog.accept(newRecurringName);
  });
  await row.getByTitle('Rename').click();
  
  await verifyRecurringJobExists(page,newRecurringName)
  await openAnalysis(page)
  await verifyRecurringJobExists(page,newRecurringName)

  //search
  const search =page.getByPlaceholder('Search by Job Name or Job ID...');
  await search.fill(timestamp);

  await expect(
      page.getByText(/^Job ID:/)
  ).toHaveCount(1);

  //rename
  await openProfile(page);

  const renamedJob = page.getByText(newRecurringName, { exact: true });
  await expect(renamedJob).toBeVisible();

  const renamedRow = renamedJob.locator('..');

  page.once('dialog', dialog => dialog.accept(oldRecurringName));
  await renamedRow.getByRole('button', { name: 'Rename' }).click();

  await expect(
    page.getByText(oldRecurringName, { exact: true })
  ).toBeVisible();
    
  });