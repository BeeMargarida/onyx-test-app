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

    const logOutButtonFirstPage = page.getByText('Log Out');
    const logOutButtonSecondPage = secondPage.getByText('Log Out');
    const logOutButtonThirdPage = thirdPage.getByText('Log Out');

    expect(logOutButtonFirstPage).toBeTruthy();
    expect(logOutButtonSecondPage).toBeTruthy();
    expect(logOutButtonThirdPage).toBeTruthy();

    const fetchSpaceDataButtonFirstPage = page.getByText('Fetch Space Data');
    const fetchSpaceDataButtonThirdPage =
      thirdPage.getByText('Fetch Space Data');

    await Promise.all([
      logOutButtonSecondPage.click(),
      fetchSpaceDataButtonFirstPage.click(),
      fetchSpaceDataButtonThirdPage.click(),
    ]);

    logInButton = page.getByText('Log In');
    expect(logInButton).toBeTruthy();

    let fetchSpaceDataFirstPage = page.getByLabel('data-meteorites');
    let fetchSpaceDataThirdPage = thirdPage.getByLabel('data-meteorites');

    await expect(fetchSpaceDataFirstPage).not.toBeEmpty();
    await expect(fetchSpaceDataThirdPage).not.toBeEmpty();

    await Promise.all([page.reload(), thirdPage.reload()]);

    // This sometimes fails
    fetchSpaceDataFirstPage = page.getByLabel('data-meteorites');
    fetchSpaceDataThirdPage = thirdPage.getByLabel('data-meteorites');
    expect(fetchSpaceDataFirstPage).toBeEmpty();
    expect(fetchSpaceDataThirdPage).toBeEmpty();
  });

  test('[FAILS] should update in the same order between tabs', async ({
    page,
    context,
  }) => {
    await page.goto('/');

    // Logs in and fetches data
    let logInButton = page.getByText('Log In');
    await logInButton.click();

    const fetchDataButton = page.getByText('Fetch (small) Space data');
    await fetchDataButton.click();

    const fetchSpaceDataFirstPage = page.getByLabel('data-meteorites');
    await expect(fetchSpaceDataFirstPage).not.toBeEmpty();

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
