# Gold King Rebuild — Complete UI Specification (for AI code generation)

**Goal:** Rebuild the "Gold King" gold-shop billing desktop app as a modern app using **shadcn/ui + Tailwind + React + TypeScript** (Electron shell + SQLite recommended). Keep every original form, tab, hotkey and calculation. Add a new **Inventory** module and **Dashboards**.

**Source:** Reverse-engineered from screenshots of the Help Window and a screen recording of the running app (branded "ISLAM JEWELLERS" in the recording; the shop name is a setting). Items marked **(verify)** were unreadable or inferred and must be confirmed with the shop owner. Items marked **(NEW)** do not exist in the original.

**Instructions to the AI building this:**
1. Use only shadcn/ui components (`npx shadcn@latest add ...`), Tailwind, lucide-react, TanStack Table, react-hook-form + zod, react-hotkeys-hook, Recharts (shadcn Charts).
2. Every page must be fully keyboard operable. Every hotkey in Section 4 must work and appear in the Help dialog and command palette, generated from one registry file.
3. Build the shared `WeightInput`, `MoneyInput`, `KaratBadge` components (Section 3) first. All pages reuse them.
4. All weights are stored as **integer milligrams**. All money is stored as **integer PKR**. Never store floats for weight or money.
5. Do not invent extra fields. Where this spec says (verify), build the field but keep the formula in one isolated, unit-tested function that is easy to change.
6. Include loading, empty, error and validation states on every page.

---

## 1. Product context and glossary

Gold King is a keyboard-driven billing and accounting tool for a gold dealer / jeweller in Pakistan. A user enters a weight of gold, deducts cuts, multiplies by the day's rate, and saves a bill against a customer. Customers carry a **dual ledger**: gold weight and cash.

| Term | Meaning |
|---|---|
| Tola | Weight unit. **1 tola = 11.664 g** in this app (real value 11.6638). Configurable. |
| Masha | 1 tola = 12 masha |
| Ratti | 1 masha = 8 ratti (so 1 tola = 96 ratti; 1 ratti = 0.1215 g) |
| Kacha | "Raw / unrefined" — the mode badge shown top-left of every weight screen |
| Cut / Tola | Deduction per tola of gold (entered as a weight) |
| Cut | Total cut deducted from the weight |
| Polish / Polish per tola | Polish loss deduction |
| Total WT | Weight after all deductions |
| Gold Rate | Price per tola (PKR) |
| Charges /T | Labour charges per tola (label reads "/F" or "/T"; toggled by the T key: Labour / Tola / Fix) |
| Wasool | Amount received / paid now |
| Carat (Karat) | Purity. Shown as karat (e.g. 20.18) and per-mille (e.g. 841 = 84.1%) |
| Tehleel | Assay / purity test screen (Gold Karat) |
| Mail / Pat / Passa | Alloy added or removed when mixing gold to reach a karat (exact meaning **(verify)**) |
| Tezabi gold | Acid-refined gold |
| Chandi | Silver |
| Purchi | Slip / receipt for a purchase |
| Mandi | Market (live rate) |
| Zakat | 2.5% of total price (shown in a popup on the main form) |
| Karigar | Workshop craftsman (NEW inventory concept) |

---

## 2. Design system

- **Theme:** light by default, dark optional (Settings). Neutral base `zinc`, accent `amber` (gold). Success `emerald`, danger `red`.
- **Density:** compact. Desktop-first, min width 1280px. Base font 14px, inputs height 36px, large numeric readouts (Total WT, Total Price) 28–32px, tabular-nums everywhere numbers appear.
- **Fonts:** Inter for UI, JetBrains Mono for numeric readouts.
- **Row colour cues** (original uses coloured rows; keep as subtle tints via tokens, user-changeable in Settings → Appearance, replacing the original "Back Color / Front Color / Line Color" hotkeys B / N / L):
  - Weight row: green tint · Cut/Tola: blue tint · Cut: blue tint · Polish: orange tint · Total WT: indigo tint · Gold Rate: red/pink tint · Charges: pink tint · Wasool: purple tint.
