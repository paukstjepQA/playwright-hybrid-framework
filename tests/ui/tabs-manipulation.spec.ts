import { test, expect, devices } from '@playwright/test';

// mobile view i storage učitavanje
test.use({ 
    ...devices['iPhone 13'],
    storageState: 'sofascore-state.json' 
});

test('DOM Manipulacija: Lociranje Odds taba u prostoru (Mobile Web)', async ({ page }) => {

    await page.goto('https://www.sofascore.com/football/match/saint-etienne-nice/lIsDI#id:16198901');

    // traži isključivo po lokatorima za tabove
    const sviTaboviLokator = page.locator('button[role="tab"]');

    // 'attached' znači: "Čekaj dok se element ne pojavi u HTML-u, ignoriraj ako je preko njega neki banner ili modal."
    await sviTaboviLokator.first().waitFor({ state: 'attached' });

    //skeniraj tekst
    const listaTabova = await sviTaboviLokator.allInnerTexts();
    
    console.log('Robot je pronašao sljedeće tabove:', listaTabova);

    // 4. math
    const trazenaRijec = 'Koeficijenti'; 
    const pozicija = listaTabova.indexOf(trazenaRijec);

    console.log(`[ANALIZA] Tab "${trazenaRijec}" se nalazi na poziciji (indeksu): ${pozicija}`);

    // 5. ASERCIJA
    expect(pozicija).toBeGreaterThanOrEqual(0);
});