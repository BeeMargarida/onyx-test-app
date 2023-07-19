import {test, expect} from '@playwright/test';

test.describe('simple', () => {
  test('shows login button', async ({page}) => {
    await page.goto('/');

    const logInButton = page.getByText('Log In');

    expect(logInButton).toBeTruthy();
  });

  test('logs in after clicking button', async ({page}) => {
    await page.goto('/');

    const logInButton = page.getByText('Log In');
    await logInButton.click();

    const logOutButton = page.getByText('Log Out');
    expect(logOutButton).toBeTruthy();
  });
});
