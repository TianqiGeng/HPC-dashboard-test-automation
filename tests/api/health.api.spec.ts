import { test, expect } from '@playwright/test';

test('GET /health returns 200', async ({ request }) => {
  const response = await request.get('/health');

  expect(response.status()).toBe(200);
});

test('GET /openapi.json returns API specification', async ({ request }) => {
  const response = await request.get('/openapi.json');

  expect(response.status()).toBe(200);

  const body = await response.json();

  expect(body.openapi).toBe('3.0.3');
  expect(body.info.title).toBe('HPC Dashboard API');
});

test('Check API user', async ({ request }) => {
  const response = await request.get('/api/auth/me');

  console.log('Status:', response.status());
  console.log('User:', await response.text());
});


test('GET /api/jobs/explorer/summary returns 200', async ({ request }) => {
  const response = await request.get('/api/jobs/explorer/summary');
  const body = await response.json();
  console.log(JSON.stringify(body, null, 2));
  expect(response.status()).toBe(200);
});