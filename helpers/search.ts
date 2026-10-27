
import type { Page } from '@playwright/test';


export function getJobSearch(page: Page) {
  return page.getByPlaceholder(
    'Search by Job ID, Name, or Recommendation tip...'
  );
}


export function getSearchInput(page: Page) {
  return page.getByPlaceholder(
    'Search by Job Name or Job ID...'
  );
}
