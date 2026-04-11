import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

// 1. We declare the loginPage variable outside so all tests can see it
let loginPage: LoginPage;

// 2. The Hook: This runs BEFORE every single test automatically
test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page);
  await loginPage.navigate();
  await loginPage.login('standard_user', 'secret_sauce');
});

// 3. Test One: The login fact-check (It starts already logged in!)
test('SauceDemo POM Login Test', async ({ page }) => {
  await expect(page.locator('.title')).toHaveText('Products');
});

// 4. Test Two: The new feature
test('Add an item to the cart', async ({ page }) => {
  // Since beforeEach already logged us in, we are on the Products page.
  // YOUR TASK: Write the code here to click the "Add to cart" button for the Backpack.
  // YOUR TASK: Write an assertion to verify the shopping cart badge updates to "1".

  test('Add an item to the cart', async ({ page }) => {
  // 1. Action: Click the add to cart button
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

  // 2. Fact-Check: Verify the badge appears and says '1' instantly
  await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
});
});