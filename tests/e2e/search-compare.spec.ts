import { expect, test } from '@playwright/test';

test('可使用全站搜尋並操作收藏與比較', async ({ page }) => {
  await page.goto('/styles');
  await page.evaluate(() => {
    window.localStorage.clear();
  });
  await page.reload();

  await expect(page.getByTestId('global-search')).toHaveAttribute('data-ready', 'true');

  await page.getByRole('button', { name: /搜尋/ }).click();
  await page.getByRole('textbox', { name: '全站搜尋' }).fill('Glassmorphism');
  await page.locator('a[href="/styles/glassmorphism"]').first().click();

  await expect(page).toHaveURL(/\/styles\/glassmorphism/);

  const favoriteButton = page.getByRole('button', { name: '加入收藏' });
  await favoriteButton.click();
  await expect(page.getByRole('button', { name: '已收藏' })).toBeVisible();

  const compareButton = page.getByRole('button', { name: '加入比較' });
  await compareButton.click();
  await expect(page.getByRole('button', { name: '已加入比較' })).toBeVisible();
  await expect(page.getByText('已選 1 個項目')).toBeVisible();

  await page.reload();
  await expect.poll(() =>
    page.evaluate(() => JSON.parse(window.localStorage.getItem('ui-ux-pro-max:favorites') || '[]').length)
  ).toBe(1);
  await expect.poll(() =>
    page.evaluate(() => JSON.parse(window.localStorage.getItem('ui-ux-pro-max:compare') || '[]').length)
  ).toBe(1);
  await expect(page.getByText('已選 1 個項目')).toBeVisible();
});
