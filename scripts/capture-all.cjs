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

  // 1. POS COUNTER (CLEAN, MINIMAL, FULL SPACE, NO SIDEBAR)
  console.log('--- Capturing Clean Minimal POS Counter ---');
  await page.waitForTimeout(600);
  await snap('01-billing-main.png');
  await snap('01-pos-counter-live-scale.png');

  // 2. Billing - Customer Search Modal
  const custBtn = page.locator('button:has-text("Search Directory")');
  if (await custBtn.count() > 0) {
    await custBtn.click();
    await page.waitForTimeout(500);
    await snap('03-billing-customer-modal.png');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
  }

  // 3. Billing - Tiny Print Button Receipt Preview
  const printBtn = page.locator('button:has-text("Print")');
  if (await printBtn.count() > 0) {
    await printBtn.click();
    await page.waitForTimeout(500);
    await snap('04-billing-print-preview.png');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
  }

  // 4. CLICK "DASHBOARD" TAB IN TOP BAR -> TRIGGERS PASSWORD / PIN POPUP
  console.log('--- Clicking DASHBOARD tab to trigger PIN login modal ---');
  const dashboardTab = page.locator('button:has-text("DASHBOARD")').first();
  if (await dashboardTab.count() > 0) {
    await dashboardTab.click();
    await page.waitForTimeout(600);
    await snap('04b-back-office-auth-modal.png');

    // Click One-Click Demo Access on modal
    const demoAccessBtn = page.locator('button:has-text("One-Click Demo Access")');
    if (await demoAccessBtn.count() > 0) {
      await demoAccessBtn.click();
      await page.waitForTimeout(700);
    }
  }

  // Helper to click sidebar nav items (only visible on dashboard)
  const labelMap = {
    'Executive Dashboard': 'Back-Office Overview',
    'Stock Overview': 'Products / Stock',
    'Bills Register': 'Bills & Invoices',
    'Customers & Ledger': 'Customers & Khata',
    'Orders & Works': 'Custom Orders',
    'Gold Karat / Tehleel': 'Karat Assay / Tehleel',
    'Mixing & Changer': 'Alloy Mixing',
    'Day Book (Roznamcha)': 'Accounts / Daybook',
    'Financial Reports': 'Reports & P&L',
    'SMS Portal': 'SMS Alerts',
    'Settings': 'Settings',
  };

  async function navTo(label) {
    await ensureNoModals();
    const actualLabel = labelMap[label] || label;
    const btn = page.locator(`button:has-text("${actualLabel}")`).first();
    if (await btn.count() > 0) {
      await btn.click({ timeout: 5000 });
      await page.waitForTimeout(500);
    }
  }

  // 5. DASHBOARD (SIDEBAR NOW VISIBLE)
  console.log('--- Capturing Executive Dashboard with Sidebar ---');
  await navTo('Executive Dashboard');
  await page.waitForTimeout(600);
  await snap('05-dashboard-overview.png');

  // 6. INVENTORY
  console.log('--- Capturing Inventory ---');
  await navTo('Stock Overview');
  await page.waitForTimeout(600);
  await snap('07-inventory-gallery-grid.png');

  // 7. BILLS REGISTER
  console.log('--- Capturing Bills Register ---');
  await navTo('Bills Register');
  await page.waitForTimeout(600);
  await snap('09-bills-register.png');

  // 8. CUSTOMERS & KHATA
  console.log('--- Capturing Customers Page ---');
  await navTo('Customers & Ledger');
  await page.waitForTimeout(600);
  await snap('11-customers-list.png');

  // 9. CUSTOM ORDERS
  console.log('--- Capturing Custom Orders ---');
  await navTo('Orders & Works');
  await page.waitForTimeout(600);
  await snap('13-orders-kanban.png');

  // 10. ACCOUNTS DAYBOOK
  console.log('--- Capturing Accounts Daybook ---');
  await navTo('Day Book (Roznamcha)');
  await page.waitForTimeout(600);
  await snap('18-accounts-daybook.png');

  // 11. REPORTS P&L
  console.log('--- Capturing Reports ---');
  await navTo('Financial Reports');
  await page.waitForTimeout(600);
  await snap('19-reports-summary.png');

  console.log('All screenshots captured successfully!');
  await browser.close();
}

run().catch((err) => {
  console.error('Capture error:', err);
  process.exit(1);
});