- **Focus:** strong 2px amber ring on the focused field (original highlights the active cell in cyan). Enter moves to next field; Shift+Enter previous; Esc closes/backs out.
- **Numbers:** right-aligned, thousands separators for money, fixed decimals for weight (grams 3 dp, total grams 4 dp, ratti up to 3 dp).
- **Toasts:** shadcn Sonner for save/print success and errors.
- **Every screen** opens in the app shell (Section 3) except Login and the full-screen "Billing" and calculator screens, which keep the shell's top bar.

---

## 3. Global shell and shared components

### 3.1 App shell
- **Top bar (always visible, height 48px):**
  - Left: shop name (from Settings), "Kacha" mode badge (click to toggle Kacha / Pakka **(verify)**).
  - Centre: live clock (HH:MM:SS AM/PM) and date (e.g. `WED-21/10/2026`).
  - Right: SMS status badge (red = off, green = connected), Mandi rate chip (see 3.3), user menu (avatar, name, role, Switch user Ctrl+U, Logout), Help button (F1), Command palette button (Ctrl+K).
- **Left sidebar (collapsible):** Dashboard · Billing · Customers · Bills · Orders · Accounts · Reports · Inventory (NEW) · Rates · SMS · Settings. Each item shows its hotkey as a `Kbd` hint.
- **Content area:** page title + breadcrumb, page actions on the right.
- **Command palette (Ctrl+K):** shadcn `Command`. Lists every page and action with its hotkey. Typing a customer name searches customers.
- **Status footer (height 32px):** Gold USD/oz · PKR per USD · PKR/tola market rate (matches the red-yellow strip at the bottom of the original main screen) · last backup time · app version.

### 3.2 Shared components

**`WeightInput`** — the signature control. A row of four linked cells: **TOLA · MASHA · RATTI · GRAMS**.
- Editing any cell recalculates the other three. Base value stored in mg.
- Props: `value (mg)`, `onChange`, `label`, `tint`, `readOnly`, `activeUnit` ("auto" | "grams" | "tola"), `allowNegative`.
- Unit mode (bottom-bar buttons `AUTO F7`, `GRAM G`, `TOLA W`): in `grams` mode focus starts in GRAMS cell and tola/masha/ratti are display-only; in `tola` mode focus starts in TOLA and grams is display-only; in `auto` mode the cell edited last drives the rest.
- Ratti cell accepts decimals (e.g. 1.695). Masha 0–11 with carry into tola; ratti 0–7.999 with carry into masha.
- Arrow keys move between cells; Enter goes to the next row.

**`MoneyInput`** — right-aligned integer PKR input with thousands separators, optional `+`/`−` sign toggle.

**`KaratBadge`** — shows `20.18` on top and `841` (per-mille) underneath, e.g. `24 / 1000` for pure gold.

**`LedgerBadge`** — customer balance chip: gold balance in g (with tola breakdown tooltip) and cash balance in PKR; red for owed to shop, green for owed to customer.

**`HotkeyHint`** — shadcn `Kbd` wrapper rendering a hotkey next to buttons.

**`ConfirmDialog`** — shadcn `AlertDialog` for destructive actions.

**`PrintPreviewDialog`** — preview for bill/slip with A4, A5 and thermal-80mm templates, Print and Save-PDF buttons.

### 3.3 Mandi rate chip and bar
- Shows: `Gold $1,922.05/oz`, `USD 162.05 PKR`, `PKR 116,809 /tola`.
- Click or **F11** = refresh Mandi (calls the rate provider, or opens a manual entry dialog if offline).
- Manual override dialog fields: Gold USD/oz, USD→PKR, PKR per tola (24k), "Use as default rate on Billing" toggle.

---

## 4. Hotkey registry (single source of truth)

Implement as `hotkeys.ts` exporting `{ id, keys, label, group, tab, action }[]`. The Help dialog, command palette and tooltips all read from it. Single-letter hotkeys only fire when focus is **not** inside a text input (or when the user holds Alt in inputs).

