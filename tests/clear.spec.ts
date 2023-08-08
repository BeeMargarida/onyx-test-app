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

    await fetchPokedexButton.click();
    const fetchPokedexData = page.getByLabel('data-pokedex');
    expect(fetchPokedexData).toContainText('151');

    await logOutButton.click();

    expect(fetchPokedexData).toBeEmpty();

    await page.reload();

    expect(fetchPokedexData).toBeEmpty();
  });

  test('[FAILS] clear big amount of data on logout', async ({page}) => {
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

    await fetchPokedexButton.click();
    const fetchPokedexData = page.getByLabel('data-pokedex');
    expect(fetchPokedexData).toContainText('151');

    await fetchMeteoritesButton.click();
    let fetchMeteoritesData = page.getByLabel('data-meteorites');
    await expect(fetchMeteoritesData).not.toBeEmpty();

    let fetchAsteroidsData = page.getByLabel('data-asteroids');
    await expect(fetchAsteroidsData).not.toBeEmpty();

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
