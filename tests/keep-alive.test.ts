import { beforeEach, describe, expect, it, vi } from 'vitest';

const limit = vi.fn();
const select = vi.fn(() => ({ limit }));
const from = vi.fn(() => ({ select }));

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({ from })),
}));

import { GET } from '../app/api/cron/keep-alive/route';

const SECRET = 'test-secret';

function makeRequest(authorization?: string) {
  return new Request('http://localhost/api/cron/keep-alive', {
    headers: authorization ? { authorization } : {},
  });
}

describe('GET /api/cron/keep-alive', () => {
  beforeEach(() => {
    vi.stubEnv('CRON_SECRET', SECRET);
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'http://supabase.test');
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'anon-test-key');
    limit.mockReset();
    limit.mockResolvedValue({ data: [{ id: '1' }], error: null });
  });

  it('returns 401 with no authorization header', async () => {
    const res = await GET(makeRequest());
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ ok: false });
    expect(limit).not.toHaveBeenCalled();
  });

  it('returns 401 with a wrong secret', async () => {
    const res = await GET(makeRequest('Bearer wrong-secret'));
    expect(res.status).toBe(401);
    expect(limit).not.toHaveBeenCalled();
  });

  it('returns 401 when CRON_SECRET is unset, even for a matching-looking header', async () => {
    vi.stubEnv('CRON_SECRET', '');
    const res = await GET(makeRequest('Bearer '));
    expect(res.status).toBe(401);
    const res2 = await GET(makeRequest('Bearer undefined'));
    expect(res2.status).toBe(401);
    expect(limit).not.toHaveBeenCalled();
  });

  it('returns 200 with ok true for the correct Bearer secret', async () => {
    const res = await GET(makeRequest(`Bearer ${SECRET}`));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(typeof body.checkedAt).toBe('string');
    expect(from).toHaveBeenCalledWith('products');
    expect(select).toHaveBeenCalledWith('id');
    expect(limit).toHaveBeenCalledWith(1);
  });

  it('returns 500 without leaking details when the query errors', async () => {
    limit.mockResolvedValue({ data: null, error: { message: 'secret db detail' } });
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const res = await GET(makeRequest(`Bearer ${SECRET}`));
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ ok: false });
    spy.mockRestore();
  });
});