### 4.1 Main window
| Key | Action |
|---|---|
| A | Amount to Gold (enter an amount, get the gold weight) |
| B | Back colour (open colour popover) |
| C | Customer records |
| F | Fix carat |
| G | Grams mode |
| I | Customer selection |
| K | Carat (open karat panel) |
| L | Line show / hide |
| M | Mixing / Carat menu |
| N | Front colour |
| P | Print |
| R | Input rate |
| S | Search purchi / bill |
| T | Cycle Labour / Tola / Fix charge mode |
| W | Tola mode |
| Z | Zakat popup |
| F1 | Help |
| F2 | Calculator |
| F3 | Order view / edit |
| F4 | Zero (clear form) — bottom-bar button "ZERO (F4)" |
| F5 | Casting order |
| F6 | Accounts |
| F7 | Refresh / Auto / Zero (auto unit mode) |
| F8 | Save only |
| F9 | Gold / Silver switch |
| F10 | General SMS |
| F11 | Refresh Mandi |
| F12 | Works form |
| Shift+5 | Percent cut |
| Ctrl+F12 | Settings |
| Ctrl+G | Per-gram rate |
| Ctrl+F2 | General bill |
| Ctrl+F3 | General order |
| Ctrl+U | User login / switch user |
| X | Exit (bottom bar) |

### 4.2 Karat / Tehleel
| Key | Action |
|---|---|
| K then T | Open Tehleel (Gold Karat) |
| C | Copper / Gold |
| S | Silver / Gold |
| M | Mix Gold |
| U | Tezabi Gold |
| Y | Chandi (silver) |
| Esc | Back to main form |

### 4.3 Pat / Carat Changer
| Key | Action |
|---|---|
| M then M | Mixing mail |
| M then C | Carat changer |
| M then K | Cutting mail |
| I | Inner pat |
| O | Outer pat |
| F7 | Refresh / Auto |
| G / W | Grams / Tola |
| F2 | Calculator |
| K | Carat |
| B / L | Back colour / Line colour |

(The original shows a splash: "For Carat Changer press **C**, for Mixing PAT press **M**, for Mixing CUT press **K**, to go back press **Esc**." Rebuild this as a small chooser dialog opened by `M`.)

### 4.4 Customers
| Key | Action |
|---|---|
| I then A | Group purchi add |
| I then B | Customer bill |
| I then C | Customer credit (+) |
| I then D | Customer debit (−) |
| I then O | Customer order |
| I then V | Customer view |

### 4.5 Reports / Orders / Bills tabs
The original Help window has tabs for Customers, Reports, Orders and Bills whose hotkeys were not captured. Reserve the same tab structure in the Help dialog and populate from the registry as the pages below define them **(verify)**.

---

## 5. Help dialog (F1)

- shadcn `Dialog`, large (max-w-5xl), title "Gold King Help", `Tabs` in this order: **Main Window · Karat/Tehleel · Pat/Carat Changer · Customers · Reports · Orders · Bills**.
- Each tab is a responsive grid of rows: `Kbd` chip + label. Group visually like the original (three columns on Main Window: letter keys, function keys, Ctrl/Shift combos).
- Search input at top filters across all tabs. Esc closes.

---

## 6. Pages

### 6.1 Login (`/login`, also Ctrl+U dialog)
- Card centred: logo, shop name.
- Fields: Username (select or text), Password (masked, show toggle), "Remember on this device" checkbox.
- Buttons: Login (Enter), Cancel.
- Errors: inline "Wrong username or password", lock after 5 failed attempts for 60s.

### 6.2 Billing — Main Window (`/billing`) — the core screen
Full-height page. Four stacked sections.

**A. Header strip:** shop name (large, italic serif), clock, date, "Kacha" badge, SMS badge, customer chip (shows selected customer or "Walk-in").

**B. Weight grid** — column headers: label · TOLA · MASHA · RATTI · GRAMS. Rows (each uses `WeightInput` cells):
| Row | Notes |
|---|---|
| WEIGHT | Gross weight of gold |
| CUT / TOLA | Left side has 3 tiny helper fields (three small numeric boxes, masha / ratti breakdown of the per-tola cut) then the 4 weight cells. Cut deducted per tola of WEIGHT. |
| CUT | Total cut = CUT/TOLA × weight-in-tolas (auto, editable) |
| POLISH / (with `TOLA` toggle button and 3 tiny helper fields) | Polish per tola, same layout as CUT / TOLA |
| POLISH | Total polish = polish/tola × weight-in-tolas (auto, editable) |
| TOTAL WT | Read-only. `WEIGHT − CUT − POLISH`. Large, highlighted, 4-dp grams. |

