const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT_DIR = path.join(__dirname, '..', 'screenshots');
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function run() {
  console.log('Launching Chrome for high-res screenshot capture...');
  const browser = await chromium.launch({
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--hide-scrollbars']
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 2, // 2x Retina quality for crisp 1080p display
  });

  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  async function snap(name) {
    const filePath = path.join(OUT_DIR, name);
    await page.screenshot({ path: filePath, fullPage: false });
    console.log(`Saved: ${name}`);
  }

  async function ensureNoModals() {
    for (let i = 0; i < 3; i++) {
      const backdrop = page.locator('div[data-state="open"].fixed');
      if (await backdrop.count() > 0 && await backdrop.first().isVisible().catch(() => false)) {
        await page.keyboard.press('Escape');
        await page.waitForTimeout(250);
      } else {
        break;
      }
    }
  }

  // Helper to click sidebar nav items with auto-expand for collapsed sections
  async function navTo(label) {
    await ensureNoModals();
    let btn = page.locator(`button:has-text("${label}")`).first();
    if (!(await btn.isVisible().catch(() => false))) {
      // Find all section buttons and expand them
      const sections = ['System & Mandi', 'Trading & POS', 'Workshop & Assay', 'Inventory & Stock', 'Finance & Accounts'];
      for (const s of sections) {
        const sBtn = page.locator(`button:has-text("${s}")`).first();
        if (await sBtn.isVisible().catch(() => false)) {
          await sBtn.click();
          await page.waitForTimeout(150);
        }
      }
    }
    await page.locator(`button:has-text("${label}")`).first().click({ timeout: 5000 });
    await page.waitForTimeout(500);
  }

  // 1. BILLING MAIN
  console.log('--- Capturing Billing Page ---');
  await navTo('Billing Main');
  await page.waitForTimeout(500);
  await snap('01-billing-main.png');

  // 2. Billing - Expand Deductions
  const deductionsBtn = page.locator('button:has-text("Kat & Polish Deductions")');
  if (await deductionsBtn.count() > 0) {
    await deductionsBtn.click();
    await page.waitForTimeout(400);
    await snap('02-billing-deductions-expanded.png');
    // keep it or close
  }

  // 3. Billing - Customer Select Modal
  const custBtn = page.locator('button:has-text("Select Customer")');
  if (await custBtn.count() > 0) {
    await custBtn.click();
    await page.waitForTimeout(500);
    await snap('03-billing-customer-modal.png');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
  }

  // 4. Billing - Print Preview Modal
  const printBtn = page.locator('button:has-text("PRINT INVOICE")');
  if (await printBtn.count() > 0) {
    await printBtn.click();
    await page.waitForTimeout(500);
    await snap('04-billing-print-preview.png');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
  }

  // 5. DASHBOARD
  console.log('--- Capturing Executive Dashboard ---');
  await navTo('Executive Dashboard');
  await page.waitForTimeout(700);
  await snap('05-dashboard-overview.png');

  // 6. Dashboard - Toggle Grams
  const gramsBtn = page.locator('button:has-text("GRAMS")');
  if (await gramsBtn.count() > 0) {
    await gramsBtn.first().click();
    await page.waitForTimeout(400);
    await snap('06-dashboard-grams-mode.png');
  }

  // 7. INVENTORY - Gallery Grid
  console.log('--- Capturing Inventory ---');
  await navTo('Stock Overview');
  await page.waitForTimeout(600);
  // Click Finished Jewellery tab
  const finishedJewelleryTab = page.locator('button[role="tab"]:has-text("Finished Jewellery")');
  if (await finishedJewelleryTab.count() > 0) {
    await finishedJewelleryTab.click();
    await page.waitForTimeout(400);
  }
  await snap('07-inventory-gallery-grid.png');

  // 8. Inventory - Table View
  const tableToggle = page.locator('button:has-text("Table")');
  if (await tableToggle.count() > 0) {
    await tableToggle.click();
    await page.waitForTimeout(400);
    await snap('08-inventory-table-view.png');
    // Switch back to grid
    const gridToggle = page.locator('button:has-text("Gallery")');
    if (await gridToggle.count() > 0) await gridToggle.click();
    await page.waitForTimeout(300);
  }

  // 9. Inventory - Image Zoom Lightbox
  const firstImageCard = page.locator('.aspect-4\\/3 img').first();
  if (await firstImageCard.count() > 0) {
    await firstImageCard.click();
    await page.waitForTimeout(500);
    await snap('09-inventory-image-zoom-modal.png');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
  }

  // 10. Inventory - Add Item Sheet
  const newStockBtn = page.locator('button:has-text("New Stock Item")');
  if (await newStockBtn.count() > 0) {
    await newStockBtn.click();
    await page.waitForTimeout(500);
    await snap('10-inventory-add-item-sheet.png');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
  }

  // 11. Inventory - Raw Stock Lots Tab
  const rawStockTab = page.locator('button[role="tab"]:has-text("Raw Stock & Bullion Lots")');
  if (await rawStockTab.count() > 0) {
    await rawStockTab.click();
    await page.waitForTimeout(400);
    await snap('11-inventory-raw-stock-lots.png');
  }

  // 12. BILLS REGISTER
  console.log('--- Capturing Bills Register ---');
  await navTo('Bills Register');
  await page.waitForTimeout(500);
  await snap('12-bills-register.png');

  // 13. Bills Register - View Single Bill
  const viewFirstBillBtn = page.locator('button[title="View details"]').first();
  if (await viewFirstBillBtn.count() > 0) {
    await viewFirstBillBtn.click();
    await page.waitForTimeout(500);
    await snap('13-bills-detail-view.png');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
  }

  // 14. CUSTOMERS & DUAL LEDGER
  console.log('--- Capturing Customers & Ledger ---');
  await navTo('Customers & Ledger');
  await page.waitForTimeout(600);
  await snap('14-customers-ledger.png');

  // 15. Customers - Credit Voucher Modal
  const creditBtn = page.locator('button:has-text("Credit (+)")');
  if (await creditBtn.count() > 0) {
    await creditBtn.click();
    await page.waitForTimeout(500);
    await snap('15-customers-credit-voucher-modal.png');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
  }

  // 16. Customers - Orders Tab
  const custOrdersTab = page.locator('button[role="tab"]:has-text("Workshop Orders")');
  if (await custOrdersTab.count() > 0) {
    await custOrdersTab.click();
    await page.waitForTimeout(400);
    await snap('16-customers-orders-tab.png');
  }

  // 17. ORDERS & WORKS
  console.log('--- Capturing Orders & Works ---');
  await navTo('Orders & Works');
  await page.waitForTimeout(500);
  await snap('17-orders-customer-list.png');

  // 18. Orders - Kanban Board View
  const boardBtn = page.locator('button:has-text("Board")');
  if (await boardBtn.count() > 0) {
    await boardBtn.click();
    await page.waitForTimeout(400);
    await snap('18-orders-kanban-board.png');
    const listBtn = page.locator('button:has-text("List")');
    if (await listBtn.count() > 0) await listBtn.click();
    await page.waitForTimeout(300);
  }

  // 19. Orders - Casting Orders Tab
  const castingTab = page.locator('button[role="tab"]:has-text("Casting Orders")');
  if (await castingTab.count() > 0) {
    await castingTab.click();
    await page.waitForTimeout(400);
    await snap('19-orders-casting-tab.png');
  }

  // 20. Orders - Workshop Works Tab
  const worksTab = page.locator('button[role="tab"]:has-text("Workshop Works")');
  if (await worksTab.count() > 0) {
    await worksTab.click();
    await page.waitForTimeout(400);
    await snap('20-orders-works-tab.png');
  }

  // 21. Orders - New Customer Order Modal
  const newOrderBtn = page.locator('button:has-text("New Order")');
  if (await newOrderBtn.count() > 0) {
    await newOrderBtn.click();
    await page.waitForTimeout(500);
    await snap('21-orders-new-order-modal.png');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
  }

  // 22. GOLD KARAT / TEHLEEL
  console.log('--- Capturing Tehleel Page ---');
  await navTo('Gold Karat / Tehleel');
  await page.waitForTimeout(500);
  await snap('22-tehleel-assay-calc.png');

  // 23. MIXING & CHANGER
  console.log('--- Capturing Mixing Page ---');
  await navTo('Mixing & Changer');
  await page.waitForTimeout(500);
  await snap('23a-modal-mixing-chooser.png');
  await page.keyboard.press('m');
  await page.waitForTimeout(600);
  await snap('23-mixing-changer.png');

  // 24. ACCOUNTS / DAY BOOK
  console.log('--- Capturing Accounts Page ---');
  await navTo('Day Book (Roznamcha)');
  await page.waitForTimeout(500);
  await snap('24-accounts-daybook.png');

  // 25. FINANCIAL REPORTS
  console.log('--- Capturing Financial Reports ---');
  await navTo('Financial Reports');
  await page.waitForTimeout(500);
  await snap('25-reports-financial.png');

  // 26. MANDI LIVE RATES
  console.log('--- Capturing Mandi Live Rates ---');
  // First open system section in sidebar if needed
  const systemSection = page.locator('button:has-text("System & Mandi")');
  if (await systemSection.count() > 0) {
    await systemSection.click();
    await page.waitForTimeout(300);
  }
  await navTo('Mandi Live Rates');
  await page.waitForTimeout(500);
  await snap('26-rates-mandi-board.png');

  // 27. SMS PORTAL
  console.log('--- Capturing SMS Portal ---');
  await navTo('SMS Portal');
  await page.waitForTimeout(500);
  await snap('27-sms-portal.png');

  // 28. SETTINGS - General
  console.log('--- Capturing Settings ---');
  await navTo('Settings');
  await page.waitForTimeout(500);
  await snap('28-settings-general.png');

  // 29. Settings - Hotkeys Tab
  const hotkeysTab = page.locator('button[role="tab"]:has-text("Hotkeys Directory")');
  if (await hotkeysTab.count() > 0) {
    await hotkeysTab.click();
    await page.waitForTimeout(400);
    await snap('29-settings-hotkeys.png');
  }

  // 30. GLOBAL MODAL - Calculator (F2)
  console.log('--- Capturing Global Modals ---');
  await page.keyboard.press('F2');
  await page.waitForTimeout(500);
  await snap('30-modal-calculator-f2.png');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);

  // 31. GLOBAL MODAL - Command Palette (Ctrl+K)
  await page.keyboard.press('Control+k');
  await page.waitForTimeout(500);
  await snap('31-modal-command-palette.png');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);

  // 32. GLOBAL MODAL - Mandi Live Rate Dialog (F11)
  await page.keyboard.press('F11');
  await page.waitForTimeout(500);
  await snap('32-modal-mandi-f11.png');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);

  // 33. DARK MODE CAPTURES
  console.log('--- Capturing Dark Mode Views ---');
  // Toggle dark mode via theme button in TopBar
  const themeToggle = page.locator('button[title*="Toggle Dark"]');
  if (await themeToggle.count() > 0) {
    await themeToggle.click();
    await page.waitForTimeout(600);

    // Dark Mode Dashboard
    await navTo('Executive Dashboard');
    await page.waitForTimeout(600);
    await snap('33-darkmode-dashboard.png');

    // Dark Mode Billing
    await navTo('Billing Main');
    await page.waitForTimeout(600);
    await snap('34-darkmode-billing.png');

    // Dark Mode Inventory Gallery
    await navTo('Stock Overview');
    await page.waitForTimeout(600);
    const darkFinishedTab = page.locator('button[role="tab"]:has-text("Finished Jewellery")');
    if (await darkFinishedTab.count() > 0) await darkFinishedTab.click();
    await page.waitForTimeout(400);
    await snap('35-darkmode-inventory-gallery.png');

    // Toggle back to light mode
    await themeToggle.click();
    await page.waitForTimeout(400);
  }

  console.log('All screenshots successfully captured in high resolution!');
  await browser.close();
}

run().catch((err) => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
