
import { test, expect } from '@playwright/test';

test.describe('Jobs API', () => {
  test('GET jobs summary returns 200', async ({ request }) => {
    const response = await request.get('/api/jobs/explorer/summary');
    expect(response.status()).toBe(200);
  });

  test('GET existing job detail returns 200', async ({ request }) => {
    const response = await request.get('/api/jobs/job_1');
    expect(response.status()).toBe(200);
  });

  test('GET nonexistent job returns 404', async ({ request }) => {
    const response = await request.get(
      '/api/jobs/nonexistent-playwright-job-999999'
    );
    expect(response.status()).toBe(404);
  });

  test('POST download multiple jobs rejects invalid body', async ({ request }) => {
    const response = await request.post('/api/jobs/download/multiple', {
      data: { job_ids: 'invalid-type' },
    });

    expect(response.status()).toBe(422);
  });

  test('GET jobs summary returns valid data', async ({ request }) => {
  const response = await request.get('/api/jobs/explorer/summary');

  expect(response.status()).toBe(200);

  const body = await response.json();

  expect(body).toHaveProperty('user_id');
  expect(Array.isArray(body.jobs)).toBe(true);

  for (const job of body.jobs) {
    expect(job).toHaveProperty('job_id');
    expect(job).toHaveProperty('name');
    expect(job).toHaveProperty('requested');
    expect(typeof job.requested.cpu_cores).toBe('number');
  }
});
});
