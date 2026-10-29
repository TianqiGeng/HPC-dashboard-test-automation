
import { test, expect } from '@playwright/test';

test.describe('Auth API', () => {
  test('GET auth providers returns 200', async ({ request }) => {
    const response = await request.get('/api/auth/providers');
    expect(response.status()).toBe(200);
  });

  test('GET current user returns authenticated user', async ({ request }) => {
    const response = await request.get('/api/auth/me');

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.authenticated).toBe(true);
    expect(body.user.user_id).toBe('dev:1');
  });
});
