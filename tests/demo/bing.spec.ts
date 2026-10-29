
import { test, expect } from '@playwright/test';

test('Bing Playwright', async ({ page }) => {
  await page.goto('https://www.bing.com/');

  const search = page.locator('#sb_form_q');
  await page.locator('#wrong-button').click({
    timeout: 3000
  });
  // 输入关键词
  await search.fill('Playwright');
  // 点击搜索
  await page.locator('#search_icon').click();

  // 验证搜索页面 URL
  
  // await expect(page).toHaveURL('Google',{
  //   timeout: 2000,
  // });
  await expect(page).toHaveURL('Google');
  
  //await expect(page).toHaveURL(/bing\.com\/search/);
  
});


//trace
// test('Bing API', async ({ page }) => {
//   await page.goto('https://www.bing.com');

//   // 故意请求一个不存在的接口
//   const status = await page.evaluate(async () => {
//     const response = await fetch('/api/not-found-demo');
//     return response.status;
//   });

//   // 故意断言请求成功
//   expect(status).toBe(200);
// });
