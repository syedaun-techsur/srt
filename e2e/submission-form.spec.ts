import { test, expect } from '@playwright/test';

test.describe('SubmissionForm', () => {

  test('renders all form fields and Submit button', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Submit Request' }).click();

    await expect(page.getByLabel('Name')).toBeVisible();
    await expect(page.getByLabel('Request Title')).toBeVisible();
    await expect(page.getByLabel('Description')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
  });

  test('shows inline validation errors when all fields are blank on submit', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Submit Request' }).click();

    await page.getByRole('button', { name: 'Submit' }).click();

    await expect(page.getByText('Name is required')).toBeVisible();
    await expect(page.getByText('Request Title is required')).toBeVisible();
    await expect(page.getByText('Description is required')).toBeVisible();
  });

  test('does not call API when validation fails', async ({ page }) => {
    let apiCalled = false;
    await page.route('**/api/requests', () => { apiCalled = true; });

    await page.goto('/');
    await page.getByRole('button', { name: 'Submit Request' }).click();
    await page.getByRole('button', { name: 'Submit' }).click();

    expect(apiCalled).toBe(false);
  });

  test('navigates to list view on successful submission', async ({ page }) => {
    await page.route('**/api/requests', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 1,
            name: 'Alice',
            title: 'Fix login',
            description: 'Login page broken',
            createdAt: '2026-05-20T12:00:00',
          }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            { id: 1, name: 'Alice', title: 'Fix login', description: 'Login page broken', createdAt: '2026-05-20T12:00:00' }
          ]),
        });
      }
    });

    await page.goto('/');
    await page.getByRole('button', { name: 'Submit Request' }).click();

    await page.getByLabel('Name').fill('Alice');
    await page.getByLabel('Request Title').fill('Fix login');
    await page.getByLabel('Description').fill('Login page broken');
    await page.getByRole('button', { name: 'Submit' }).click();

    // Should navigate to list view
    await expect(page.getByRole('table')).toBeVisible();
    await expect(page.getByText('Alice')).toBeVisible();
  });

  test('shows API error message and preserves field values on failure', async ({ page }) => {
    await page.route('**/api/requests', async route => {
      await route.fulfill({ status: 500, body: 'Internal Server Error' });
    });

    await page.goto('/');
    await page.getByRole('button', { name: 'Submit Request' }).click();

    await page.getByLabel('Name').fill('Bob');
    await page.getByLabel('Request Title').fill('Database down');
    await page.getByLabel('Description').fill('Cannot connect to DB');
    await page.getByRole('button', { name: 'Submit' }).click();

    // Error message shown
    await expect(page.getByRole('alert').first()).toBeVisible();

    // Field values preserved
    await expect(page.getByLabel('Name')).toHaveValue('Bob');
    await expect(page.getByLabel('Request Title')).toHaveValue('Database down');
    await expect(page.getByLabel('Description')).toHaveValue('Cannot connect to DB');
  });

  test('clears validation errors when user starts typing', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Submit Request' }).click();

    // Trigger validation errors
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByText('Name is required')).toBeVisible();

    // Start typing in name field
    await page.getByLabel('Name').fill('C');

    // Re-submit should not show name error (since field is not blank)
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByText('Name is required')).not.toBeVisible();
  });

});