**C. Price panel** (below the weight grid), two columns:
- Left column fields:
  - **GOLD RATE** (`MoneyInput`, pink) — price per tola. Default from Mandi / last used. Hotkey R focuses it.
  - **CHARGES /T** (`MoneyInput`) — labour. Label changes with the T mode: "Charges /T" (per tola), "Labour", "Fix".
  - **WASOOL** (`MoneyInput`, purple) — amount received now.
- Centre: **GOLD PRICE mini-table** — small 2-row grid of price breakdowns (per masha / per ratti / per gram / etc.; columns were unreadable) **(verify)**. Read-only, updates live from Gold Rate.
- Right column:
  - **CARAT** — `KaratBadge` + numeric input (default 24 / 1000). Hotkey K / F changes it (Fix carat).
  - **TOTAL PRICE** — read-only, large. `(TotalWT_g / gramsPerTola × GoldRate) × (carat/24) + Charges` **(verify carat scaling and where charges apply)**.
  - **ID** (customer ID number input) + **DETAIL** button (opens customer view dialog).
  - Balance line: `TOTAL PRICE − WASOOL` = remaining (shown as new dues for this bill).
  - **Zakat** popover (Z): shows `2.5% of Total Price` (example from the recording: 1,398,000 → 34,950).

**D. Action bar (bottom):** `SAVE (F8)` · `PRINT (P)` · `EXIT (X)` · Mandi strip (Gold USD/oz chip, `PKR 162.05`, `PKR 116,809`) · unit buttons `AUTO (F7)` `GRAM (G)` `TOLA (W)` · `ZERO (F4)`.

**Behaviours:**
- Enter moves down the columns: Weight → Cut/Tola → Cut → Polish/Tola → Polish → Gold Rate → Charges → Wasool → Save.
- ZERO (F4) clears all fields after confirmation if the form is dirty.
- Save: validates customer is selected when Wasool ≠ Total Price (i.e. credit sale), writes bill, writes two ledger entries (gold and cash), deducts inventory if items are attached (NEW), then offers Print. Bill numbers auto-increment per day/year.
- Print: `PrintPreviewDialog`.
- Gold/Silver switch (F9) changes the mode; labels switch to Silver, rate to silver rate.

**Modals opened from this page:**
- **Customer selection (I):** searchable `Command`-style list (name, phone, ID, balances). Enter selects. "New customer" button.
- **Amount to Gold (A):** field Amount (PKR) + Rate → output weight (tola/masha/ratti/grams). "Apply to Weight" button.
- **Fix carat (F):** field Carat value; toggle karat / per-mille; Apply.
- **Search purchi / bill (S):** search input + results table (Bill no., date, customer, weight, total). Enter opens bill.
- **Percent cut (Shift+5):** field Percent (%), applies to WEIGHT to fill CUT.
- **Per-gram rate (Ctrl+G):** field Rate per gram; converts and sets Gold Rate per tola.
- **Zakat popup (Z):** read-only amount, Copy button.
- **Colour popovers (B / N / L):** pick tint per row group; saved in Settings → Appearance.

### 6.3 Gold Karat / Tehleel (`/tehleel`) — title "GOLD KARAT"
Screen with a `KACHA TOLA` label top-left and a Close button top-right. Type selector at top-left of the grid (label changes with the key pressed): **COPPER**, **SILVER**, **ESILVER**, **PURE SILVER** (recording), corresponding to keys C / S / M / U / Y (Copper/Gold, Silver/Gold, Mix Gold, Tezabi Gold, Chandi) — expose as a `ToggleGroup` with those five options.

