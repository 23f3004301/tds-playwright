const { chromium } = require('playwright');

const seeds = [58, 59, 60, 61, 62, 63, 64, 65, 66, 67];
const BASE_URL = 'https://sanand0.github.io/tdsdata/playwright/';

(async () => {
  const browser = await chromium.launch();
  let grandTotal = BigInt(0);

  for (const seed of seeds) {
    try {
      const page = await browser.newPage();
      await page.goto(`${BASE_URL}?seed=${seed}`);
      
      // Wait until table cells actually appear
      await page.waitForSelector('td', { timeout: 15000 });

      const numbers = await page.evaluate(() => {
        const vals = [];
        document.querySelectorAll('td, th').forEach(cell => {
          const txt = cell.innerText.trim();
          const matches = txt.match(/\d+/g);
          if (matches) matches.forEach(m => vals.push(m));
        });
        return vals;
      });

      let seedTotal = BigInt(0);
      for (const n of numbers) {
        try { seedTotal += BigInt(n); } catch(e) {}
      }
      console.log(`Seed ${seed}: found ${numbers.length} numbers, total = ${seedTotal}`);
      grandTotal += seedTotal;
      await page.close();
    } catch(e) {
      console.error(`Error on seed ${seed}: ${e.message}`);
    }
  }

  await browser.close();
  console.log(`Total: ${grandTotal}`);
})();
