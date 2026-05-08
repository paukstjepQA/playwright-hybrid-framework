import { Page, Locator } from '@playwright/test';

export class SofaMainPage {   

    readonly page: Page;
    readonly consentBtn: Locator;
    readonly searchInput: Locator; //

    constructor(page: Page) {
        this.page = page;
        this.consentBtn = page.getByRole('button', { name: 'Consent' });
        
        this.searchInput = page.locator('#search-input'); // <-- UPERILI SMO NIŠAN
    }


    async navigate() {
        await this.page.goto('https://www.sofascore.com/hr');
    }

    async acceptCookies() {
        if (await this.consentBtn.isVisible()) {
            await this.consentBtn.click();
        }
    }

    async closeLanguageModal() {
        const langModalBtn = this.page.locator('button:has-text("Spremi"), button:has-text("Hrvatski")');
        if (await langModalBtn.isVisible({ timeout: 3000 })) {
            await langModalBtn.click();
        }
    }

    async searchFor(klub: string) {
        await this.searchInput.fill(klub);
    }
    async clickResultById(entityId: string) {
        await this.page.locator(`a[href*="/${entityId}"]`).first().click();
    }
}