Grid columns: label · TOLA · MASHA · RATTI · GRAMS. Rows:
| Row | Type | Notes |
|---|---|---|
| 1ST WEIGHT | input | Weight before test |
| 2ND WEIGHT | input | Weight after test |
| CUT / TOLA | input | Cut per tola |
| IMPURITY | calculated | In the recording, Pure Gold = 1st Weight − Impurity **(verify Impurity formula, involves 2nd weight and cut)** |
| PURE GOLD | calculated | Bold, orange tint |
| CARAT row | calculated | `Carat = PureGold/1stWeight × 24` (example: 26.326/31.310 → 20.18 karat, 841‰); shows karat, per-mille badge and `%` |
| RATE | input | PKR per tola |
| AMOUNT | calculated | `PureGold_g / gramsPerTola × Rate` (example: 24.437 g at 116,500 → ≈ 262,944 in the recording) **(verify rounding)** |

Bottom: `SAVE (F8)`, `PRINT (P)`, `ZERO (F4)`. Right: unit toggles as in the main form. Saving stores a **Tehleel record** linked to an optional customer.

### 6.4 Gold Mixing — Mixing Mail / Cutting Mail (`/mixing`)
Title "GOLD MIXING". Launch from `M` chooser dialog (Mixing PAT = `M`, Mixing CUT = `K`, Carat Changer = `C`).

**Main grid** (TOLA · MASHA · RATTI · GRAMS):
| Row | Notes |
|---|---|
| WEIGHT | Input |
| PASSA | Input (orange highlight) |
| PAT PER TOLA | Input (blue). Example in recording: 12 ratti ≈ 1.458 g |
| MAIL +++ | Calculated alloy quantity |
| TOTAL WT | Calculated |

**Right-hand side of the grid:** mode label showing "INNER MAIL" or "OUTER MAIL" (toggle keys I / O).

**Alloy panel (bottom, with a gold-bar image on the left):** small table with columns **RATIO %** · TOLA · MASHA · RATTI · GRAMS · MANUAL %. Rows: **SILVER**, **COPPER**, **CADMIUM**. Ratio % fields are editable and must sum to 100% (show a validation hint). Buttons: `Mixing` / `Cutting` (toggle, mutually exclusive), `Inner Mail` / `Outer Mail` (toggle).

Footer: `Back` (Esc), `WEIGHT: Auto=F7 · Grams=G · Tolas=W`, `ZERO (F4)`.

### 6.5 Carat Changer (`/carat-changer`)
Title "CARAT CHANGER". Grid:
| Row | Notes |
|---|---|
| WEIGHT | Input |
| FROM CARAT | Numeric input (e.g. 16.5) |
| TO CARAT | Numeric input (e.g. 18) |
| PASSA | Calculated: alloy to add or remove (orange) |
| PASSA +++ | Calculated cumulative |
| TOTAL WT | Calculated new weight |

Formula not derivable from the recording **(verify)**. Footer as in 6.4.

### 6.6 Weight Calculator (F2) (`/calculator`, also a large Dialog)
- Title "CALCULATOR", Close button.
- Table "ITEM DETAILS" with **10 rows**: `WEIGHT 1` … `WEIGHT 10`. Each row: a **+/− toggle button** (add or subtract; first row shows `TOP`), then TOLA · MASHA · R-CUT (ratti cut) · RATTI · GRAMS cells.
- Footer row **TOTAL WT** (tola, masha, ratti, grams) in red tint.
- Right side: unit toggle (`Auto`, `Grams`, `Tolas`).
- Buttons: `ADD MORE` (adds 10 more rows), `CalcPrint` (print the list), Close.

### 6.7 Customers (`/customers`)
**List page:**
- Toolbar: search input (name, phone, ID, city), filter `Select` (All / Owes gold / Owes cash / Advance / Inactive), `New Customer` button.
- `DataTable` columns: ID · Name · Phone · City · Gold balance (g) · Cash balance (PKR) · Last transaction · Actions (View, Bill, Credit, Debit, Edit).
- Row click → detail page. Column visibility menu, CSV export.

**New / Edit customer** (`Sheet` or `/customers/new`):
- Fields: Customer ID (auto), Name*, Phone*, Alternate phone, CNIC (optional), Address, City, Group (Select), Opening gold balance (`WeightInput`), Opening cash balance, Credit limit (PKR and grams), SMS alerts (Switch), Notes, Active (Switch).

