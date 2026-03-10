import { expect, test } from '@playwright/test';

test('可從首頁選擇產品大類並進入對應產品頁', async ({ page }) => {
  await page.goto('/');

  await page.getByLabel('選擇產品大類').selectOption('software-saas');
  await expect(page.getByLabel('選擇產品細類')).toContainText('SaaS (General)');

  const actionLink = page.getByRole('link', { name: '查看推薦方向' });
  await expect(actionLink).toHaveAttribute('href', /\/products\/software-saas\//);
  await actionLink.click();

  await expect(page).toHaveURL(/\/products\/software-saas\//);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});
