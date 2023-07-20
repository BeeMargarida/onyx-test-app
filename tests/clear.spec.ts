import {test, expect} from '@playwright/test';

test.describe('clear', () => {
  test('clear data on logout', async ({page}) => {
    await page.goto('/');

    const logInButton = page.getByText('Log In');
    expect(logInButton).toBeTruthy();

    await logInButton.click();

    const logOutButton = page.getByText('Log Out');
    expect(logOutButton).toBeTruthy();

    const fetchPokedexButton = page.getByText('Fetch Pokedex');
    expect(fetchPokedexButton).toBeTruthy();

    const fetchMeteoritesButton = page.getByText('Fetch Space Data');
    expect(fetchMeteoritesButton).toBeTruthy();

    await Promise.all([
      fetchPokedexButton.click(),
      fetchMeteoritesButton.click(),
    ]);

    const fetchPokedexData = page.getByLabel('data-pokedex');
    expect(fetchPokedexData).toContainText('151');

    const fetchMeteoritesData = page.getByLabel('data-meteorites');
    expect(fetchMeteoritesData).not.toBeEmpty();

    const fetchAsteroidsData = page.getByLabel('data-asteroids');
    expect(fetchAsteroidsData).not.toBeEmpty();

    await logOutButton.click();

    expect(fetchPokedexData).toBeEmpty();
    expect(fetchMeteoritesData).toBeEmpty();
    expect(fetchAsteroidsData).toBeEmpty();

    // TODO: check indexedDB contents
  });
});
