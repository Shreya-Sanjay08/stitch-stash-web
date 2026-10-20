import { expect, test } from '@playwright/test';

for (const width of [390, 1280]) {
  test.describe(`at ${width}px`, () => {
    test.use({ viewport: { width, height: 900 } });

    test('the homepage has no horizontal overflow', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('.animate-pulse').first()).toBeHidden({ timeout: 10000 });
      // Scroll to the bottom so scroll-driven decorations have moved.
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
      await page.waitForTimeout(300);

      const fits = await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth
      );
      expect(fits).toBe(true);
    });

    test('the login page has no horizontal overflow', async ({ page }) => {
      await page.goto('/login');
      const fits = await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth
      );
      expect(fits).toBe(true);
    });
  });
}

test('the lightbox opens and closes', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.animate-pulse').first()).toBeHidden({ timeout: 10000 });

  const trigger = page.getByRole('button', { name: /^View .* larger$/ }).first();
  // The live database may have no products; the lightbox can only be tested when it has some.
  test.skip((await trigger.count()) === 0, 'no products in the connected database');

  await trigger.scrollIntoViewIfNeeded();
  await trigger.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});
