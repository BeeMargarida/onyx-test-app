import {test, expect} from '@playwright/test';

test.describe('multiple tabs', () => {
  test('logs out in all tabs', async ({page, context}) => {
    const secondPage = await context.newPage();

    await Promise.all([page.goto('/'), secondPage.goto('/')]);

    const logInButton = page.getByText('Log In');
    await logInButton.click();

    const logOutButtonPage = page.getByText('Log Out');
    expect(logOutButtonPage).toBeTruthy();

    const logOutButtonSecondPage = secondPage.getByText('Log Out');
    expect(logOutButtonSecondPage).toBeTruthy();
  });

  test('fetch should stop after log out', async ({page, context}) => {
    const secondPage = await context.newPage();

    await Promise.all([page.goto('/'), secondPage.goto('/')]);

    let logInButton = page.getByText('Log In');
    await logInButton.click();

    const logOutButtonFirstPage = page.getByText('Log Out');
    const logOutButtonSecondPage = secondPage.getByText('Log Out');

    await expect(logOutButtonFirstPage).toBeTruthy();
    await expect(logOutButtonSecondPage).toBeTruthy();

    const fetchButton = page.getByText('Fetch');
    await Promise.all([logOutButtonSecondPage.click(), fetchButton.click()]);

    const fetchData = page.getByText('HELLO');
    logInButton = page.getByText('Log In');

    expect(logInButton).toBeTruthy();
    expect(fetchData).toBeFalsy();
  });
});
