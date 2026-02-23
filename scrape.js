const { chromium } = require('playwright');

const seeds = [58, 59, 60, 61, 62, 63, 64, 65, 66, 67];
const BASE_URL = 'https://sanand0.github.io/tdsdata/playwright/';

(async () => {
  const browser = await chromium.launch();
  let grandTotal = 0;

  for (const seed of seeds) {
    const page = await browser.newPage();
    await page.goto(`${BASE_URL}?seed=${seed}`, { waitUntil: 'networkidle' });

    const seedSum = await page.evaluate(() => {
      let total = 0;
      document.querySelectorAll('table td, table th').forEach(cell => {
        const val = parseFloat(cell.innerText.trim().replace(/,/g, ''));
        if (!isNaN(val)) total += val;
      });
      return total;
    });

    console.log(`Seed ${seed}: ${seedSum}`);
    grandTotal += seedSum;
    await page.close();
  }

  await browser.close();
  console.log(`Total: ${grandTotal}`);
})();
