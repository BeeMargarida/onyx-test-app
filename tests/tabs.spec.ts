import {test, expect} from '@playwright/test';

test.describe('multiple tabs', () => {
  test('logs in in all tabs', async ({page, context}) => {
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

  test('should update in the same order between tabs', async ({
    page,
    context,
  }) => {
    await page.goto('/');

    // Logs in and fetches data
    let logInButton = page.getByText('Log In');
    await logInButton.click();

    const fetchDataButton = page.getByText('Fetch Space data (small)');
    await fetchDataButton.click();

    // Opens new page and reloads the first one
    const secondPage = await context.newPage();
    await Promise.all([page.reload(), secondPage.goto('/')]);

    // Checks that the update keys ordering is matching
    let updatesFirstPage = page.getByLabel('data-updates');
    let updatesSecondPage = secondPage.getByLabel('data-updates');

    expect(updatesFirstPage.innerText).toEqual(updatesSecondPage.innerText);

    const logOutButtonSecondPage = secondPage.getByText('Log Out');
    await expect(logOutButtonSecondPage).toBeTruthy();
    await logOutButtonSecondPage.click();

    const logInButtonFirstPage = page.getByText('Log In');
    const logInButtonSecondPage = secondPage.getByText('Log In');

    await expect(logInButtonFirstPage).toBeTruthy();
    await expect(logInButtonSecondPage).toBeTruthy();

    updatesFirstPage = page.getByLabel('data-updates');
    updatesSecondPage = secondPage.getByLabel('data-updates');

    const updatesTextFirstPage = await updatesFirstPage.innerText();
    const updatesTextSecondPage = await updatesSecondPage.innerText();

    // This should fail
    expect(updatesTextFirstPage).toEqual(updatesTextSecondPage);
  });
});
