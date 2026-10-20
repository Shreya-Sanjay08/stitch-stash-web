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

    test('no product card button label wraps onto two lines', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('.animate-pulse').first()).toBeHidden({ timeout: 10000 });

      const buttons = page.locator('.card-actions a');
      // The live database may have no available products; there is nothing to check then.
      test.skip((await buttons.count()) === 0, 'no available products in the connected database');

      const lineCounts = await buttons.evaluateAll((links) =>
        links.map((link) => {
          // One client rect per line of text: more than one distinct top means the label wrapped.
          const range = document.createRange();
          range.selectNodeContents(link);
          const tops = new Set(Array.from(range.getClientRects()).map((r) => Math.round(r.top)));
          return { label: link.textContent, lines: tops.size, height: link.getBoundingClientRect().height };
        })
      );

      for (const { label, lines, height } of lineCounts) {
        expect(lines, `"${label}" should be on one line`).toBe(1);
        expect(height, `"${label}" should be at least 44px tall`).toBeGreaterThanOrEqual(44);
      }

      const fits = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
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
