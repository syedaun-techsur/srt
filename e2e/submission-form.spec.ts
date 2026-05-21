import { test, expect } from '@playwright/test';

test.describe('SubmissionForm component', () => {

  test('renders Name, Request Title, Description fields and Submit button', async ({ page }) => {
    // Mock GET so RequestList doesn't fail when navigating back
    await page.route('**/api/requests', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
      } else {
        route.continue();
      }
    });

    await page.goto('/');
    await page.getByRole('button', { name: 'Submit Request' }).click();

    await expect(page.getByLabel('Name')).toBeVisible();
    await expect(page.getByLabel('Request Title')).toBeVisible();
    await expect(page.getByLabel('Description')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
  });

  test('shows inline validation errors when submitting blank form', async ({ page }) => {
    await page.route('**/api/requests', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
    );

    await page.goto('/');
    await page.getByRole('button', { name: 'Submit Request' }).click();
    await page.getByRole('button', { name: 'Submit' }).click();

    await expect(page.getByText('Name is required')).toBeVisible();
    await expect(page.getByText('Request Title is required')).toBeVisible();
    await expect(page.getByText('Description is required')).toBeVisible();
  });

  test('does not call API when form has blank fields', async ({ page }) => {
    let apiCallMade = false;

    await page.route('**/api/requests', (route) => {
      if (route.request().method() === 'POST') {
        apiCallMade = true;
        route.fulfill({ status: 201, contentType: 'application/json', body: '{}' });
      } else {
        route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
      }
    });

    await page.goto('/');
    await page.getByRole('button', { name: 'Submit Request' }).click();
    await page.getByRole('button', { name: 'Submit' }).click();

    // Give brief time for any erroneous fetch call
    await page.waitForTimeout(200);
    expect(apiCallMade).toBe(false);
  });

  test('navigates to list view and shows new entry after successful submission', async ({ page }) => {
    const mockRecord = {
      id: 42,
      name: 'Alice',
      title: 'Fix login bug',
      description: 'Login crashes on mobile.',
      createdAt: '2026-05-21T10:00:00',
    };

    await page.route('**/api/requests', (route) => {
      if (route.request().method() === 'POST') {
        route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify(mockRecord),
        });
      } else {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([mockRecord]),
        });
      }
    });

    await page.goto('/');
    await page.getByRole('button', { name: 'Submit Request' }).click();

    await page.getByLabel('Name').fill('Alice');
    await page.getByLabel('Request Title').fill('Fix login bug');
    await page.getByLabel('Description').fill('Login crashes on mobile.');

    await page.getByRole('button', { name: 'Submit' }).click();

    // Should navigate to list view showing the new record
    await expect(page.getByRole('cell', { name: 'Alice' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Fix login bug' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Login crashes on mobile.' })).toBeVisible();
  });

  test('shows API error message and preserves field values on submission failure', async ({ page }) => {
    await page.route('**/api/requests', (route) => {
      if (route.request().method() === 'POST') {
        route.abort('failed');
      } else {
        route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
      }
    });

    await page.goto('/');
    await page.getByRole('button', { name: 'Submit Request' }).click();

    await page.getByLabel('Name').fill('Bob');
    await page.getByLabel('Request Title').fill('Add feature');
    await page.getByLabel('Description').fill('Export to CSV.');

    await page.getByRole('button', { name: 'Submit' }).click();

    await expect(page.getByText('Submission failed. Please try again.')).toBeVisible();
    // Field values preserved
    await expect(page.getByLabel('Name')).toHaveValue('Bob');
    await expect(page.getByLabel('Request Title')).toHaveValue('Add feature');
    await expect(page.getByLabel('Description')).toHaveValue('Export to CSV.');
  });

  test('clears inline validation errors when user fills in a field', async ({ page }) => {
    await page.route('**/api/requests', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
    );

    await page.goto('/');
    await page.getByRole('button', { name: 'Submit Request' }).click();

    // Submit blank to trigger all errors
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByText('Name is required')).toBeVisible();

    // Fill in the name field — name error should clear on next submit
    await page.getByLabel('Name').fill('Carol');
    await page.getByRole('button', { name: 'Submit' }).click();

    // Name error gone, but title + description errors still shown
    await expect(page.getByText('Name is required')).not.toBeVisible();
    await expect(page.getByText('Request Title is required')).toBeVisible();
    await expect(page.getByText('Description is required')).toBeVisible();
  });

});
