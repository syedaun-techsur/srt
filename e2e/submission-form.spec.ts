import { test, expect } from '@playwright/test';

test.describe('SubmissionForm component', () => {

  test('renders Name, Request Title, Description fields and Submit button (FORM-01)', async ({ page }) => {
    // Mock GET to return empty list so RequestList does not interfere
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

  test('shows per-field errors when all fields are blank on submit (FORM-02)', async ({ page }) => {
    await page.route('**/api/requests', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
      } else {
        route.continue();
      }
    });

    await page.goto('/');
    await page.getByRole('button', { name: 'Submit Request' }).click();

    // Submit without filling any fields
    await page.getByRole('button', { name: 'Submit' }).click();

    await expect(page.getByText('Name is required.')).toBeVisible();
    await expect(page.getByText('Request Title is required.')).toBeVisible();
    await expect(page.getByText('Description is required.')).toBeVisible();
  });

  test('makes no API call when validation fails (FORM-02)', async ({ page }) => {
    let postCallCount = 0;

    await page.route('**/api/requests', (route) => {
      if (route.request().method() === 'POST') {
        postCallCount++;
        route.fulfill({ status: 201, contentType: 'application/json', body: '{}' });
      } else {
        route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
      }
    });

    await page.goto('/');
    await page.getByRole('button', { name: 'Submit Request' }).click();

    // Submit with blank Name only
    await page.getByLabel('Request Title').fill('Some Title');
    await page.getByLabel('Description').fill('Some description');
    await page.getByRole('button', { name: 'Submit' }).click();

    await expect(page.getByText('Name is required.')).toBeVisible();
    expect(postCallCount).toBe(0);
  });

  test('navigates to Request List and shows new entry on successful submission (FORM-03)', async ({ page }) => {
    const createdRecord = {
      id: 42,
      name: 'Alice',
      title: 'Fix login bug',
      description: 'Login crashes on mobile.',
      createdAt: '2026-05-20T14:32:00',
    };

    await page.route('**/api/requests', (route) => {
      if (route.request().method() === 'POST') {
        route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify(createdRecord) });
      } else {
        // After POST, GET returns the new record
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([createdRecord]),
        });
      }
    });

    await page.goto('/');
    await page.getByRole('button', { name: 'Submit Request' }).click();

    await page.getByLabel('Name').fill('Alice');
    await page.getByLabel('Request Title').fill('Fix login bug');
    await page.getByLabel('Description').fill('Login crashes on mobile.');
    await page.getByRole('button', { name: 'Submit' }).click();

    // Should navigate to Request List
    await expect(page.getByRole('columnheader', { name: 'Name' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Alice' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Fix login bug' })).toBeVisible();
  });

  test('shows form-level error and preserves field values on API failure (FORM-04)', async ({ page }) => {
    await page.route('**/api/requests', (route) => {
      if (route.request().method() === 'POST') {
        route.abort('failed');
      } else {
        route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
      }
    });

    await page.goto('/');
    await page.getByRole('button', { name: 'Submit Request' }).click();

    await page.getByLabel('Name').fill('Alice');
    await page.getByLabel('Request Title').fill('Fix login bug');
    await page.getByLabel('Description').fill('Login crashes on mobile.');
    await page.getByRole('button', { name: 'Submit' }).click();

    // Form-level error shown
    await expect(page.getByText('Failed to submit request. Please try again.')).toBeVisible();

    // Field values preserved
    await expect(page.getByLabel('Name')).toHaveValue('Alice');
    await expect(page.getByLabel('Request Title')).toHaveValue('Fix login bug');
    await expect(page.getByLabel('Description')).toHaveValue('Login crashes on mobile.');
  });

  test('submit button is disabled while submission is in-flight', async ({ page }) => {
    // Use a slow response to observe the disabled state
    await page.route('**/api/requests', async (route) => {
      if (route.request().method() === 'POST') {
        await new Promise((resolve) => setTimeout(resolve, 200));
        route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ id: 1, name: 'Alice', title: 'Test', description: 'Test', createdAt: '2026-05-20T14:00:00' }),
        });
      } else {
        route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
      }
    });

    await page.goto('/');
    await page.getByRole('button', { name: 'Submit Request' }).click();

    await page.getByLabel('Name').fill('Alice');
    await page.getByLabel('Request Title').fill('Test');
    await page.getByLabel('Description').fill('Test desc');

    await page.getByRole('button', { name: 'Submit' }).click();

    // Button should be disabled immediately after click (while in-flight)
    await expect(page.getByRole('button', { name: 'Submitting...' })).toBeDisabled();
  });

});
