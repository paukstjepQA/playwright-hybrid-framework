import { test, expect } from '@playwright/test';

// API test ne koristi { page }, nego { request }
test('API Test: Ekstrakcija podataka za Dinamo', async ({ request }) => {
    
    // Šaljem GET zahtjev direktno na server
    const odgovor = await request.get('https://www.sofascore.com/api/v1/team/2032');

    // Provjerava je li server vratio 200 OK 
    expect(odgovor.ok()).toBeTruthy(); 

    // Pretvaramo sirovi odgovor u JSON (Niz/Objekt)
    const podaci = await odgovor.json();

    // 4. ASERCIJA Provjeravam je li ime kluba točno
    // Ovdje znam da se u JSON-u ime kluba nalazi pod team.name
    expect(podaci.team.name).toBe('GNK Dinamo Zagreb');

    // 5. Ispiši ime trenera direktno u terminal
    console.log('Trenutni trener Dinama izvučen preko API-ja je:', podaci.team.manager.name);
});