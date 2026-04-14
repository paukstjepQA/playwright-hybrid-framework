import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

let loginPage: LoginPage;

test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page);
  await loginPage.navigate();
  await loginPage.login('standard_user', 'secret_sauce');
});

test('SauceDemo POM Login Test', async ({ page }) => {
  await expect(page.locator('.title')).toHaveText('Products');
});

test('Add an item to the cart', async ({ page }) => {
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
});