import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { CheckoutPage } from '../../pages/CheckoutPage';

let loginPage: LoginPage;
let checkoutPage: CheckoutPage;

test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page);
  checkoutPage = new CheckoutPage(page); // We grab the new remote control
  
  await loginPage.navigate();
  await loginPage.login('standard_user', 'secret_sauce');
});

test('E2E: Complete Checkout Flow via POM', async ({ page }) => {
  
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

  await checkoutPage.startCheckout();
  await checkoutPage.fillShippingInfo('Stjepan', 'QA', '10000');
  await checkoutPage.finishCheckout();

  await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
});