import { test, expect } from '@playwright/test';

test('Auto Waiting Demo', async ({ page }) => {
  await page.setContent(`
    <button id="submit" style="display:none">
      Submit
    </button>

    <script>
      setTimeout(() => {
        document.querySelector('#submit').style.display = 'block';
      }, 2000);
    </script>
  `);

  await page.locator('#submit').click();

  await expect(page.locator('#submit')).toBeVisible();
});

test('Auto Retry Assertion Demo', async ({ page }) => {
  await page.setContent(`
    <button id="save">Save</button>
    <p id="message"></p>

    <script>
      document.querySelector('#save').addEventListener('click', () => {
        setTimeout(() => {
          document.querySelector('#message').textContent =
            'Saved successfully';
        }, 2000);
      });
    </script>
  `);

  await page.locator('#save').click();

  await expect(page.locator('#message'))
    .toHaveText('Saved successfully');
});