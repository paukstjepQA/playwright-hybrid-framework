import { test, expect } from '@playwright/test';


// pomoćna funkcija - izračun oddsa iz fractional u decimal value
    function uDecimalu(razlomak: string): string {
    const dijelovi = razlomak.split('/'); // Cijepa string na znaku '/'
    const brojnik = Number(dijelovi[0]);  // Prvi dio (npr. 19)
    const nazivnik = Number(dijelovi[1]); // Drugi dio (npr. 20)
    
    const izracun = (brojnik / nazivnik) + 1;
    return izracun.toFixed(2); // .toFixed(2) osigurava da uvijek imamo dvije decimale (npr. 3.10)
}
    test('Hibridni test: Prisluškivanje tečajeva u letu', async ({ page }) => {
    // Govorimo Playwrightu da počne slušati mrežu i čeka odgovor čiji URL sadrži '/odds/1/featured'
    
    const odgovorPromise = page.waitForResponse(response => response.url().includes('/odds/1/featured'));

    // 2. FAZA: OTVARANJE STRANICE
    // Pravi preglednik ide na stranicu (on prolazi Cloudflare)
    await page.goto('https://www.sofascore.com/hr/football/match/saint-etienne-nice/lIsDI#id:16198901');

    // 3. FAZA: OTVARANJE PAKETA
    // Skripta pauzira ovdje dok se zamka ne zatvori (dok API odgovor ne stigne)
    const uhvaceniOdgovor = await odgovorPromise;
    const podaci = await uhvaceniOdgovor.json();

    const tecaj1_sirovo = podaci.featured.default.choices[0].fractionalValue;
    const tecajX_sirovo = podaci.featured.default.choices[1].fractionalValue;
    const tecaj2_sirovo = podaci.featured.default.choices[2].fractionalValue;

    // Ovdje koristim pomoćnu funkciju
    const tecaj1_ui = uDecimalu(tecaj1_sirovo);
    const tecajX_ui = uDecimalu(tecajX_sirovo);
    const tecaj2_ui = uDecimalu(tecaj2_sirovo);

    console.log(`[MATEMATIKA] API poslao: ${tecaj1_sirovo}. Robot pretvorio u: ${tecaj1_ui}`);
   
// ASERCIJA
    // ==========================================
    // Sada mašinu šaljemo da traži točno one brojeve koje je izračunao uz pomoćnu funkciju
    await expect(page.locator('body')).toContainText(tecaj1_ui);
    await expect(page.locator('body')).toContainText(tecajX_ui);
    await expect(page.locator('body')).toContainText(tecaj2_ui);

    console.log('✅ Uspješno pronađeni sinkronizirani decimalni tečajevi na ekranu!');
});