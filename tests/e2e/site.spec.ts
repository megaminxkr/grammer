import { test, expect } from '@playwright/test';
test('home, curriculum, lesson, and answer disclosure work under the Pages base', async ({ page }) => {
  await page.goto('/grammer/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('英文法を、');
  await page.getByRole('link', { name: '学習マップを見る' }).click();
  await expect(page).toHaveURL(/grammer\/chapters\//);
  await page.locator('.chapter-card').filter({ hasText: '文型' }).click();
  await page.locator('.lesson-card').first().click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('文の要素と5文型');
  const answer = page.locator('.prose details').first();
  await expect(answer).not.toHaveAttribute('open', '');
  await answer.locator('summary').click();
  await expect(answer).toHaveAttribute('open', '');
  await expect(answer).toContainText('SVC');
  await page.getByRole('link', { name: '次の教材' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('現在完了と過去形の違い');
});
test('all three samples have headings, structure figures, and explanations', async ({ page }) => {
  for (const id of ['ega-01-01', 'ega-03-04', 'ega-12-01']) {
    await page.goto(`/grammer/lessons/${id}/`);
    await expect(page.locator('main h1')).toHaveCount(1);
    await expect(page.locator('.prose figure').first()).toBeVisible();
    await expect(page.getByRole('heading', { name: '重要事項のまとめ' })).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});
test('preferences persist on reload, and mobile navigation opens by keyboard', async ({ page, isMobile }) => {
  await page.goto('/grammer/');
  const theme = page.getByRole('button', { name: 'ダークモード' });
  await theme.click(); const pressed = await theme.getAttribute('aria-pressed');
  await page.reload();
  await expect(theme).toHaveAttribute('aria-pressed', pressed!);
  await page.getByRole('button', { name: '文字を大きくする' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-font', 'large');
  if (isMobile) {
    const menu = page.locator('.chapter-menu');
    await menu.locator('summary').focus(); await page.keyboard.press('Enter');
    await expect(menu).toHaveAttribute('open', '');
    await expect(menu.getByRole('link').filter({ hasText: '文法の前提知識' })).toBeVisible();
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
test('unavailable local storage does not break navigation or display controls', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('Blocked', 'SecurityError'); } }));
  await page.goto('/grammer/');
  await page.getByRole('button', { name: '文字を大きくする' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-font', 'large');
  await page.getByRole('link', { name: '学習マップを見る' }).click();
  await expect(page.locator('main h1')).toHaveText('英文法の学習マップ');
});
