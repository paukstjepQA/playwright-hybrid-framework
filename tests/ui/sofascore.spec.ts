import { test, expect } from '@playwright/test';
import { SofaMainPage } from '../../pages/SofaMainPage';
const testniKlubovi = [
    { imeKluba: 'Dinamo', klubId: '2032' },
    { imeKluba: 'Rijeka', klubId: '2039' },
    { imeKluba: 'Real Madrid', klubId: '2829' }
 ]; // baza za više klubova (niz objekata)

    for (const klub of testniKlubovi) { // petlja koja vrti testove
        test(`Provjera trenera i stadiona za: ${klub.imeKluba}`, async ({ page }) => {
        const sofaMainPage = new SofaMainPage(page);

        await sofaMainPage.navigate();
        await sofaMainPage.acceptCookies();
        await sofaMainPage.closeLanguageModal();
        await sofaMainPage.searchFor(klub.imeKluba);
        await sofaMainPage.clickResultById(klub.klubId);
        await expect(page).toHaveURL(new RegExp(`.*${klub.klubId}.*`)); // dinamička provjera ID-a

        const trenerLink = page.locator('a[href*="/manager/"]').first(); // provjera trenera
        await expect(trenerLink).toBeVisible();
        let imeTrenera = await trenerLink.innerText();
        imeTrenera = imeTrenera.replace('Trener', '').replace('\n', '').trim();
        console.log(`🤖 Robot kaže: Trenutni trener kluba ${klub.imeKluba} je ${imeTrenera}`);

        const stadionLink = page.locator('a[href*="/venue/"]').first(); // provjera stadiona
        await expect(stadionLink).toBeVisible();
        let imeStadiona = await stadionLink.innerText();
        console.log(`🤖 Robot kaže: ${klub.imeKluba} igra na stadionu ${imeStadiona}`);
    });

}