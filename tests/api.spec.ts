import { test, expect } from '@playwright/test';

test('GET Request - Verify Zagreb Postal Data', async ({ request }) => {
  const response = await request.get('https://api.zippopotam.us/hr/10000');
  expect(response.status()).toBe(200);

  const responseBody = await response.json();
  
  // FIX 1: We added (place: any) to silence the strict librarian
  const allPlaceNames = responseBody.places.map((place: any) => place['place name']);
  console.log('All places found:', allPlaceNames);

  // FIX 2: We assert based on the actual data the API provides
  expect(allPlaceNames).toContain('Zagreb-dio');
});