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
    const numberElement = page.getByLabel('data-number');

    expect(logOutButton).toBeTruthy();
    expect(numberElement).toBeTruthy();

    const updatesTextElement = page.getByLabel('data-updates');
    const updatesText = await updatesTextElement.innerText();
    // eslint-disable-next-line quotes, prettier/prettier
    expect(updatesText).toEqual("[\"session\",\"randomNumber\"]");
  });

  test('logs out in after clicking button', async ({page}) => {
    await page.goto('/');

    const logInButton = page.getByText('Log In');
    await logInButton.click();

    const logOutButton = page.getByText('Log Out');
    const numberElement = page.getByLabel('data-number');
    expect(logOutButton).toBeTruthy();
    expect(numberElement).toBeTruthy();

    const updatesTextElement = page.getByLabel('data-updates');
    let updatesText = await updatesTextElement.innerText();
    // eslint-disable-next-line quotes, prettier/prettier
    expect(updatesText).toEqual("[\"session\",\"randomNumber\"]");

    await logOutButton.click();
    expect(logInButton).toBeTruthy();

    updatesText = await updatesTextElement.innerText();
    expect(updatesText).toEqual(
      // eslint-disable-next-line quotes, prettier/prettier
      "[\"session\",\"randomNumber\",\"session\",\"randomNumber\"]",
    );
  });
});
