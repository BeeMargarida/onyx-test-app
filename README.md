# Onyx Simple App

This application serves as a simple web app with e2e tests that showcases some of the current issues happening in Onyx. The goal is to solve all issues in Onyx so that all tests pass.

## How to run:

1. Use node `16.15.1`
2. `yarn`
3. `yarn e2e` or `yarn e2e-ui`

## Debugging e2e tests

- Use the Playwright VSCode extension
- Use the command `npx playwright test <name of the test file> --project=chromium --debug`
