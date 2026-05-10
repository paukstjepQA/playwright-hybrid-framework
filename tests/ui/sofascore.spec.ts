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



   // --- LEKCIJA 2: STRUKTURNE ASERCIJE --- provjera trenera i stadiona
const trenerLink = page.locator('a[href*="/manager/"]').first();
await expect(trenerLink).toBeVisible();
let imeTrenera = await trenerLink.innerText();
imeTrenera = imeTrenera.replace('Trener', '').replace('\n', '').trim();
console.log(`Robot kaže: Trenutni trener Dinama je ${imeTrenera}`);

const stadionLink = page.locator('a[href*="/venue/"]').first();
await expect(stadionLink).toBeVisible();
let imeStadiona = await stadionLink.innerText();
console.log(`Robot kaže: Dinamo igra na stadionu ${imeStadiona}`);

    });
    