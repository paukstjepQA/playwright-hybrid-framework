import { test, expect } from '@playwright/test';
import { SofaMainPage } from '../../pages/SofaMainPage'; 

test(' Pokušaj potpune kontrole nad Sofascore podacima za team', async ({ page }) => {
    
    const sofaMainPage = new SofaMainPage(page);

    // mock1 - presretanje za tražilicu (Search API)
    // Kada stranica zatraži rezultate pretrage za riječ 'Dinamo'
    await page.route('**/api/v1/search/**', async (route) => {
        const response = await route.fetch();
        const podaci = await response.json();

        // Prolazim kroz rezultate pretrage i tko god ima ID 2032 mijenjam mu ime na samom izvoru!
        if (podaci && podaci.results) {
            for (const rezultat of podaci.results) {
                if (rezultat.entity && rezultat.entity.id === 2032) {
                    rezultat.entity.name = 'Hakerski Klub Dinamo';
                    rezultat.entity.shortName = 'Hakerski Dinamo';
                }
            }
        }

        await route.fulfill({ response, json: podaci });
    });

    // mock2 - interceptor za detalje tima
    await page.route('**/api/v1/team/2032', async (route) => {
        const response = await route.fetch();
        const podaci = await response.json();

        if (podaci && podaci.team) {
            podaci.team.name = 'Hakerski Klub Dinamo';
            podaci.team.shortName = 'Hakerski Dinamo';
            podaci.team.nameCode = 'HAK';
            
            if (podaci.team.manager) {
                podaci.team.manager.name = 'Optimus Prime';
            }
        }

        await route.fulfill({ response, json: podaci });
    });

    // pokreni test
    await sofaMainPage.navigate();
    await sofaMainPage.acceptCookies();
    await sofaMainPage.closeLanguageModal();

    // fejk data već u padajućem izborniku
    await sofaMainPage.searchFor('Dinamo');
    await sofaMainPage.clickResultById('2032');
    
    await page.waitForTimeout(10000); 
});