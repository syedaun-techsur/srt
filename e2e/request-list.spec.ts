import { test, expect } from '@playwright/test';

test.describe('RequestList component', () => {

  test('shows empty state when API returns empty array', async ({ page }) => {
    // Mock the API to return empty array
    await page.route('**/api/requests', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
    );

    await page.goto('/');
    // Navigate to list view (default)
    await expect(page.getByText('No requests submitted yet.')).toBeVisible();
  });

  test('renders table with Name, Request Title, Description columns when data exists', async ({ page }) => {
    const mockData = [
      { id: 1, name: 'Alice', title: 'Fix login bug', description: 'Login crashes on mobile.', createdAt: '2026-05-19T14:32:00' },
      { id: 2, name: 'Bob', title: 'Add export feature', description: 'Export to CSV.', createdAt: '2026-05-19T14:45:00' },
    ];

    await page.route('**/api/requests', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mockData) })
    );

    await page.goto('/');

    // Table headers
    await expect(page.getByRole('columnheader', { name: 'Name' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Request Title' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Description' })).toBeVisible();

    // Data rows
    await expect(page.getByRole('cell', { name: 'Alice' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Fix login bug' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Login crashes on mobile.' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Bob' })).toBeVisible();
  });

  test('shows error message when backend is unreachable', async ({ page }) => {
    await page.route('**/api/requests', (route) => route.abort('failed'));

    await page.goto('/');
    await expect(page.getByText('Failed to load requests. Please try again.')).toBeVisible();
  });

  test('shows error message when backend returns 5xx', async ({ page }) => {
    await page.route('**/api/requests', (route) =>
      route.fulfill({ status: 500, body: 'Internal Server Error' })
    );

    await page.goto('/');
    await expect(page.getByText('Failed to load requests. Please try again.')).toBeVisible();
  });

  test('navigation shows Submit Request and View Requests buttons', async ({ page }) => {
    await page.route('**/api/requests', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
    );

    await page.goto('/');
    await expect(page.getByRole('button', { name: 'Submit Request' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'View Requests' })).toBeVisible();
  });

});
