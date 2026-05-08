import { test, expect } from '@playwright/test';
import { SofaMainPage } from '../../pages/SofaMainPage'; 

test('pretraga koristeći POM i Business Logic', async ({ page }) => {
    const sofaMainPage = new SofaMainPage(page);

    await sofaMainPage.navigate();
    await sofaMainPage.acceptCookies();
    await sofaMainPage.closeLanguageModal();

    await sofaMainPage.searchFor('Dinamo');

    await sofaMainPage.clickResultById('2032');
    
    // 5. Završna provjera (Assertion)
    // Kada kliknemo, url se mora promijeniti u stranicu kluba
    await expect(page).toHaveURL(/.*2032.*/);
    }
);
    