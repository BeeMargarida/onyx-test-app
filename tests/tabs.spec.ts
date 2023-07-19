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

});
