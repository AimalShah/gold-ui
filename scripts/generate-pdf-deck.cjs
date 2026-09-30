const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const screenshotsDir = path.resolve(__dirname, '../screenshots');

// Curated slide presentation order with rich client-facing context
const slidesData = [
  // MODULE 1: EXECUTIVE INTELLIGENCE
  {
    module: "MODULE 01 • BUSINESS INTELLIGENCE",
    title: "Executive Business Dashboard",
    urdu: "ایگزیکٹو ڈیش بورڈ اور اہم اعداد و شمار",
    badge: "Real-time Metrics",
    feature: "Live Sales, Gold Bought/Sold Volumes, Vault Cash Balance & Workshop Job Tracking",
    description: "Consolidated high-level business command center providing immediate visibility into daily revenue, physical gold turnover (in tolas & grams), pending workshop jobs, and uncollected customer debt balances.",
    image: "05-dashboard-overview.png"
  },
  {
    module: "MODULE 01 • BUSINESS INTELLIGENCE",
    title: "Metric Analytics: Fine Gold Grams Toggle",
    urdu: "خالص سونا میٹرک ویو",
    badge: "Unit Flexibility",
    feature: "Instant Switch between PKR Monetary Turnover and Physical Pure Gold Grams",
    description: "Sarafa market businesses track liquidity in both currency and physical gold. One-click toggle shifts all sales volume charts and holding distributions into pure 24K grams.",
    image: "06-dashboard-grams-mode.png"
  },

  // MODULE 2: POINT OF SALE & BILLING
  {
    module: "MODULE 02 • POINT OF SALE & BILLING",
    title: "Gold POS Billing Engine (Core Screen)",
    urdu: "سونے کی خرید و فروخت کا بلنگ کاؤنٹر",
    badge: "Core Retail Flow",
    feature: "Automated Tola-Masha-Ratti Purity Engine, Making Charges & Settlement Summary",
    description: "High-speed retail counter POS. Automatically converts Tola-Masha-Ratti to precise metric grams (11.664g/tola), pulls live Mandi rates, applies per-tola or per-gram labour charges, and prints bills instantly.",
    image: "01-billing-main.png"
  },
  {
    module: "MODULE 02 • POINT OF SALE & BILLING",
    title: "Kat & Polish Deductions Breakdown",
    urdu: "کٹ، پالش اور نگینے کی کٹوتی",
    badge: "Purity Protection",
    feature: "Granular Item Deductions for Stone (Nag), Enamel (Meena), Wax, and Scrap Kat",
    description: "Transparent weight deduction calculator showing exact Net Gold Weight (صافی وزن) after subtracting non-gold materials. Prevents revenue leakage and builds buyer trust.",
    image: "02-billing-deductions-expanded.png"
  },
  {
    module: "MODULE 02 • POINT OF SALE & BILLING",
    title: "Searchable Customer Selector Modal",
    urdu: "گاہک کا انتخاب اور کھاتہ",
    badge: "Speed & Access",
    feature: "Instant Account Lookup with Dual Balances (Cash PKR & Physical Gold Grams)",
    description: "Cashier can search customers by name, phone, or CNIC in milliseconds. Instantly displays credit limits, pending debit dues, and active wholesale group terms.",
    image: "03-billing-customer-modal.png"
  },
  {
    module: "MODULE 02 • POINT OF SALE & BILLING",
    title: "Formal Invoice Print Preview (Bilingual)",
    urdu: "انوائس پرنٹ پرویو (اردو اور انگریزی)",
    badge: "FBR / Sarafa Ready",
    feature: "Detailed Bilingual Urdu/English Receipt with Legal Disclaimers & Return Policy",
    description: "Thermal receipt and A4 formal tax invoice preview. Formatted specifically for Pakistani Sarafa regulations with explicit purity disclosures, making rates, and QR verification.",
    image: "04-billing-print-preview.png"
  },

  // MODULE 3: INVENTORY & BULLION MANAGEMENT
  {
    module: "MODULE 03 • INVENTORY & VAULT",
    title: "Finished Jewellery Visual Gallery",
    urdu: "تیار زیورات کا بصری گیلری ویو",
    badge: "Visual Catalog",
    feature: "High-Density Card Grid with Tag SKUs, Gross/Net Weights, Tray IDs & Karat Badges",
    description: "Modern e-commerce style visual inventory catalog. Sales staff can browse showroom stock by category (Bridal, Bangles, Chains, Rings), check tray locations, and view making rates.",
    image: "07-inventory-gallery-grid.png"
  },
  {
    module: "MODULE 03 • INVENTORY & VAULT",
    title: "Inventory Data Table & Multi-Filter View",
    urdu: "اسٹاک کا تفصیلی جدول اور فلٹرز",
    badge: "High-Density Audit",
    feature: "Sortable Multi-Column Grid with Stock Valuation, Tray Allocations & Purity Filters",
    description: "Audit-ready table view for inventory controllers. Supports multi-column filtering by Karat (24K, 22K, 21K, 18K), tray assignment, and stone cost tracking.",
    image: "08-inventory-table-view.png"
  },
  {
    module: "MODULE 03 • INVENTORY & VAULT",
    title: "Jewellery Item Detail Lightbox Modal",
    urdu: "زیور کی مکمل تفصیل اور بڑی تصویر",
    badge: "Client Showcase",
    feature: "Full-Resolution Image Zoom with Complete Technical Specs & Making Formula",
    description: "Interactive showcase modal for customer counter presentations. Displays high-resolution photography alongside exact gross weight, stone weight, and labour details.",
    image: "09-inventory-image-zoom-modal.png"
  },
  {
    module: "MODULE 03 • INVENTORY & VAULT",
    title: "New Jewellery Stock Intake Drawer",
    urdu: "نئے زیورات کا اندراج اور بارکوڈ ٹیگنگ",
    badge: "Fast Cataloging",
    feature: "Slide-Over Form for Cataloging New Stock Items, Image Attachment & Tray Assignment",
    description: "Streamlined stock intake drawer. Generates unique Tag SKUs, auto-calculates net weights from gross/stone inputs, and assigns items to showroom showcase trays.",
    image: "10-inventory-add-item-sheet.png"
  },
  {
    module: "MODULE 03 • INVENTORY & VAULT",
    title: "Raw Bullion & Scrap Lots Register",
    urdu: "خام سونا (بسکت) اور کچے مال کا کھاتہ",
    badge: "Bullion Banking",
    feature: "Pure 24K Bars, Melted Scrap Lots, Fine Weight Equivalence & Average Cost Basis",
    description: "Dedicated vault ledger for raw gold purchases. Tracks 24K biscuits, melted scrap lots from customers, and fine gold grams conversion for melting and casting batches.",
    image: "11-inventory-raw-stock-lots.png"
  },

  // MODULE 4: SALES INVOICING RECORDS
  {
    module: "MODULE 04 • BILLS & SALES HISTORY",
    title: "Bills Register & Settlement Audit",
    urdu: "سیلز انوائسز کا تاریخی ریکارڈ",
    badge: "Transaction Ledger",
    feature: "Chronological Sales Repository with Customer Lookup, Settlement Status & Margins",
    description: "Comprehensive audit log of all issued bills. Shows cash paid vs balance due, payment method (Cash, Bank, Gold Exchange), and quick actions for reprint and returns.",
    image: "12-bills-register.png"
  },
  {
    module: "MODULE 04 • BILLS & SALES HISTORY",
    title: "Itemized Bill Inspection Modal",
    urdu: "بل کی مکمل تفصیلات اور ادائیگی کا ثبوت",
    badge: "Dispute Prevention",
    feature: "Line-by-Line Item Breakdown, Exact Deductions, Gold Rate Benchmark & Balance",
    description: "Instant access to original transaction details. Displays historical gold rate locked at the moment of sale, making charges applied, and remaining customer ledger dues.",
    image: "13-bills-detail-view.png"
  },

  // MODULE 5: CUSTOMER ACCOUNTS & DUAL LEDGER
  {
    module: "MODULE 05 • CUSTOMERS & ACCOUNTS",
    title: "Customer Accounts & Dual-Currency Roznamcha",
    urdu: "گاہکوں کا دوہرا کھاتہ (روپیہ اور سونا)",
    badge: "Sarafa Standard",
    feature: "Simultaneous Real-time Ledger Tracking for PKR Cash and Pure Gold (Grams/Tola)",
    description: "The gold trade operates on dual balances: customers owe or hold cash AND physical gold weight. This dual ledger updates running balances in both currencies concurrently.",
    image: "14-customers-ledger.png"
  },
  {
    module: "MODULE 05 • CUSTOMERS & ACCOUNTS",
    title: "Credit / Debit Voucher Receipt Modal",
    urdu: "وصولی اور ادائیگی کا واؤچر",
    badge: "Cash & Gold In/Out",
    feature: "Recording Customer Cash Deposits or Physical Gold Bar Inflows with Reference Tracking",
    description: "Rapid entry dialog for recording partial payments, gold advance deposits, or credit repayments. Automatically prints voucher and updates customer running balances.",
    image: "15-customers-credit-voucher-modal.png"
  },
  {
    module: "MODULE 05 • CUSTOMERS & ACCOUNTS",
    title: "Customer Profile Intake Sheet",
    urdu: "نئے گاہک کا اکاؤنٹ کھولنا",
    badge: "KYC & Verification",
    feature: "Customer Onboarding with CNIC, Credit Limit Controls, Wholesale Group & SMS Alerts",
    description: "Customer onboarding drawer. Sets custom credit ceilings, captures alternate contacts and CNIC for AML/compliance, and configures automated SMS transaction notifications.",
    image: "16-customers-new-customer-sheet.png"
  },

  // MODULE 6: WORKSHOP & MANUFACTURING
  {
    module: "MODULE 06 • WORKSHOP & MANUFACTURING",
    title: "Custom Jewellery Orders Register",
    urdu: "کاریگر اور گاہک کے خصوصی آرڈرز",
    badge: "Bespoke Orders",
    feature: "Bespoke Order Pipeline with Karigar Assignments, Promised Dates & Advance Gold",
    description: "Centralized tracking for bespoke bridal and retail orders. Tracks customer design requirements, target weights, advance payments, and assigned Karigar goldsmiths.",
    image: "17-orders-customer-list.png"
  },
  {
    module: "MODULE 06 • WORKSHOP & MANUFACTURING",
    title: "Workshop Production Kanban Board",
    urdu: "ورکشاپ پروڈکشن کانبان بورڈ",
    badge: "Visual Workflow",
    feature: "Stage-by-Stage Tracking: Order Placed ➔ Casting ➔ Setting ➔ Polish ➔ Ready",
    description: "Drag-and-drop production board for workshop managers. Monitors active manufacturing phases, highlights delayed jobs, and tracks items currently at the polishing or setting bench.",
    image: "18-orders-kanban-board.png"
  },
  {
    module: "MODULE 06 • WORKSHOP & MANUFACTURING",
    title: "Casting Batches & Raw Metal Ledger",
    urdu: "کاسٹنگ بیجز اور خام مال کی لاگت",
    badge: "Metallurgy Tracking",
    feature: "Raw Pure Metal Issued vs Casting Yields, Tree Weights, and Scrap Returns",
    description: "Accountability ledger for the casting department. Records raw gold allocated to casting flasks, tree weights, and recovered scrap, preventing untracked gold loss.",
    image: "19-orders-casting-tab.png"
  },
  {
    module: "MODULE 06 • WORKSHOP & MANUFACTURING",
    title: "Karigar Job Work & Wastage Ledger",
    urdu: "کاریگر مال کا حساب اور جھاڑ کٹوتی",
    badge: "Wastage Control",
    feature: "Metal Issued to Goldsmiths vs Finished Returns, Tracking Exact Wastage (Kharad)",
    description: "Eliminates goldsmith disputes. Calculates exact metal issued, finished jewellery returned, allowed wastage tolerance percentage, and net karigar gold balance.",
    image: "20-orders-works-tab.png"
  },
  {
    module: "MODULE 06 • WORKSHOP & MANUFACTURING",
    title: "New Bespoke Order Intake Modal",
    urdu: "نیا کسٹم آرڈر فارم اور نمونہ",
    badge: "Order Intake",
    feature: "Comprehensive Specification Modal: Sample Photo, Target Weight, Karat & Advance",
    description: "Full-fidelity modal for booking custom orders at the counter. Records customer metal deposit, agreed making charge per gram, and delivery deadline.",
    image: "21-orders-new-order-modal.png"
  },

  // MODULE 7: ASSAY & METALLURGY
  {
    module: "MODULE 07 • ASSAY & METALLURGY",
    title: "Gold Karat & Tehleel Assay Calculator",
    urdu: "گولڈ ٹیسٹنگ اور تحلیل لیبارٹری سرٹیفکیٹ",
    badge: "Laboratory Purity",
    feature: "Acid, Touchstone & XRF Specific Gravity Testing with Purity Certification",
    description: "Professional assay laboratory screen. Determines exact gold purity percentage, calculates equivalent fine 24K weight, and produces printable customer Assay Certificates.",
    image: "22-tehleel-assay-calc.png"
  },
  {
    module: "MODULE 07 • ASSAY & METALLURGY",
    title: "Metallurgy Calculation Mode Chooser",
    urdu: "مکسنگ اور کیرٹ بدلنے کا انتخاب",
    badge: "Quick Chooser",
    feature: "Modal Chooser between Multi-Batch Metal Mixing and Karat Transformation",
    description: "Quick-access modal guiding the jeweler or workshop master to either combine disparate Karat scrap lots or calculate alloy required to raise/lower Karat.",
    image: "23a-modal-mixing-chooser.png"
  },
  {
    module: "MODULE 07 • ASSAY & METALLURGY",
    title: "Gold Alloy & Karat Changer Calculator",
    urdu: "کیرٹ تبدیل کرنے اور تانبے/چاندی کا فارمولا",
    badge: "Exact Formulation",
    feature: "Mathematical Formula to Upgrade or Downgrade Gold Karat (e.g. 24K to 21K/22K)",
    description: "Scientific alloy mixing tool. Tells the jeweler exactly how many grams of copper/silver alloy (کھوٹ) or 24K pure gold must be added to achieve exact 21K, 22K, or 18K purity.",
    image: "23-mixing-changer.png"
  },

  // MODULE 8: FINANCE & MARKET INTELLIGENCE
  {
    module: "MODULE 08 • FINANCE & MARKETS",
    title: "Daily Roznamcha Cash & Day Book",
    urdu: "روزنامچہ کیش بک اور اخراجات",
    badge: "Daily Cash Audit",
    feature: "Real-time Cash Inflows, Bank Transfers, Shop Expenses & Drawer Reconciliation",
    description: "Daily accounting daybook tracking cash counter receipts, supplier payments, tea/utility expenses, and daily closing vault cash reconciliations.",
    image: "24-accounts-daybook.png"
  },
  {
    module: "MODULE 08 • FINANCE & MARKETS",
    title: "Financial Statements & Stock Valuation",
    urdu: "مالیاتی رپورٹس اور اسٹاک کی مالیت",
    badge: "P&L & Balance Sheet",
    feature: "Automated Profit & Loss, Net Worth Balance Sheet & Bullion Inventory Valuation",
    description: "Comprehensive financial intelligence dashboard. Automatically marks inventory value to market based on today's Mandi rate, providing real-time net worth calculation.",
    image: "25-reports-financial.png"
  },
  {
    module: "MODULE 08 • FINANCE & MARKETS",
    title: "Sarafa Mandi Live Rate Board",
    urdu: "صرافہ منڈی کے لائیو ریٹس",
    badge: "Market Benchmark",
    feature: "Live Benchmark Rates for 24K, 22K, 21K, 18K & Silver with Buy/Sell Margins",
    description: "Real-time rates screen mirroring official Sarafa Association boards. Automatically computes per-tola, per-10-gram, and per-gram buy/sell spreads.",
    image: "26-rates-mandi-board.png"
  },
  {
    module: "MODULE 08 • FINANCE & MARKETS",
    title: "Automated Customer SMS Dispatch Portal",
    urdu: "ایس ایم ایس الرٹس اور منڈی ریٹ براڈکاسٹ",
    badge: "Customer Engagement",
    feature: "Automated Bill Receipts, Payment Confirmations, and Daily Rate Broadcast via GSM",
    description: "Integrated SMS notification gateway. Sends automated purchase invoices, ledger payment receipts, and daily morning Mandi rates to VIP customer phones.",
    image: "27-sms-portal.png"
  },

  // MODULE 9: SYSTEM CONFIG & ACCELERATORS
  {
    module: "MODULE 09 • SYSTEM & ACCELERATORS",
    title: "Enterprise Settings & Configuration",
    urdu: "سسٹم سیٹنگز اور پرنٹر فارمیٹنگ",
    badge: "Customization",
    feature: "Store Profile, NTN/STRN Tax Numbers, Thermal Receipt Formatting & Units",
    description: "Complete ERP configuration suite. Configures shop branch identity, legal tax numbers, default rounding precision, and thermal/laser printer drivers.",
    image: "28-settings-general.png"
  },
  {
    module: "MODULE 09 • SYSTEM & ACCELERATORS",
    title: "Keyboard Shortcuts & Hotkey Guide",
    urdu: "کی بورڈ شارٹ کٹس گائیڈ",
    badge: "Mouse-Free POS",
    feature: "Complete F1-F12 Hotkey Map Enabling 100% Keyboard-Driven Counter Operation",
    description: "Designed for high-traffic Sarafa retail counters. Cashiers can operate billing, open calculators, change rates, and save bills entirely without touching a mouse.",
    image: "29-settings-hotkeys.png"
  },
  {
    module: "MODULE 09 • SYSTEM & ACCELERATORS",
    title: "Floating Quick Gold Calculator (F2)",
    urdu: "فوری گولڈ کیلکولیٹر اور کنورٹر",
    badge: "Instant Tool [F2]",
    feature: "Non-Intrusive Modal for Rapid Weight Conversion and Quotation Estimations",
    description: "Callable from any screen via F2. Converts between Tola, Masha, Ratti, Grams, and Milligrams with instant price quotes without interrupting active workflows.",
    image: "30-modal-calculator-f2.png"
  },
  {
    module: "MODULE 09 • SYSTEM & ACCELERATORS",
    title: "Spotlight Command Palette (Ctrl+K)",
    urdu: "کمانڈ پیلیٹ اور فاسٹ سرچ",
    badge: "Universal Search",
    feature: "Universal Quick-Nav to Customers, Bills, Inventory Items, and Quick Actions",
    description: "Modern Spotlight-style command bar. Allows instant jumps to any customer account, bill number, or module with simple keyboard typing.",
    image: "31-modal-command-palette.png"
  },
  {
    module: "MODULE 09 • SYSTEM & ACCELERATORS",
    title: "Live Mandi Rate Quick-Adjuster (F11)",
    urdu: "منڈی ریٹ کی فوری ایڈجسٹمنٹ",
    badge: "Live Adjust [F11]",
    feature: "One-Click Market Rate Adjustment Dialog with Immediate POS Price Re-Indexing",
    description: "When Mandi prices shift during trading hours, tapping F11 opens an instant rate adjustment dialog that immediately updates billing calculations across the entire system.",
    image: "32-modal-mandi-f11.png"
  },

  // MODULE 10: SHOWROOM DARK THEME
  {
    module: "MODULE 10 • SHOWROOM DARK MODE",
    title: "OLED Dark Mode: Executive Dashboard",
    urdu: "ڈارک موڈ ڈیش بورڈ (ڈم شوروم لائٹنگ کے لیے)",
    badge: "OLED Contrast",
    feature: "Deep Monochrome Black Contrast for Dim Jewellery Showrooms & Evening Audits",
    description: "Optimized for luxury jewellery showroom lighting. Deep blacks and zinc surfaces reduce glare, highlight key figures, and conserve energy on OLED POS displays.",
    image: "33-darkmode-dashboard.png"
  },
  {
    module: "MODULE 10 • SHOWROOM DARK MODE",
    title: "OLED Dark Mode: Billing Main Screen",
    urdu: "ڈارک موڈ گولڈ بلنگ کاؤنٹر",
    badge: "High-Readability POS",
    feature: "Elevated Calculation Panels & High-Contrast Typography for Busy Evening Counters",
    description: "Billing interface in dark mode. The high-contrast white-on-black net invoice card ensures cashiers and customers clearly read exact weights and final amounts.",
    image: "34-darkmode-billing.png"
  },
  {
    module: "MODULE 10 • SHOWROOM DARK MODE",
    title: "OLED Dark Mode: Finished Jewellery Gallery",
    urdu: "ڈارک موڈ زیورات کیٹلاگ",
    badge: "Luxury Presentation",
    feature: "Jewellery Photography Shines on Pitch Black Backgrounds for High-End Customers",
    description: "Jewellery photography stands out dramatically against dark backgrounds, making this mode ideal for presenting high-value bridal sets to customers on showroom tablets.",
    image: "35-darkmode-inventory-gallery.png"
  }
];

