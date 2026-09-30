export interface HotkeyItem {
  id: string
  keys: string
  label: string
  group: 'letter' | 'function' | 'combination' | 'action'
  tab: 'main' | 'tehleel' | 'mixing' | 'customers' | 'reports' | 'orders' | 'bills'
  description?: string
  action?: string
}

export const HOTKEYS: HotkeyItem[] = [
  // Main Window - Letters
  { id: 'amt_gold', keys: 'A', label: 'Amount to Gold', group: 'letter', tab: 'main', description: 'Enter an amount, get the gold weight' },
  { id: 'back_color', keys: 'B', label: 'Back colour', group: 'letter', tab: 'main', description: 'Open background tint popover' },
  { id: 'customer_records', keys: 'C', label: 'Customer records', group: 'letter', tab: 'main', description: 'Open customer selector and ledger' },
  { id: 'fix_carat', keys: 'F', label: 'Fix carat', group: 'letter', tab: 'main', description: 'Quick carat/purity setter' },
  { id: 'grams_mode', keys: 'G', label: 'Grams mode', group: 'letter', tab: 'main', description: 'Switch weight inputs to Grams unit' },
  { id: 'customer_select', keys: 'I', label: 'Customer selection', group: 'letter', tab: 'main', description: 'Select customer from database' },
  { id: 'carat_panel', keys: 'K', label: 'Carat', group: 'letter', tab: 'main', description: 'Open purity / carat panel' },
  { id: 'line_toggle', keys: 'L', label: 'Line show / hide', group: 'letter', tab: 'main', description: 'Toggle line separators' },
  { id: 'mixing_menu', keys: 'M', label: 'Mixing / Carat menu', group: 'letter', tab: 'main', description: 'Mixing Mail & Carat Changer chooser' },
  { id: 'front_color', keys: 'N', label: 'Front colour', group: 'letter', tab: 'main', description: 'Open foreground tint popover' },
  { id: 'print_bill', keys: 'P', label: 'Print', group: 'letter', tab: 'main', description: 'Open Print Preview dialog' },
  { id: 'input_rate', keys: 'R', label: 'Input rate', group: 'letter', tab: 'main', description: 'Focus Gold Rate input' },
  { id: 'search_purchi', keys: 'S', label: 'Search purchi / bill', group: 'letter', tab: 'main', description: 'Search past bills and slips' },
  { id: 'cycle_charges', keys: 'T', label: 'Cycle Labour mode', group: 'letter', tab: 'main', description: 'Cycle Labour / Tola / Fix charge mode' },
  { id: 'tola_mode', keys: 'W', label: 'Tola mode', group: 'letter', tab: 'main', description: 'Switch weight inputs to Tola unit' },
  { id: 'zakat_popup', keys: 'Z', label: 'Zakat popup', group: 'letter', tab: 'main', description: 'Show 2.5% Zakat calculation' },
  { id: 'exit_app', keys: 'X', label: 'Exit / Close', group: 'letter', tab: 'main', description: 'Close current window or modal' },

  // Main Window - Function Keys
  { id: 'help_f1', keys: 'F1', label: 'Help Dialog', group: 'function', tab: 'main', description: 'Open full system Help and hotkeys' },
  { id: 'calc_f2', keys: 'F2', label: 'Calculator', group: 'function', tab: 'main', description: 'Open 10-row Weight Calculator' },
  { id: 'order_f3', keys: 'F3', label: 'Order view / edit', group: 'function', tab: 'main', description: 'View or edit selected order' },
  { id: 'zero_f4', keys: 'F4', label: 'Zero (clear form)', group: 'function', tab: 'main', description: 'Reset billing form to initial state' },
  { id: 'casting_f5', keys: 'F5', label: 'Casting order', group: 'function', tab: 'main', description: 'Open Casting order creation' },
  { id: 'accounts_f6', keys: 'F6', label: 'Accounts', group: 'function', tab: 'main', description: 'Open Day Book and Accounts' },
  { id: 'auto_f7', keys: 'F7', label: 'Auto Unit / Refresh', group: 'function', tab: 'main', description: 'Set Auto unit mode' },
  { id: 'save_f8', keys: 'F8', label: 'Save only', group: 'function', tab: 'main', description: 'Save current bill / record' },
  { id: 'gold_silver_f9', keys: 'F9', label: 'Gold / Silver switch', group: 'function', tab: 'main', description: 'Toggle between Gold and Silver mode' },
  { id: 'sms_f10', keys: 'F10', label: 'General SMS', group: 'function', tab: 'main', description: 'Send SMS alerts to customers' },
  { id: 'mandi_f11', keys: 'F11', label: 'Refresh Mandi', group: 'function', tab: 'main', description: 'Fetch live rates or edit Mandi' },
  { id: 'works_f12', keys: 'F12', label: 'Works form', group: 'function', tab: 'main', description: 'Workshop craftsman job form' },

  // Combinations
  { id: 'percent_cut', keys: 'Shift+5', label: 'Percent cut (%)', group: 'combination', tab: 'main', description: 'Apply percentage deduction to weight' },
  { id: 'settings_ctrl_f12', keys: 'Ctrl+F12', label: 'Settings', group: 'combination', tab: 'main', description: 'Open Shop and System Settings' },
  { id: 'per_gram_rate', keys: 'Ctrl+G', label: 'Per-gram rate', group: 'combination', tab: 'main', description: 'Convert per-gram to per-tola rate' },
  { id: 'gen_bill', keys: 'Ctrl+F2', label: 'General bill', group: 'combination', tab: 'main', description: 'Create walk-in general bill' },
  { id: 'gen_order', keys: 'Ctrl+F3', label: 'General order', group: 'combination', tab: 'main', description: 'Create non-customer order' },
  { id: 'switch_user', keys: 'Ctrl+U', label: 'User login / Switch', group: 'combination', tab: 'main', description: 'Switch operator profile' },
  { id: 'cmd_palette', keys: 'Ctrl+K', label: 'Command Palette', group: 'combination', tab: 'main', description: 'Quick search pages and commands' },

  // Karat / Tehleel
  { id: 'open_tehleel', keys: 'K then T', label: 'Open Tehleel', group: 'combination', tab: 'tehleel', description: 'Open Gold Karat test' },
  { id: 'tehleel_copper', keys: 'C', label: 'Copper / Gold', group: 'letter', tab: 'tehleel', description: 'Set alloy test to Copper base' },
  { id: 'tehleel_silver', keys: 'S', label: 'Silver / Gold', group: 'letter', tab: 'tehleel', description: 'Set alloy test to Silver base' },
  { id: 'tehleel_mix', keys: 'M', label: 'Mix Gold', group: 'letter', tab: 'tehleel', description: 'Set alloy test to Mix Gold' },
  { id: 'tehleel_tezabi', keys: 'U', label: 'Tezabi Gold', group: 'letter', tab: 'tehleel', description: 'Acid-refined Gold assay' },
  { id: 'tehleel_chandi', keys: 'Y', label: 'Chandi (Silver)', group: 'letter', tab: 'tehleel', description: 'Silver assay test' },

  // Pat / Carat Changer
  { id: 'mix_mail', keys: 'M then M', label: 'Mixing mail', group: 'combination', tab: 'mixing', description: 'Open mixing alloy calculator' },
  { id: 'carat_changer', keys: 'M then C', label: 'Carat changer', group: 'combination', tab: 'mixing', description: 'Convert between different karats' },
  { id: 'cut_mail', keys: 'M then K', label: 'Cutting mail', group: 'combination', tab: 'mixing', description: 'Calculate alloy deductions' },
  { id: 'inner_pat', keys: 'I', label: 'Inner pat', group: 'letter', tab: 'mixing', description: 'Toggle Inner Mail calculation' },
  { id: 'outer_pat', keys: 'O', label: 'Outer pat', group: 'letter', tab: 'mixing', description: 'Toggle Outer Mail calculation' },

  // Customers
  { id: 'cust_purchi', keys: 'I then A', label: 'Group purchi add', group: 'combination', tab: 'customers', description: 'Add multi-item group slip' },
  { id: 'cust_bill', keys: 'I then B', label: 'Customer bill', group: 'combination', tab: 'customers', description: 'Create bill for active customer' },
  { id: 'cust_credit', keys: 'I then C', label: 'Customer credit (+)', group: 'combination', tab: 'customers', description: 'Add cash or gold credit to customer' },
  { id: 'cust_debit', keys: 'I then D', label: 'Customer debit (−)', group: 'combination', tab: 'customers', description: 'Debit cash or gold from customer' },
  { id: 'cust_order', keys: 'I then O', label: 'Customer order', group: 'combination', tab: 'customers', description: 'Place jewellery custom order' },
  { id: 'cust_view', keys: 'I then V', label: 'Customer view', group: 'combination', tab: 'customers', description: 'Open customer ledger statement' },

  // Reports
  { id: 'rep_sales', keys: 'Alt+S', label: 'Sales Report', group: 'combination', tab: 'reports', description: 'Daily and periodic sales' },
  { id: 'rep_ledger', keys: 'Alt+L', label: 'Customer Statement', group: 'combination', tab: 'reports', description: 'Detailed dual-currency ledger' },
  { id: 'rep_daily', keys: 'Alt+D', label: 'Daily Summary', group: 'combination', tab: 'reports', description: 'Summary of all cash and gold flows' },

  // Orders
  { id: 'ord_pending', keys: 'Alt+O', label: 'Pending Orders', group: 'combination', tab: 'orders', description: 'View workshop queue' },
  { id: 'ord_casting', keys: 'Alt+C', label: 'Casting List', group: 'combination', tab: 'orders', description: 'View casting issues and returns' },

  // Bills
  { id: 'bills_all', keys: 'Alt+B', label: 'Bills Register', group: 'combination', tab: 'bills', description: 'Browse all past transactions' },
]
