const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function main() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 2,
  });

  const page = await context.newPage();
  const baseDir = path.resolve(__dirname, '../screenshots');

  const snap = async (name) => {
    const target = path.join(baseDir, name);
    await page.screenshot({ path: target, fullPage: false });
    console.log(`Saved: ${name}`);
  };

  const navTo = async (label) => {
    // If not visible, try expanding sidebar sections
    let link = page.locator(`aside button:has-text("${label}")`);
    if (!(await link.isVisible())) {
      const sectionButtons = page.locator('aside button:has(.lucide-chevron-right)');
      const count = await sectionButtons.count();
      for (let i = 0; i < count; i++) {
        await sectionButtons.nth(i).click().catch(() => {});
        await page.waitForTimeout(100);
      }
    }
    await link.click();
    await page.waitForTimeout(500);
  };

  console.log('Navigating to http://127.0.0.1:4173 ...');
  await page.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // 10. Inventory - Add Item Sheet
  console.log('Capturing 10-inventory-add-item-sheet...');
  await navTo('Stock Overview');
  await page.waitForTimeout(500);
  const newJewelleryBtn = page.locator('button:has-text("New Jewellery Item")');
  if (await newJewelleryBtn.count() > 0) {
    await newJewelleryBtn.click();
    await page.waitForTimeout(600);
    await snap('10-inventory-add-item-sheet.png');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
  }

  // 11. Inventory - Raw Bullion Lots Tab
  console.log('Capturing 11-inventory-raw-stock-lots...');
  const rawStockTab = page.locator('button[role="tab"]:has-text("Raw Bullion Lots")');
  if (await rawStockTab.count() > 0) {
    await rawStockTab.click();
    await page.waitForTimeout(500);
    await snap('11-inventory-raw-stock-lots.png');
  }

  // 15. Customers - Credit Voucher Dialog
  console.log('Capturing 15-customers-credit-voucher-modal...');
  await navTo('Customers & Ledger');
  await page.waitForTimeout(600);
  // Pick first customer in list
  const firstCustomer = page.locator('div.divide-y > div').first();
  if (await firstCustomer.count() > 0) {
    await firstCustomer.click();
    await page.waitForTimeout(400);
  }
  const creditBtn = page.locator('button:has-text("Credit (+)")');
  if (await creditBtn.count() > 0) {
    await creditBtn.click();
    await page.waitForTimeout(500);
    await snap('15-customers-credit-voucher-modal.png');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
  }

  // 16. Customers - Add Customer Sheet
  console.log('Capturing 16-customers-add-customer-sheet...');
  const addCustBtn = page.locator('button:has-text("Add Customer")');
  if (await addCustBtn.count() > 0) {
    await addCustBtn.click();
    await page.waitForTimeout(500);
    await snap('16-customers-add-customer-sheet.png');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
  }

  console.log('Supplemental capture complete!');
  await browser.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
