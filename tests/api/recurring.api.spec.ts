
import { test, expect } from '@playwright/test';

test.describe('Recurring Jobs API', () => {
  const userId = 'playwright-api-test';

  test('GET recurring jobs returns 200', async ({ request }) => {
    const response = await request.get('/api/recurring/alljobs');
    expect(response.status()).toBe(200);
  });

  test('GET recurring job names returns 200', async ({ request }) => {
    const response = await request.get('/api/recurring/jobs/names');
    expect(response.status()).toBe(200);
  });

  test('GET recurring names for user returns 200', async ({ request }) => {
    const response = await request.get('/api/recurring/jobs/names/user');
    expect(response.status()).toBe(200);
  });

  test('POST create recurring job rejects missing name', async ({ request }) => {
    const response = await request.post('/api/recurring/jobs', {
      data: { user_id: userId },
    });

    expect(response.status()).toBe(422);
  });

  test('POST create recurring job rejects empty name', async ({ request }) => {
    const response = await request.post('/api/recurring/jobs', {
      data: { rname: '', user_id: userId },
    });

    expect(response.status()).toBe(422);
  });

  test('PUT rename recurring job rejects missing fields', async ({ request }) => {
    const response = await request.put('/api/recurring/jobs/rename', {
      data: { new_rname: 'playwright-renamed' },
    });

    expect(response.status()).toBe(422);
  });

  test('DELETE unbind recurring job rejects missing fields', async ({ request }) => {
    const response = await request.delete('/api/recurring/jobs/unbind', {
      data: { user_id: userId },
    });

    expect(response.status()).toBe(422);
  });

      

   test('Recurring Job CRUD lifecycle', async ({ request }) => {
    const userId = 'dev:1';
    const originalName = `pw-test-${Date.now()}`;
    const renamedName = `${originalName}-updated`;

    let currentName = originalName;
    let created = false;

    
    async function recurringJobExists(name: string): Promise<boolean> {
        const response = await request.get('/api/recurring/alljobs');
        expect(response.status()).toBe(200);

        const body = await response.json();

      
        return JSON.stringify(body).includes(`"${name}"`);
    }

    try {
        // CREATE
        const createResponse = await request.post('/api/recurring/jobs', {
        data: {
            rname: originalName,
            user_id: userId,
            assoc_job_ids: [],
        },
        });

        expect(createResponse.status()).toBe(200);
        created = true;

        // READ
        expect(await recurringJobExists(originalName)).toBe(true);

        // UPDATE
        const renameResponse = await request.put('/api/recurring/jobs/rename', {
        data: {
            old_rname: originalName,
            new_rname: renamedName,
            user_id: userId,
        },
        });

        expect(renameResponse.status()).toBe(200);
        currentName = renamedName;

        // READ AFTER UPDATE
        expect(await recurringJobExists(renamedName)).toBe(true);
        expect(await recurringJobExists(originalName)).toBe(false);

        // DELETE
        const deleteResponse = await request.delete('/api/recurring/jobs/unbind', {
        data: {
            recurring_name: renamedName,
            user_id: userId,
        },
        });

        expect(deleteResponse.status()).toBe(200);
        created = false;

        // VERIFY DELETE
        expect(await recurringJobExists(renamedName)).toBe(false);

    } finally {
        
        if (created) {
        const cleanupResponse = await request.delete(
            '/api/recurring/jobs/unbind',
            {
            data: {
                recurring_name: currentName,
                user_id: userId,
            },
            }
        );

        if (!cleanupResponse.ok()) {
            console.warn(
            `Cleanup failed for ${currentName}: ${cleanupResponse.status()}`
            );
        }
        }
    }
    });
    test('Inspect recurring job names', async ({ request }) => {
        const response = await request.get('/api/recurring/jobs/names');

        // console.log('Status:', response.status());
        // console.log('Recurring names:', await response.text());

        expect(response.status()).toBe(200);
    });

});
