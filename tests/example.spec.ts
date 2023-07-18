import {test, expect} from '@playwright/test';

test('shows login button', async ({page}) => {
  await page.goto('/');

  const logInButton = page.getByText('Log In');

  await expect(logInButton).toBeTruthy();
});

test('logs in after clicking button', async ({page}) => {
  await page.goto('/');

  const logInButton = page.getByText('Log In');
  await logInButton.click();

  const logOutButton = page.getByText('Log Out');
  await expect(logOutButton).toBeTruthy();
});
