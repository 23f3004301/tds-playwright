const { chromium } = require('playwright');

const seeds = [58, 59, 60, 61, 62, 63, 64, 65, 66, 67];
const BASE_URL = 'https://sanand0.github.io/tdsdata/playwright/';

(async () => {
  const browser = await chromium.launch();
  let grandTotal = BigInt(0);

  for (const seed of seeds) {
    const page = await browser.newPage();
    await page.goto(`${BASE_URL}?seed=${seed}`, { waitUntil: 'networkidle' });

    const numbers = await page.evaluate(() => {
      const vals = [];
      document.querySelectorAll('table td, table th').forEach(cell => {
        const txt = cell.innerText.trim().replace(/,/g, '').replace(/\s+/g, ' ');
        // split in case multiple numbers in one cell
        txt.split(/\s+/).forEach(t => {
          if (/^\d+$/.test(t)) vals.push(t);
        });
      });
      return vals;
    });

    let seedTotal = BigInt(0);
    for (const n of numbers) {
      seedTotal += BigInt(n);
    }

    console.log(`Seed ${seed}: ${seedTotal}`);
    grandTotal += seedTotal;
    await page.close();
  }

  await browser.close();
  console.log(`Total: ${grandTotal}`);
})();
