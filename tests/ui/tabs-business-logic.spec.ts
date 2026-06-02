import { test, expect, devices } from '@playwright/test';

test.use({ 
    ...devices['iPhone 13'],
    storageState: 'sofascore-state.json' 
});
// AI Driven test skripta - fail - napraviti analizu zašto? 
const scenariji = [
    { 
        naziv: 'Utakmica još nije počela', 
        lazniStatusTip: 'notstarted', 
        lazniStatusCode: 0,           
        ocekujemoZadnjeMjesto: false 
    },
    { 
        naziv: 'Utakmica je završila', 
        lazniStatusTip: 'finished',   
        lazniStatusCode: 100,         
        ocekujemoZadnjeMjesto: true 
    }
];

for (const scenarij of scenariji) {
    test(`Provjera poslovne logike Koeficijenata: ${scenarij.naziv}`, async ({ page }) => {

        // ==========================================
        // 1. IGRANJE BOGA S ANTI-FLAKY ZAŠTITOM
        // ==========================================
        await page.route(/.*\/api\/v1\/event\/16231268$/, async route => {
            try {
                const response = await route.fetch();
                const json = await response.json();

                if (!json || !json.event) {
                    return route.fulfill({ response, json }); 
                }

                json.event.status.type = scenarij.lazniStatusTip;
                json.event.status.code = scenarij.lazniStatusCode;

                console.log(`[API MOCK] Uspješno podvaljen status: ${scenarij.lazniStatusTip}`);
                await route.fulfill({ response, json });
            } catch (e) {
                // Ako se stranica zatvori dok API poziv traje, ne bacaj grešku, samo ignoriraj
                await route.fallback().catch(() => {});
            }
        });

        // ==========================================
        // 2. KONTROLA VREMENA (Čekamo da UI reagira)
        // ==========================================
        // Postavljamo "radar" da čekamo točno naš presretnuti poziv
        const responsePromise = page.waitForResponse(/.*\/api\/v1\/event\/16231268$/);

        // Odlazimo na stranicu
        await page.goto('https://www.sofascore.com/football/match/atletico-nacional-junior-barranquilla/fxcsgxc#id:16231268');

        // Čekamo da API odgovor stigne na frontend
        await responsePromise;

        // DAJEMO REACTU 1.5 SEKUNDI DA PRESLOŽI TABOVE NA TEMELJU NAŠEG MOCKA
        await page.waitForTimeout(1500);

        // ==========================================
        // 3. SKENIRANJE I MATEMATIKA
        // ==========================================
        const sviTaboviLokator = page.locator('button[role="tab"]');
        await sviTaboviLokator.first().waitFor({ state: 'attached' });
        const listaTabova = await sviTaboviLokator.allInnerTexts();
        
        const trazenaRijec = 'Koeficijenti'; 
        const pozicija = listaTabova.indexOf(trazenaRijec);

        console.log(`[UI STANJE] Tab "${trazenaRijec}" je na poziciji: ${pozicija}. Ukupno tabova: ${listaTabova.length}`);

        // ==========================================
        // 4. ASERCIJE (Poslovna pravila)
        // ==========================================
        const zadnjaMogucaPozicija = listaTabova.length - 1;

        if (scenarij.ocekujemoZadnjeMjesto === true) {
            expect(pozicija).toBe(zadnjaMogucaPozicija);
        } else {
            expect(pozicija).not.toBe(zadnjaMogucaPozicija);
        }
    });
}