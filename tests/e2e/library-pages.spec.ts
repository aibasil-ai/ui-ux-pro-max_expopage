import { expect, test } from '@playwright/test';

test('colors typography charts index 與 detail 頁可載入', async ({ page }) => {
  await page.goto('/colors');
  await expect(page.getByRole('heading', { name: '96 組配色方案' })).toBeVisible();
  await page.goto('/colors/saas-general');
  await expect(page.getByRole('heading', { name: 'SaaS (General)' })).toBeVisible();

  await page.goto('/typography');
  await expect(page.getByRole('heading', { name: '57 組字體展示' })).toBeVisible();
  await page.goto('/typography/classic-elegant');
  await expect(page.getByRole('heading', { name: 'Classic Elegant' })).toBeVisible();

  await page.goto('/charts');
  await expect(page.getByRole('heading', { name: '25 種圖表展示' })).toBeVisible();
  await page.goto('/charts/line-chart');
  await expect(page.getByRole('heading', { name: 'Line Chart' })).toBeVisible();
});
