import { expect, test } from '@playwright/test';

test('首頁可載入並顯示主視覺標題', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/UI UX Pro Max 展示系統/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('先選產品類型');
  await expect(page.getByText('Prompt 使用者優先的 UI / UX 參考系統')).toBeVisible();
});
