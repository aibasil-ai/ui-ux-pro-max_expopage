import { expect, test } from '@playwright/test';

test('規則中心與三種規則 detail 頁可載入', async ({ page }) => {
  await page.goto('/rules');
  await expect(page.getByRole('heading', { name: '規則中心' })).toBeVisible();
  await expect(page.getByRole('link', { name: /UX 指南/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /推理規則/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /專門規則/ })).toBeVisible();

  await page.goto('/rules/ux');
  await expect(page.getByRole('heading', { name: '99 條 UX 指南' })).toBeVisible();
  await page.getByRole('link', { name: /Smooth Scroll/ }).click();
  await expect(page).toHaveURL(/\/rules\/ux\/smooth-scroll/);
  await expect(page.getByRole('heading', { name: 'Smooth Scroll' })).toBeVisible();
  await expect(page.getByText(/^Do$/).first()).toBeVisible();
  await expect(page.getByText(/^Don't$/).first()).toBeVisible();

  await page.goto('/rules/reasoning/saas-general');
  await expect(page.getByRole('heading', { name: 'SaaS (General)' })).toBeVisible();
  await expect(page.getByText('Recommended Pattern')).toBeVisible();
  await expect(page.getByText('Decision Rules')).toBeVisible();

  await page.goto('/rules/special/icon-button-labels');
  await expect(page.getByRole('heading', { name: 'Icon Button Labels' })).toBeVisible();
  await expect(page.getByText(/^Do$/).first()).toBeVisible();
});
