import { expect, test } from '@playwright/test';

test.describe('Public pages', () => {
  test('signed-out visit to /admin redirects to /login', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/login$/);
  });

  test('/login has an email field, a password field, and no sign-up/register content', async ({ page }) => {
    await page.goto('/login');

    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();

    const bodyText = await page.locator('body').innerText();
    expect(bodyText).not.toMatch(/sign up/i);
    expect(bodyText).not.toMatch(/register/i);

    const signUpLinks = page.locator('a', { hasText: /sign up|register/i });
    await expect(signUpLinks).toHaveCount(0);
  });

  test('the homepage loads and the search box filters cards', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Stitch Stash' })).toBeVisible();

    // Wait for the initial Supabase fetch (loading skeleton) to resolve before
    // interacting with search, otherwise "0 pieces found" can be a false
    // positive from the still-empty initial state rather than a real filter result.
    await expect(page.locator('.animate-pulse').first()).toBeHidden({ timeout: 10000 });

    const searchInput = page.getByPlaceholder('Search handmade creations...');
    await expect(searchInput).toBeVisible();

    // A near-impossible string to match any real product, so this holds
    // regardless of what is actually in the connected Supabase database.
    await searchInput.fill('zzzzzzzznonexistentproduct12345');

    await expect(page.getByText('0 pieces found')).toBeVisible();
    await expect(page.getByText('No creations match your search.')).toBeVisible();
  });
});
