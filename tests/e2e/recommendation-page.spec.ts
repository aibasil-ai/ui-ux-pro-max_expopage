import { expect, test } from '@playwright/test';

test('推薦結果頁可切換模式並顯示可複製 prompt', async ({ page }) => {
  await page.goto('/products/software-saas/saas-general');
  await expect(page.getByTestId('recommendation-explorer')).toHaveAttribute('data-ready', 'true');

  const curatedTab = page.getByRole('tab', { name: '精選 3 組' });
  const bestTab = page.getByRole('tab', { name: '最佳推薦' });
  const allTab = page.getByRole('tab', { name: '全部瀏覽' });

  await expect(curatedTab).toBeVisible();
  await expect(page.getByRole('button', { name: '複製 Prompt' }).first()).toBeVisible();

  await bestTab.click();
  await expect(bestTab).toHaveAttribute('aria-selected', 'true');

  await allTab.click();
  await expect(allTab).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByLabel('用風格篩選')).toBeVisible();
});