function generateHtml() {
  const totalSlides = slidesData.length + 3; // + cover, + toc, + tech roadmap

  let slidesHtml = '';

  // SLIDE 1: COVER PAGE
  slidesHtml += `
    <div class="slide slide-cover">
      <div class="cover-glow"></div>
      <div class="cover-content">
        <div class="cover-badge">
          <span class="badge-dot"></span>
          OFFICIAL CLIENT PROTOTYPE SPECIFICATION • SARAFA ERP
        </div>
        <h1 class="cover-title">ISLAM JEWELLERS</h1>
        <h2 class="cover-subtitle">Bullion & Jewellery Enterprise Management System</h2>
        <p class="cover-desc">
          Complete high-fidelity software architecture and interactive interface walkthrough. Built specifically for Pakistani Sarafa markets, integrating real-time Tola-Masha-Ratti purity engines, dual-currency Roznamcha ledgers, and workshop goldsmith metallurgy.
        </p>

        <div class="cover-grid">
          <div class="cover-stat">
            <span class="stat-label">STANDARDIZED PURITY</span>
            <span class="stat-val">1 Tola = 11.664g</span>
            <span class="stat-sub">12 Masha • 96 Ratti</span>
          </div>
          <div class="cover-stat">
            <span class="stat-label">DUAL ROZNAMCHA</span>
            <span class="stat-val">PKR + Gold Grams</span>
            <span class="stat-sub">Concurrent Ledger Balances</span>
          </div>
          <div class="cover-stat">
            <span class="stat-label">WORKSHOP METALLURGY</span>
            <span class="stat-val">Karigar & Casting</span>
            <span class="stat-sub">Scrap & Wastage Accountability</span>
          </div>
          <div class="cover-stat">
            <span class="stat-label">RETAIL ACCELERATION</span>
            <span class="stat-val">F1 – F12 Hotkeys</span>
            <span class="stat-sub">100% Mouse-Free Counter POS</span>
          </div>
        </div>

        <div class="cover-footer">
          <div>
            <span class="footer-label">PREPARED FOR:</span>
            <strong>Islam Jewellers Management & Stakeholders</strong>
          </div>
          <div>
            <span class="footer-label">SYSTEM VERSION:</span>
            <strong>Gold King Pro ERP v2.4 (React + shadcn/ui)</strong>
          </div>
          <div>
            <span class="footer-label">DATE / STATUS:</span>
            <strong>September 2026 • High-Fidelity Client Prototype</strong>
          </div>
        </div>
      </div>
      <div class="slide-footer-bar">
        <span>CONFIDENTIAL • ISLAM JEWELLERS ERP SPECIFICATION DECK</span>
        <span>SLIDE 01 / ${totalSlides.toString().padStart(2, '0')}</span>
      </div>
    </div>
  `;

  // SLIDE 2: ARCHITECTURE & TABLE OF CONTENTS
  slidesHtml += `
    <div class="slide slide-toc">
      <div class="slide-header">
        <div class="header-top">
          <span class="module-tag">SYSTEM BLUEPRINT</span>
          <span class="page-count">02 / ${totalSlides.toString().padStart(2, '0')}</span>
        </div>
        <div class="header-main">
          <div>
            <h2 class="slide-title">System Architecture & Walkthrough Flow</h2>
            <div class="slide-urdu">سسٹم کے تمام ماڈیولز اور پیشکش کا خلاصہ</div>
          </div>
          <div class="header-feature-pill">
            10 Functional Modules • 36 Interactive Screens
          </div>
        </div>
      </div>

      <div class="toc-grid">
        <div class="toc-card">
          <div class="toc-num">01</div>
          <div class="toc-info">
            <h3>Executive Intelligence</h3>
            <p>Real-time KPI cards, sales trends, vault balances, and pure gold grams metric toggles.</p>
          </div>
        </div>
        <div class="toc-card">
          <div class="toc-num">02</div>
          <div class="toc-info">
            <h3>Point of Sale & Billing</h3>
            <p>Tola-Masha-Ratti purity calculator, stone deductions, customer lookup, and bilingual thermal invoices.</p>
          </div>
        </div>
        <div class="toc-card">
          <div class="toc-num">03</div>
          <div class="toc-info">
            <h3>Inventory & Vault Management</h3>
            <p>Finished jewellery gallery grid, multi-filter audit table, item lightbox, and 24K raw bullion lots.</p>
          </div>
        </div>
        <div class="toc-card">
          <div class="toc-num">04</div>
          <div class="toc-info">
            <h3>Sales Invoicing Repository</h3>
            <p>Comprehensive historical bills archive, itemized receipts, settlement audit, and return management.</p>
          </div>
        </div>
        <div class="toc-card">
          <div class="toc-num">05</div>
          <div class="toc-info">
            <h3>Customer Accounts & Dual Ledger</h3>
            <p>Simultaneous PKR Cash and Fine Gold Grams Roznamcha, credit/debit vouchers, and customer onboarding.</p>
          </div>
        </div>
        <div class="toc-card">
          <div class="toc-num">06</div>
          <div class="toc-info">
            <h3>Workshop & Manufacturing</h3>
            <p>Bespoke customer orders, production Kanban workflow, casting metallurgy, and Karigar wastage control.</p>
          </div>
        </div>
        <div class="toc-card">
          <div class="toc-num">07</div>
          <div class="toc-info">
            <h3>Assay & Purity Metallurgy</h3>
            <p>Laboratory Tehleel purity testing, formal assay certificates, and Karat upgrading/mixing formulations.</p>
          </div>
        </div>
        <div class="toc-card">
          <div class="toc-num">08</div>
          <div class="toc-info">
            <h3>Finance & Sarafa Mandi</h3>
            <p>Cash daybook, mark-to-market P&L, balance sheets, live Mandi rate board, and automated GSM SMS dispatch.</p>
          </div>
        </div>
        <div class="toc-card">
          <div class="toc-num">09</div>
          <div class="toc-info">
            <h3>System Controls & Accelerators</h3>
            <p>F1-F12 hotkey map, floating F2 quick gold calculator, Spotlight Ctrl+K palette, and F11 Mandi adjustment.</p>
          </div>
        </div>
      </div>

      <div class="slide-footer-bar">
        <span>ISLAM JEWELLERS ERP • ARCHITECTURAL OVERVIEW</span>
        <span>SLIDE 02 / ${totalSlides.toString().padStart(2, '0')}</span>
      </div>
    </div>
  `;

  // SCREEN SLIDES (3 to 38)
  slidesData.forEach((s, idx) => {
    const slideNumber = (idx + 3).toString().padStart(2, '0');
    const imagePath = path.resolve(screenshotsDir, s.image);

    slidesHtml += `
      <div class="slide slide-screen">
        <div class="slide-header">
          <div class="header-top">
            <span class="module-tag">${s.module}</span>
            <span class="page-count">${slideNumber} / ${totalSlides.toString().padStart(2, '0')}</span>
          </div>
          <div class="header-main">
            <div>
              <h2 class="slide-title">${s.title}</h2>
              <div class="slide-urdu">${s.urdu}</div>
            </div>
            <div class="header-feature-pill">
              ${s.feature}
            </div>
          </div>
          <div class="header-desc">
            ${s.description}
          </div>
        </div>

        <div class="slide-body">
          <div class="screen-frame">
            <img src="file://${imagePath}" alt="${s.title}" class="screen-img" />
          </div>
        </div>

        <div class="slide-footer-bar">
          <span>ISLAM JEWELLERS ERP • HIGH-FIDELITY CLIENT PROTOTYPE</span>
          <span>${s.badge} • SLIDE ${slideNumber} / ${totalSlides.toString().padStart(2, '0')}</span>
        </div>
      </div>
    `;
  });

  // SLIDE 39: TECHNICAL SUMMARY & NEXT STEPS
  slidesHtml += `
    <div class="slide slide-summary">
      <div class="slide-header">
        <div class="header-top">
          <span class="module-tag">PRODUCTION ROADMAP</span>
          <span class="page-count">${totalSlides.toString().padStart(2, '0')} / ${totalSlides.toString().padStart(2, '0')}</span>
        </div>
        <div class="header-main">
          <div>
            <h2 class="slide-title">Technical Architecture & Client Deployment Plan</h2>
            <div class="slide-urdu">تکنیکی فریم ورک اور اگلے مراحل</div>
          </div>
          <div class="header-feature-pill">
            Production-Ready Architecture
          </div>
        </div>
      </div>

      <div class="roadmap-grid">
        <div class="roadmap-col">
          <h3 class="col-title">1. FRONTEND ARCHITECTURE</h3>
          <ul class="col-list">
            <li><strong>React 18 & TypeScript:</strong> Zero runtime type errors, strict gold milligram rounding safeguards.</li>
            <li><strong>Tailwind CSS & shadcn/ui:</strong> Vercel/Geist clean monochrome design system, 100% theme responsive.</li>
            <li><strong>Offline-First Speed:</strong> Instant local UI state with zero network latency at the billing counter.</li>
            <li><strong>Accessibility & Ergonomics:</strong> High-contrast typography, F1-F12 hotkeys for speedy checkout.</li>
          </ul>
        </div>

        <div class="roadmap-col">
          <h3 class="col-title">2. HARDWARE INTEGRATION</h3>
          <ul class="col-list">
            <li><strong>Digital Weighing Scales:</strong> Direct RS-232 / USB scale integration for tamper-proof gross weight inputs.</li>
            <li><strong>Thermal Receipt Printers:</strong> ESC/POS thermal printing for fast 80mm Urdu & English sales vouchers.</li>
            <li><strong>Barcode & RFID Scanners:</strong> Instant SKU scanning from jewellery tag labels.</li>
            <li><strong>GSM SMS Gateway:</strong> Dual SIM COM modem for automatic transaction SMS without internet dependency.</li>
          </ul>
        </div>

        <div class="roadmap-col">
          <h3 class="col-title">3. BACKEND & SECURITY</h3>
          <ul class="col-list">
            <li><strong>PostgreSQL Database:</strong> ACID-compliant transactional ledger with immutable audit logs.</li>
            <li><strong>Role-Based Access (RBAC):</strong> Strict separation between Cashier, Karigar Manager, and Vault Owner.</li>
            <li><strong>Automated Nightly Backups:</strong> Encrypted offsite cloud backups and local USB drive redundancy.</li>
            <li><strong>Multi-Branch Synchronization:</strong> Centralized Mandi rate distribution across multiple retail outlets.</li>
          </ul>
        </div>
      </div>

      <div class="summary-contact-box">
        <div class="contact-left">
          <h4>READY FOR CLIENT FEEDBACK & PILOT TESTING</h4>
          <p>This prototype demonstrates every core workflow required for modern Sarafa retail, bullion trade, and goldsmith workshop management. We are ready to proceed with client feedback incorporation and hardware provisioning.</p>
        </div>
        <div class="contact-right">
          <div class="badge-approved">PROTOTYPE VALIDATED</div>
          <div class="sign-text">Islam Jewellers Engineering Team</div>
        </div>
      </div>

      <div class="slide-footer-bar">
        <span>ISLAM JEWELLERS ERP • TECHNICAL SPECIFICATION SUMMARY</span>
        <span>SLIDE ${totalSlides.toString().padStart(2, '0')} / ${totalSlides.toString().padStart(2, '0')}</span>
      </div>
    </div>
  `;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Islam Jewellers ERP — Client Prototype Presentation</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    @page {
      size: 1920px 1080px;
      margin: 0;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      background: #0c0a09;
      color: #1c1917;
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      -webkit-font-smoothing: antialiased;
    }

    .slide {
      width: 1920px;
      height: 1080px;
      page-break-after: always;
      break-after: page;
      overflow: hidden;
      position: relative;
      background: #FAF8F5;
      display: flex;
      flex-direction: column;
      padding: 32px 50px 20px 50px;
    }

    /* COVER PAGE */
    .slide-cover {
      background: radial-gradient(circle at 50% 30%, #1f1912 0%, #14100c 70%, #0c0a08 100%);
      color: #ffffff;
      padding: 80px 100px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .cover-content {
      max-width: 1500px;
      z-index: 2;
    }
    .cover-badge {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 8px 18px;
      border-radius: 9999px;
      background: rgba(217, 119, 6, 0.12);
      border: 1px solid rgba(217, 119, 6, 0.35);
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 1.5px;
      color: #fcd34d;
      margin-bottom: 28px;
    }
    .badge-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #f59e0b;
      box-shadow: 0 0 10px #f59e0b;
    }
    .cover-title {
      font-family: 'Outfit', sans-serif;
      font-size: 82px;
      font-weight: 900;
      letter-spacing: -2px;
      line-height: 1.05;
      color: #ffffff;
      margin-bottom: 12px;
    }
    .cover-subtitle {
      font-family: 'Outfit', sans-serif;
      font-size: 32px;
      font-weight: 500;
      color: #d4af37;
      letter-spacing: -0.5px;
      margin-bottom: 24px;
    }
    .cover-desc {
      font-size: 19px;
      line-height: 1.6;
      color: #e7e5e4;
      max-width: 1200px;
      margin-bottom: 48px;
    }
    .cover-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 24px;
      margin-bottom: 50px;
    }
    .cover-stat {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(217, 119, 6, 0.25);
      border-radius: 12px;
      padding: 24px 28px;
      display: flex;
      flex-direction: column;
    }
    .stat-label {
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 1.2px;
      color: #a8a29e;
      margin-bottom: 8px;
    }
    .stat-val {
      font-size: 26px;
      font-weight: 800;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-variant-numeric: tabular-nums;
      color: #fde68a;
      margin-bottom: 4px;
    }
    .stat-sub {
      font-size: 13px;
      color: #78716c;
    }
    .cover-footer {
      display: flex;
      gap: 60px;
      padding-top: 28px;
      border-top: 1px solid rgba(255, 255, 255, 0.12);
      font-size: 14px;
      color: #a8a29e;
    }
    .footer-label {
      display: block;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 1px;
      color: #78716c;
      margin-bottom: 4px;
    }
    .cover-footer strong {
      color: #ffffff;
      font-size: 15px;
    }

    /* SLIDE HEADER */
    .slide-header {
      margin-bottom: 16px;
      flex-shrink: 0;
    }
    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
    }
    .module-tag {
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 1.5px;
      color: #b45309;
      text-transform: uppercase;
    }
    .page-count {
      font-size: 13px;
      font-weight: 700;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-variant-numeric: tabular-nums;
      color: #78716c;
    }
    .header-main {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 8px;
    }
    .slide-title {
      font-family: 'Outfit', sans-serif;
      font-size: 30px;
      font-weight: 800;
      letter-spacing: -0.5px;
      color: #1c1917;
      display: inline-block;
      margin-right: 14px;
    }
    .slide-urdu {
      font-size: 17px;
      color: #78716c;
      font-weight: 500;
      display: inline-block;
    }
    .header-feature-pill {
      background: #1c1917;
      border: 1px solid rgba(217, 119, 6, 0.4);
      color: #fde68a;
      font-size: 12px;
      font-weight: 700;
      padding: 6px 14px;
      border-radius: 6px;
      font-family: 'Plus Jakarta Sans', sans-serif;
      letter-spacing: 0.2px;
      flex-shrink: 0;
    }
    .header-desc {
      font-size: 14px;
      line-height: 1.45;
      color: #57534e;
      max-width: 1500px;
    }

    /* SLIDE BODY & IMAGE FRAME */
    .slide-body {
      flex: 1;
      display: flex;
      min-height: 0;
      position: relative;
    }
    .screen-frame {
      width: 100%;
      height: 100%;
      background: #ffffff;
      border: 1px solid #e7e2da;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 12px 30px -6px rgba(40, 30, 20, 0.08), 0 8px 10px -6px rgba(40, 30, 20, 0.04);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .screen-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      object-position: center;
      display: block;
    }

    /* FOOTER BAR */
    .slide-footer-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 10px;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.8px;
      color: #71717a;
      text-transform: uppercase;
      flex-shrink: 0;
    }

    /* TOC SLIDE */
    .slide-toc {
      background: #ffffff;
      padding: 50px 70px;
    }
    .toc-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-top: 24px;
      flex: 1;
    }
    .toc-card {
      background: #f4f4f5;
      border: 1px solid #e4e4e7;
      border-radius: 10px;
      padding: 24px;
      display: flex;
      gap: 18px;
    }
    .toc-num {
      font-size: 24px;
      font-weight: 900;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      color: #18181b;
      opacity: 0.4;
      line-height: 1;
    }
    .toc-info h3 {
      font-size: 17px;
      font-weight: 700;
      color: #09090b;
      margin-bottom: 6px;
    }
    .toc-info p {
      font-size: 13px;
      color: #71717a;
      line-height: 1.5;
    }

    /* SUMMARY SLIDE */
    .slide-summary {
      background: #ffffff;
      padding: 50px 70px;
    }
    .roadmap-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
      margin: 24px 0 32px 0;
      flex: 1;
    }
    .roadmap-col {
      background: #f4f4f5;
      border: 1px solid #e4e4e7;
      border-radius: 12px;
      padding: 28px;
    }
    .col-title {
      font-size: 14px;
      font-weight: 800;
      letter-spacing: 1px;
      color: #18181b;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 2px solid #e4e4e7;
    }
    .col-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .col-list li {
      font-size: 13.5px;
      color: #3f3f46;
      line-height: 1.5;
    }
    .col-list strong {
      color: #09090b;
    }
    .summary-contact-box {
      background: #09090b;
      color: #ffffff;
      border-radius: 12px;
      padding: 28px 36px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .contact-left h4 {
      font-size: 18px;
      font-weight: 800;
      letter-spacing: 0.5px;
      margin-bottom: 6px;
    }
    .contact-left p {
      font-size: 14px;
      color: #a1a1aa;
      max-width: 1000px;
    }
    .badge-approved {
      background: #22c55e;
      color: #000000;
      font-size: 12px;
      font-weight: 800;
      padding: 6px 16px;
      border-radius: 6px;
      letter-spacing: 1px;
      margin-bottom: 6px;
      text-align: center;
    }
    .sign-text {
      font-size: 12px;
      color: #71717a;
      text-align: center;
    }
  </style>
</head>
<body>
  ${slidesHtml}
</body>
</html>`;
}

async function main() {
  console.log('Generating HTML presentation deck...');
  const htmlContent = generateHtml();
  const deckHtmlPath = path.resolve(__dirname, '../islam-jewellers-deck.html');
  fs.writeFileSync(deckHtmlPath, htmlContent);
  console.log('Saved HTML deck to:', deckHtmlPath);

  console.log('Launching Playwright Chrome to export high-definition PDF...');
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files']
  });

  const page = await browser.newPage();
  
  // Set viewport to 1920x1080 with 2x deviceScaleFactor for crispness
  await page.setViewportSize({ width: 1920, height: 1080 });

  console.log('Loading deck in browser...');
  await page.goto('file://' + deckHtmlPath, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const pdfPath = path.resolve(__dirname, '../Islam-Jewellers-ERP-Prototype-Presentation.pdf');
  console.log('Rendering PDF to:', pdfPath);

  await page.pdf({
    path: pdfPath,
    preferCSSPageSize: true,
    printBackground: true,
  });

  const fileSizeMb = (fs.statSync(pdfPath).size / (1024 * 1024)).toFixed(2);
  console.log(`\n========================================`);
  console.log(`SUCCESS! High-Resolution Presentation PDF Generated:`);
  console.log(`Path: ${pdfPath}`);
  console.log(`File Size: ${fileSizeMb} MB`);
  console.log(`Total Slides: ${slidesData.length + 3}`);
  console.log(`========================================\n`);

  await browser.close();
}

main().catch(err => {
  console.error('Error generating PDF:', err);
  process.exit(1);
});
