
import { test, expect } from '@playwright/test';

// 1. 正常搜索：查看 Actions 和 Snapshots
test('01 - Bing Search', async ({ page }) => {
  await page.goto('https://www.bing.com/');

  await page.locator('#sb_form_q').fill('Playwright');
  await page.locator('#search_icon').click();

  await expect(page).toHaveURL(/bing\.com\/search/);
});

// 2. 元素定位失败：查看 Call Log
test('02 - Locator Error', async ({ page }) => {
  await page.goto('https://www.bing.com/');

  await page.locator('#wrong-button').click({
    timeout: 3000
  });
});

// 3. API 请求失败：查看 Network
test('03 - API Error', async ({ page }) => {
  await page.goto('https://www.bing.com/');

  const status = await page.evaluate(async () => {
    const response = await fetch('/api/not-found-demo');
    return response.status;
  });

  expect(status).toBe(200);
});

// 4. 断言失败：查看 Errors 和 Source
test('04 - Assertion Error', async ({ page }) => {
  await page.goto('https://www.bing.com/');

  await page.locator('#sb_form_q').fill('Playwright');
  await page.locator('#search_icon').click();

  await expect(page).toHaveURL('https://www.google.com/');
});