**Customer detail / "Customer View" (I+V)** (`/customers/[id]`):
- Header card: name, phone, `LedgerBadge`s, action buttons: New Bill (I+B), Credit + (I+C), Debit − (I+D), New Order (I+O), Send SMS, Print statement.
- `Tabs`: **Ledger** (dual table with date, ref, description, gold in/out, cash in/out, running gold, running cash), **Bills**, **Orders**, **Tehleel records**, **Notes**.
- Ledger filter: date range, type (bill / credit / debit / order).

**Credit + / Debit − dialogs (I+C, I+D):**
- Fields: Customer (prefilled), Date, Type toggle (Cash / Gold), Amount PKR or `WeightInput` (based on type), Rate (if converting gold↔cash), Reference / Purchi no., Remarks. Buttons: Save (F8), Save & Print, Cancel.

**Customer records (C on main form):** opens the customers list in a dialog with select-and-return behaviour.

### 6.8 Group Purchi Add (I+A) and Temporary Group (F4 in the Help list)
- Dialog with header fields: Date, Group name, Customer (optional).
- Editable table rows: # · Description · Weight (`WeightInput`, compact) · Cut · Rate · Amount. `Add row` (Ctrl+Enter), `Remove`.
- Totals row: total weight, total cut, total amount.
- Buttons: Save group, Save & print, Discard. Temporary group holds an unsaved group in memory until saved or cleared.

### 6.9 Bills (`/bills`)
- Toolbar: search (bill no., customer, purchi no.), date range, customer filter, type filter (Sale / Purchase / General / Group), status filter.
- `DataTable` columns: Bill no. · Date · Customer · Type · Total WT · Rate · Total price · Wasool · Balance · User · Actions (View, Print, Edit, Delete).
- Bill detail (`Sheet`): all fields as saved, ledger entries created, audit trail (created/edited by).
- Actions: Reprint, Edit (permission-gated), Delete (`ConfirmDialog`, reverses ledger and stock).
- **General Bill (Ctrl+F2):** a bill without a customer, using the same form as Billing with a "General" tag.

### 6.10 Orders (`/orders`)
- Tabs: **Customer Orders** · **Casting Orders** · **General Orders** · **Works** (Works form).
- List view = `DataTable` + a Board toggle (Kanban): columns Pending → In workshop → Ready → Delivered.
- Columns: Order no. · Date · Customer · Item/description · Weight · Karat · Due date · Advance · Status · Karigar · Actions.
- **Order view/edit (F3):** opens the selected order for edit.

**Customer Order form (I+O):**
Fields: Order no. (auto), Date, Customer*, Item description*, Design reference (image upload, optional), Weight required (`WeightInput`), Karat, Rate locked? (Switch) + locked rate, Making charges, Advance gold (`WeightInput`), Advance cash, Delivery date, Priority (Normal/Urgent), Remarks. Buttons: Save, Save & print slip, Cancel.

**Casting Order form (F5):**
Fields: Order no., Date, Karigar/Caster*, Metal (Gold/Silver), Karat, Issued weight (`WeightInput`), Expected return weight, Wastage allowed (%), Purpose/item, Due date, Remarks. Button: Issue, Mark received (opens Receive dialog: returned weight, actual wastage auto-computed).

**General Order (Ctrl+F3):** same as Customer Order without customer requirement.

**Works form (F12):**
Fields: Job no., Date, Karigar*, Order link (optional), Work type (Select: Polish, Setting, Casting, Repair, Other), Weight in / out (`WeightInput`), Labour charges, Status, Completed date, Remarks.

### 6.11 Accounts (F6) (`/accounts`)
- Tabs: **Day Book** · **Cash Book** · **Gold Book** · **Customer Balances** · **Expenses**.
- Filters: date range, customer, type.
- Day Book table: Time · Ref · Description · Gold in · Gold out · Cash in · Cash out.
- Expenses tab: add expense dialog (Date, Category, Amount, Paid to, Note).
- Footer totals row and Print / Export buttons. Day close button: locks the day's entries **(NEW)**.

