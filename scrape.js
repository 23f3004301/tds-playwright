const { chromium } = require('playwright');

const seeds = [58, 59, 60, 61, 62, 63, 64, 65, 66, 67];
const BASE_URL = 'https://sanand0.github.io/tdsdata/playwright/';

(async () => {
  const browser = await chromium.launch();
  let grandTotal = BigInt(0);

  for (const seed of seeds) {
    try {
      const page = await browser.newPage();
      const url = `${BASE_URL}?seed=${seed}`;
      console.log(`Visiting: ${url}`);
      
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      
      // Get ALL text from tables
      const numbers = await page.evaluate(() => {
        const vals = [];
        // Try multiple selectors
        const cells = document.querySelectorAll('td, th');
        cells.forEach(cell => {
          const txt = cell.innerText.trim();
          // Match any integer or decimal number
          const matches = txt.match(/\d+/g);
          if (matches) matches.forEach(m => vals.push(m));
        });
        return vals;
      });

      console.log(`Seed ${seed}: found ${numbers.length} numbers`);
      
      let seedTotal = BigInt(0);
      for (const n of numbers) {
        try { seedTotal += BigInt(n); } catch(e) {}
      }
      console.log(`Seed ${seed} total: ${seedTotal}`);
      grandTotal += seedTotal;
      await page.close();
    } catch(e) {
      console.error(`Error on seed ${seed}: ${e.message}`);
    }
  }

  await browser.close();
  console.log(`Total: ${grandTotal}`);
  console.log(`Answer: ${grandTotal}`);
  console.log(`Grand Total = ${grandTotal}`);
})();
