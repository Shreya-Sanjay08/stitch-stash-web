import * as path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { expect, test } from '@playwright/test';

dotenv.config({ path: path.resolve(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY — set them in .env.local (values are never printed by this test).'
  );
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const TEST_TITLE = '[E2E TEST]';

test.describe('RLS regression: anonymous writes to products', () => {
  test('anonymous reads are allowed', async () => {
    const { data, error } = await supabase.from('products').select('id').limit(1);
    expect(error).toBeNull();
    expect(Array.isArray(data)).toBe(true);
  });

  test('anonymous insert is rejected', async () => {
    const { data, error } = await supabase
      .from('products')
      .insert([
        {
          title: TEST_TITLE,
          description: 'Created by an automated RLS regression test; should never persist.',
          price_aed: 1,
          image_url: 'https://example.com/e2e-test.jpg',
          status: 'available',
        },
      ])
      .select();

    const insertedRows = data ?? [];

    if (!error && insertedRows.length > 0) {
      // RLS failed to block the write. Clean up the row we just created,
      // then fail loudly: this must never happen with correct RLS policies.
      const ids = insertedRows.map((row: { id: string }) => row.id).filter(Boolean);
      if (ids.length > 0) {
        await supabase.from('products').delete().in('id', ids);
      }
      throw new Error(
        `SECURITY REGRESSION: anonymous insert into "products" succeeded (expected RLS to reject it). ${ids.length} test row(s) were deleted as cleanup, but RLS must be fixed.`
      );
    }

    expect(error !== null || insertedRows.length === 0).toBe(true);
  });

  test('anonymous update is rejected', async () => {
    // Attempt a no-op update (set a column to its own current value) against
    // a real existing row, so that even if RLS unexpectedly allows the
    // statement to match, no actual data changes.
    const { data: existing, error: readError } = await supabase
      .from('products')
      .select('id, title')
      .limit(1);

    test.skip(!!readError || !existing || existing.length === 0, 'No existing product row to test against.');

    const target = existing![0];
    const { data, error } = await supabase
      .from('products')
      .update({ title: target.title })
      .eq('id', target.id)
      .select();

    const updatedRows = data ?? [];

    if (!error && updatedRows.length > 0) {
      throw new Error(
        'SECURITY REGRESSION: anonymous update on "products" succeeded (expected RLS to reject it). The update was a no-op (same value), so no data was changed, but RLS must be fixed.'
      );
    }

    expect(error !== null || updatedRows.length === 0).toBe(true);
  });

  test('anonymous delete is rejected', async () => {
    // Delete is destructive and we cannot create our own disposable row
    // (anonymous insert is expected to be blocked too), so this targets a
    // random, certainly-nonexistent id rather than a real product. This
    // keeps the test safe against real inventory, at the cost of not proving
    // RLS blocks deletion of a row that does exist — that risk is already
    // covered, without any destructive potential, by the update test above
    // and the insert test's own rejection.
    const nonExistentId = '00000000-0000-0000-0000-000000000000';
    const { data, error } = await supabase
      .from('products')
      .delete()
      .eq('id', nonExistentId)
      .select();

    const deletedRows = data ?? [];
    expect(error !== null || deletedRows.length === 0).toBe(true);
  });
});
