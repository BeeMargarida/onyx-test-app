import {test, expect} from '@playwright/test';

test.describe('multiple tabs', () => {
  test('logs in in all tabs', async ({page, context}) => {
    const secondPage = await context.newPage();

    await Promise.all([page.goto('/'), secondPage.goto('/')]);

    const logInButton = page.getByTestId('log-in');
    await logInButton.click();

    const logOutButtonPage = page.getByTestId('log-out');
    expect(logOutButtonPage).toBeTruthy();

    const logOutButtonSecondPage = secondPage.getByTestId('log-out');
    expect(logOutButtonSecondPage).toBeTruthy();
  });

  test('[FAILS] fetch should stop after log out', async ({page, context}) => {
    const secondPage = await context.newPage();
    const thirdPage = await context.newPage();

    await Promise.all([
      page.goto('/'),
      secondPage.goto('/'),
      thirdPage.goto('/'),
    ]);

    let logInButton = page.getByText('Log In');
    await logInButton.click();

    const logOutButtonFirstPage = page.getByTestId('log-out');
    const logOutButtonSecondPage = secondPage.getByTestId('log-out');
    const logOutButtonThirdPage = thirdPage.getByTestId('log-out');

    expect(logOutButtonFirstPage).toBeTruthy();
    expect(logOutButtonSecondPage).toBeTruthy();
    expect(logOutButtonThirdPage).toBeTruthy();

    const fetchSpaceDataButtonFirstPage = page.getByTestId('fetch-space-data');
    const fetchSpaceDataButtonThirdPage =
      thirdPage.getByTestId('fetch-space-data');

    await Promise.all([
      logOutButtonSecondPage.click(),
      fetchSpaceDataButtonFirstPage.click(),
      fetchSpaceDataButtonThirdPage.click(),
    ]);

    logInButton = page.getByTestId('log-in');
    expect(logInButton).toBeTruthy();

    let fetchSpaceDataFirstPage = page.getByLabel('data-meteorites');
    let fetchSpaceDataThirdPage = thirdPage.getByLabel('data-meteorites');

    await expect(fetchSpaceDataFirstPage).toContainText('meteorites_');
    await expect(fetchSpaceDataThirdPage).toContainText('meteorites_');

    await Promise.all([page.reload(), thirdPage.reload()]);

    const logInButtonFirstPage = page.getByTestId('log-in');
    const logInButtonThirdPage = thirdPage.getByTestId('log-in');
    await expect(logInButtonFirstPage).toBeTruthy();
    await expect(logInButtonThirdPage).toBeTruthy();

    fetchSpaceDataFirstPage = page.getByLabel('data-meteorites');
    fetchSpaceDataThirdPage = thirdPage.getByLabel('data-meteorites');

    // This sometimes fails
    await expect(fetchSpaceDataFirstPage).toBeEmpty();
    await expect(fetchSpaceDataThirdPage).toBeEmpty();
  });

  test('[FAILS] should update in the same order between tabs', async ({
    page,
    context,
  }) => {
    await page.goto('/');

    // Logs in and fetches data
    let logInButton = page.getByTestId('log-in');
    await logInButton.click();

    const fetchDataButton = page.getByTestId('fetch-small-space-data');
    await fetchDataButton.click();

    const fetchSpaceDataFirstPage = page.getByLabel('data-meteorites');
    await expect(fetchSpaceDataFirstPage).not.toBeEmpty();

    // Opens new page and reloads the first one
    const secondPage = await context.newPage();
    await Promise.all([page.reload(), secondPage.goto('/')]);

    // Checks that the update keys ordering is matching
    let updatesFirstPage = page.getByLabel('data-updates');
    let updatesSecondPage = secondPage.getByLabel('data-updates');

    let updatesFirstPageText = await updatesFirstPage.innerText();
    let updatesSecondPageText = await updatesFirstPage.innerText();

    expect(updatesFirstPageText).toEqual(updatesSecondPageText);

    const logOutButtonSecondPage = secondPage.getByTestId('log-out');
    await expect(logOutButtonSecondPage).toBeTruthy();
    await logOutButtonSecondPage.click();

    const logInButtonFirstPage = page.getByTestId('log-in');
    const logInButtonSecondPage = secondPage.getByTestId('log-in');

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
