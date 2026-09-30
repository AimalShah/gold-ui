const { chromium } = require('playwright');
const path = require('path');
const OUT_DIR = path.join(__dirname, '..', 'screenshots');

async function run() {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 2,
  });

  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  async function snap(name) {
    const filePath = path.join(OUT_DIR, name);
    await page.screenshot({ path: filePath, fullPage: false });
    console.log(`Saved: ${name}`);
  }

  async function navTo(label) {
    let btn = page.locator(`button:has-text("${label}")`).first();
    if (!(await btn.isVisible().catch(() => false))) {
      const sections = ['System & Mandi', 'Trading & POS', 'Workshop & Assay', 'Inventory & Stock', 'Finance & Accounts'];
      for (const s of sections) {
        const sBtn = page.locator(`button:has-text("${s}")`).first();
        if (await sBtn.isVisible().catch(() => false)) {
          await sBtn.click();
          await page.waitForTimeout(100);
        }
      }
    }
    await page.locator(`button:has-text("${label}")`).first().click();
    await page.waitForTimeout(500);
  }

  // 10. Inventory Add Item Sheet
  await navTo('Stock Overview');
  await page.waitForTimeout(400);
  const newStockBtn = page.locator('button:has-text("New Stock Item")').first();
  if (await newStockBtn.isVisible().catch(() => false)) {
    await newStockBtn.click();
    await page.waitForTimeout(500);
    await snap('10-inventory-add-item-sheet.png');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
  }

  // 11. Inventory Raw Stock Lots Tab
  const rawStockTab = page.locator('button[role="tab"]:has-text("Raw Stock")').first();
  if (await rawStockTab.isVisible().catch(() => false)) {
    await rawStockTab.click();
    await page.waitForTimeout(400);
    await snap('11-inventory-raw-stock-lots.png');
  }

  // 15. Customers Credit Voucher Modal
  await navTo('Customers & Ledger');
  await page.waitForTimeout(500);
  const creditBtn = page.locator('button:has-text("Credit (+)")').first();
  if (await creditBtn.isVisible().catch(() => false)) {
    await creditBtn.click();
    await page.waitForTimeout(500);
    await snap('15-customers-credit-voucher-modal.png');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
  }

  // 16. Customers Orders Tab
  const custOrdersTab = page.locator('button[role="tab"]:has-text("Workshop Orders")').first();
  if (await custOrdersTab.isVisible().catch(() => false)) {
    await custOrdersTab.click();
    await page.waitForTimeout(400);
    await snap('16-customers-orders-tab.png');
  }

  // 21. Orders New Customer Order Modal
  await navTo('Orders & Works');
  await page.waitForTimeout(500);
  const newOrderBtn = page.locator('button:has-text("New Order")').first();
  if (await newOrderBtn.isVisible().catch(() => false)) {
    await newOrderBtn.click();
    await page.waitForTimeout(500);
    await snap('21-orders-new-order-modal.png');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
  }

  // 29. Settings Hotkeys Tab
  await navTo('Settings');
  await page.waitForTimeout(500);
  const hotkeysTab = page.locator('button[role="tab"]:has-text("Hotkeys")').first();
  if (await hotkeysTab.isVisible().catch(() => false)) {
    await hotkeysTab.click();
    await page.waitForTimeout(400);
    await snap('29-settings-hotkeys.png');
  }

  await browser.close();
  console.log('Finished capturing supplemental screens.');
}

run().catch(console.error);
