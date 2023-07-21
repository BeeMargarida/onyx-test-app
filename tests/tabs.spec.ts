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
    const thirdPage = await context.newPage();

    await Promise.all([
      page.goto('/'),
      secondPage.goto('/'),
      thirdPage.goto('/'),
    ]);

    let logInButton = page.getByText('Log In');
    await logInButton.click();

    const logOutButtonFirstPage = page.getByText('Log Out');
    const logOutButtonSecondPage = secondPage.getByText('Log Out');
    const logOutButtonThirdPage = thirdPage.getByText('Log Out');

    await expect(logOutButtonFirstPage).toBeTruthy();
    await expect(logOutButtonSecondPage).toBeTruthy();
    await expect(logOutButtonThirdPage).toBeTruthy();

    const fetchSpaceDataButtonFirstPage = page.getByText('Fetch Spade Data');
    const fetchSpaceDataButtonThirdPage =
      thirdPage.getByText('Fetch Space Data');

    await Promise.all([
      logOutButtonSecondPage.click(),
      fetchSpaceDataButtonFirstPage.click(),
      fetchSpaceDataButtonThirdPage.click(),
    ]);

    logInButton = page.getByText('Log In');
    expect(logInButton).toBeTruthy();

    await Promise.all([page.reload(), thirdPage.reload()]);

    // This sometimes fails
    const fetchSpaceDataFirstPage = page.getByLabel('data-meteorites');
    const fetchSpaceDataThirdPage = thirdPage.getByLabel('data-meteorites');
    expect(fetchSpaceDataFirstPage).toBeEmpty();
    expect(fetchSpaceDataThirdPage).toBeEmpty();
  });
});