### 6.12 Reports (`/reports`)
Left list of reports, right pane shows the selected one with filters and export (PDF / Excel).
- Sales report, Purchase report, Customer ledger / statement, Customer balances, Gold stock report (NEW), Daily summary, Tehleel history, Order status, Zakat summary, User activity.
- Common filter bar: date range, customer, karat, user. Buttons: Run, Print, Export.

### 6.13 Rates / Mandi (`/rates`) (F11)
- Card: current rate chips (Gold USD/oz, USD→PKR, PKR/tola 24k, PKR/gram).
- Rate history `DataTable` and small line chart (last 30 days).
- Manual entry form (see 3.3). Auto-refresh interval `Select` (Off, 1 min, 5 min, 15 min).

### 6.14 SMS (F10) (`/sms`)
- Send General SMS: Recipients (`Select`: All customers / Debtors / Group / Single), Message (`Textarea`, char count), Template `Select`, Send, Schedule.
- Log table: time, recipient, message, status.
- Settings link: SMS gateway config.

### 6.15 Settings (Ctrl+F12) (`/settings`)
`Tabs` (vertical): 
- **Shop:** Shop name, address, phone, logo upload, bill footer text.
- **Units & Rounding:** Grams per tola (default 11.664), ratti decimals, weight decimals, money rounding rule, default unit mode.
- **Rates:** default rate source, auto-refresh, default silver rate.
- **Billing:** default cut/tola, default polish/tola, default charges mode (Labour / Tola / Fix), zakat percent (2.5), allow negative weights.
- **Appearance:** theme, row tints, line show/hide, font size.
- **Printing:** default printer, template (A4, A5, thermal 80mm), copies, show logo.
- **Users & Roles:** user table, New User (Name, Username, Password, Role: Owner / Manager / Cashier, Active). Permissions matrix (view, edit bill, delete bill, view reports, edit rates, manage stock).
- **SMS:** gateway, sender ID, test button.
- **Backup:** auto-backup schedule, folder, Backup now, Restore.
- **Hotkeys:** read-only table generated from the registry (rebinding is optional).

### 6.16 Dashboard (NEW) (`/dashboard`) — default landing page
Top row of KPI `Card`s (each with value, delta vs yesterday, sparkline):
1. Today's sales (PKR)
2. Gold sold today (g)
3. Gold bought today (g)
4. Cash in hand
5. Pending orders
6. Total receivable (cash) / total gold owed by customers

Charts (shadcn Charts):
- Sales last 30 days (area/line, toggle PKR / grams).
- Gold rate history (line, 30/90 days).
- Stock by karat (bar).
- Top 10 customers by balance (horizontal bar).

Tables / widgets:
- Orders due in next 7 days (list with status badge).
- Recent bills (last 10).
- Alerts panel: low stock, customers over credit limit, backup overdue, Mandi rate stale.

Filter bar: date range preset (Today, 7d, 30d, This month, Custom).

### 6.17 Inventory (NEW) (`/inventory`)
Sidebar section with sub-pages:

