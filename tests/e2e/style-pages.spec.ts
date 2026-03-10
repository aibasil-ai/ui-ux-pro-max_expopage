import { expect, test } from '@playwright/test';

test('代表性 style 頁可載入並顯示 prompt 與 preview', async ({ page }) => {
  await page.goto('/styles/glassmorphism');
  await expect(page.locator('h1')).toHaveText('Glassmorphism');
  await expect(page.getByText('Live Preview')).toBeVisible();
  await expect(page.getByRole('button', { name: '複製文字' })).toBeVisible();

  await page.goto('/styles/brutalism');
  await expect(page.locator('h1')).toHaveText('Brutalism');
  await expect(page.getByText('Raw energy')).toBeVisible();

  await page.goto('/styles/executive-dashboard');
  await expect(page.locator('h1')).toHaveText('Executive Dashboard');
  await expect(page.getByText('Primary Chart')).toBeVisible();
});
