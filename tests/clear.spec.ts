import {test, expect} from '@playwright/test';

test.describe('clear', () => {
  test('clear data on logout', async ({page}) => {
    await page.goto('/');

    const logInButton = page.getByTestId('log-in');
    expect(logInButton).toBeTruthy();

    await logInButton.click();

    const logOutButton = page.getByTestId('log-out');
    expect(logOutButton).toBeTruthy();

    const fetchPokedexButton = page.getByTestId('fetch-pokedex-data');
    expect(fetchPokedexButton).toBeTruthy();

    await fetchPokedexButton.click();
    let fetchPokedexData = page.getByLabel('data-pokedex');
    await expect(fetchPokedexData).toHaveText('151');

    await logOutButton.click();

    expect(fetchPokedexData).toBeEmpty();

    await page.reload();

    await expect(fetchPokedexData).toBeEmpty();
  });

  test('[FIXED] clear big amount of data on logout', async ({page}) => {
    await page.goto('/');

    const logInButton = page.getByTestId('log-in');
    expect(logInButton).toBeTruthy();

    await logInButton.click();

    const logOutButton = page.getByTestId('log-out');
    expect(logOutButton).toBeTruthy();

    const fetchPokedexButton = page.getByTestId('fetch-pokedex-data');
    expect(fetchPokedexButton).toBeTruthy();

    const fetchMeteoritesButton = page.getByTestId('fetch-space-data');
    expect(fetchMeteoritesButton).toBeTruthy();

    await fetchPokedexButton.click();
    const fetchPokedexData = page.getByLabel('data-pokedex');
    expect(fetchPokedexData).toHaveText('151');

    await fetchMeteoritesButton.click();
    let fetchMeteoritesData = page.getByLabel('data-meteorites');
    await expect(fetchMeteoritesData).toContainText('meteorites_');

    let fetchAsteroidsData = page.getByLabel('data-asteroids');
    await expect(fetchAsteroidsData).toContainText('asteroids_');

    await logOutButton.click();

    // wait for at least some of the clear to have been propagated
    await expect(fetchPokedexData).toBeEmpty();
    expect(fetchMeteoritesData).toBeEmpty();
    expect(fetchAsteroidsData).toBeEmpty();

    await page.reload();

    fetchMeteoritesData = page.getByLabel('data-meteorites');
    fetchAsteroidsData = page.getByLabel('data-asteroids');
    await expect(fetchMeteoritesData).toBeEmpty();
    await expect(fetchAsteroidsData).toBeEmpty();
  });
});
