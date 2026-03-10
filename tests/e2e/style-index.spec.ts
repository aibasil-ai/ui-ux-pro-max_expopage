import { expect, test } from '@playwright/test';

test('style index 可篩選並進入 detail page', async ({ page }) => {
  await page.goto('/styles');
  await expect(page.locator('h1')).toHaveText('67 種風格索引頁');
  await page.getByLabel('風格類型').selectOption('Landing Page');
  await page.getByLabel('搜尋風格').fill('Storytelling');
  await page.getByRole('link', { name: /Storytelling-Driven/ }).click();
  await expect(page).toHaveURL(/\/styles\/storytelling-driven/);
  await expect(page.locator('h1')).toHaveText('Storytelling-Driven');
});
