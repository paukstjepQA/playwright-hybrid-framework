import { test, expect } from '@playwright/test';

// za hibrid mi trebaju i page i request
test('Hibridni test: Dinamička provjera trenera Dinama', async ({ page, request }) => {
    
    
    // Dohvati podatak iz baze -  API zahtjev na isti endpoint iz Lekcije 6
    const apiOdgovor = await request.get('https://www.sofascore.com/api/v1/team/2032');
    expect(apiOdgovor.ok()).toBeTruthy();
    const podaci = await apiOdgovor.json();
    
    // Spremi trenutno ime trenera u dinamičku varijablu
    const pravoImeTrenera = podaci.team.manager.name;
    console.log(`[API INFO] Baza kaže da je trener: ${pravoImeTrenera}`);

    
    // UI dio testa: Tek sada idem na preglednik i idem na profil kluba
    await page.goto('https://www.sofascore.com/hr/tim/nogomet/dinamo-zagreb/2032');
    
    // Rješenje za onaj standardni GDPR banner da nam ne smeta (ako se pojavi)
    // Ako koristiš svoj Page Object Model iz prošlih lekcija, ovo možeš zamijeniti s njim
    try {
        await page.locator('.fc-cta-consent').click({ timeout: 2000 });
    } catch (e) {
        console.log('Nema GDPR bannera, idemo dalje.');
    }

    // Hibridna asercija - API + UI 
    
    // Ne hardkodiramo ime! Provjeravamo sadrži li cijela stranica (body) 
    await expect(page.locator('body')).toContainText(pravoImeTrenera);
    
    console.log(`[UI INFO] Uspješno pronađeno ime '${pravoImeTrenera}' na ekranu korisnika!`);
});