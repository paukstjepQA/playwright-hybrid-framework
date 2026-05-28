import { test, expect } from '@playwright/test';

// Idi u preglednik, spremi u json sve potrebno da više ne moram klikati po gdpr banneru
// Prvo generiram to stanje
// ==========================================
test('Napravi Save Game datoteku', async ({ page, context }) => {
    await page.goto('https://www.sofascore.com/hr/');

    // Koristi lokator da klikneš na GDPR banner
    // AI Tutor dodatak:  Stavljamo u try-catch za svaki slučaj, ako ga nekim čudom nema
    try {
        const spremiGumb = page.locator('.fc-cta-consent');
        await expect(spremiGumb).toBeVisible({ timeout: 5000 });
        await spremiGumb.click();
        
        // Dajem mu vremena da to zapiše u memoriju
        await page.waitForTimeout(1000); 
    } catch (e) {
        console.log('Banner nije iskočio tijekom spremanja stanja.');
    }

    // Sad to sve spremi u JSON  'sofascore-state.json'
    await context.storageState({ path: 'sofascore-state.json' });
    console.log('Stanje uspješno spremljeno!');
});

// Sad kad sam spremio stanje u kojem bannera nema idem to stanje i koristiti
// ==========================================
test.describe('Testovi pametnog korisnika', () => {
    
    // Kažem mašini za sve testove u bloku koristi stanje od koje sam ti pripremio
    test.use({ storageState: 'sofascore-state.json' });

    test('Učitavanje bez GDPR bannera', async ({ page }) => {
        await page.goto('https://www.sofascore.com/hr/');

        // Provjerava jel se page normalno učito
        const logo = page.locator('header').getByRole('link', { name: 'Sofascore' });
        await expect(logo).toBeVisible();

        // veća pauza da mogu vizualno potvrditi
        console.log('Gledaj ekran - bannera ne bi smjelo biti!');
        await page.waitForTimeout(10000);
    });
});