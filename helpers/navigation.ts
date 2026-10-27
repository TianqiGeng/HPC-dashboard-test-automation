
import { expect, type Page } from '@playwright/test';


export async function openUploadPage(page: Page) {
  await page.goto('/');
  await page.getByText('Upload', { exact: true }).click();

  await expect(
    page.getByRole('button', { name: 'Submit Job data' })
  ).toBeVisible();
}


export async function openProfile(page: Page) {
  await page.goto('/');
  await page.getByText('Profile', { exact: true }).click();
}


export async function openAnalysis(page: Page) {
  await page.goto('/');
  await page.getByText('Recurring Analysis', { exact: true }).click();
}


export async function openJobsPage(page: Page) {
  await page.goto('/');
  await page.getByText('Jobs', { exact: true }).click();

  await expect(
    page.getByRole('button', { name: 'Export JSON' })
  ).toBeVisible();
}