**a. Overview (`/inventory`):** KPI cards (Total fine gold in stock g, Raw gold g, Finished items count, Silver g, Value at today's rate), stock-by-karat chart, low-stock alerts, recent movements.

**b. Raw Stock (`/inventory/raw`):**
- Table by metal + karat: Metal · Karat · Weight (g) · Fine weight (g) · Avg cost/tola · Value.
- Actions: Add stock (purchase), Issue to karigar, Adjust, Melt/refine (creates a new karat lot).
- **Add stock dialog:** Date, Metal, Karat, Weight (`WeightInput`), Cost rate, Supplier/Customer, Reference, Remarks.

**c. Items (`/inventory/items`):** finished jewellery.
- Toolbar: search, filters (category, karat, status: In stock / Sold / With karigar / Reserved), `New Item`, Print labels.
- `DataTable`: Photo · Tag/SKU · Name · Category · Karat · Gross wt · Net wt · Stone wt · Making charges · Location · Status.
- **Item form (`Sheet`):** Tag/SKU (auto), Barcode (auto), Name*, Category (Select: Ring, Necklace, Bangle, Earring, Chain, Set, Other), Metal, Karat, Gross weight (`WeightInput`), Stone weight, Net weight (auto), Making charges (Fixed or Per tola toggle), Stone cost, Design no., Karigar, Location/tray, Photos (multi-upload), Notes, Status.
- Item detail page with movement history and QR/barcode label preview.

**d. Movements (`/inventory/movements`):** ledger of all stock changes — Date · Type (Purchase, Sale, Issue, Receive, Adjust, Melt) · Item/Lot · Weight in/out · Balance · Ref · User.

**e. Karigar (`/inventory/karigar`):** list of craftsmen with metal balance held. Detail page shows issued vs received vs wastage. Dialogs: Issue metal (Karigar, Metal, Karat, Weight, Purpose), Receive (Weight returned, Wastage auto-calc, Labour charge).

**f. Stock-take (`/inventory/stocktake`):** start a count session, scan/enter tags, compare with system, show missing / extra, approve adjustments.

**g. Labels:** select items → choose label template (Small tag, Wide tag) → print barcode/QR.

**Billing integration:** on Billing, an optional "Add item" button opens an item picker (search by tag/scan barcode); selected items fill Weight and mark the item Sold on save.

---

## 7. Calculation rules (implement in `lib/gold-math.ts` with unit tests)

```
GRAMS_PER_TOLA = 11.664 (setting)
MASHA_PER_TOLA = 12 ; RATTI_PER_MASHA = 8
gramsPerRatti = GRAMS_PER_TOLA / 96      // 0.1215

toParts(mg)  -> { tola, masha, ratti, grams }
fromParts(...) -> mg

cutTotal   = cutPerTola * (weight / GRAMS_PER_TOLA)
polishTotal= polishPerTola * (weight / GRAMS_PER_TOLA)
totalWt    = weight - cutTotal - polishTotal
goldValue  = (totalWt / GRAMS_PER_TOLA) * goldRate
totalPrice = goldValue (+ charges rule)      // verify carat scaling & charges
zakat      = 0.025 * totalPrice
karat      = pureGold / firstWeight * 24
permille   = pureGold / firstWeight * 1000
```

Verified against the recording: 1 tola weight, cut/tola 2 masha 4 ratti (2.43 g) → total wt 9 masha 4 ratti (9.234 g); at rate 116,700 → total price 92,388. Zakat 34,950 on 1,398,000.

---

## 8. Data model (tables)

`users`, `roles`, `customers`, `bills`, `bill_lines`, `ledger_entries` (customer_id, date, type, gold_mg, cash_pkr, ref), `tehleel_records`, `mixing_records`, `carat_change_records`, `groups`, `group_lines`, `orders`, `order_events`, `karigars`, `works`, `raw_stock_lots`, `items`, `item_photos`, `stock_movements`, `stocktakes`, `stocktake_lines`, `expenses`, `rates`, `sms_log`, `settings`, `audit_log`.

---

## 9. Build order for the AI

1. Project scaffold, theme tokens, app shell, hotkey registry, Help dialog, command palette.
2. `gold-math.ts` with tests, `WeightInput`, `MoneyInput`, `KaratBadge`.
3. Billing page (6.2) end to end, including save, print and the modals.
4. Customers and dual ledger (6.7), Credit/Debit dialogs.
5. Tehleel, Mixing, Carat Changer, Calculator (6.3–6.6).
6. Bills list, reprint, edit (6.9).
7. Orders and Works (6.10), Group purchi (6.8).
8. Accounts and Reports (6.11–6.12).
9. Inventory (6.17) and the Billing integration.
10. Dashboard (6.16).
11. Rates, SMS, Settings, Users, Backup.

## 10. Items to confirm with the shop owner

- Exact formula for Impurity in Gold Karat and how the 2nd weight and cut interact.
- Exact meaning and formula of Pat, Passa and Mail (inner vs outer) in Gold Mixing.
- Carat Changer formula (example: 11.664 g from 16.5 to 18 gave Passa 8.019 g).
- How Carat and Charges affect Total Price on the main form.
- Contents of the Gold Price mini-table on the main form.
- Help-window hotkeys for the Customers, Reports, Orders and Bills tabs.
- Whether "Kacha" has a "Pakka" counterpart.
