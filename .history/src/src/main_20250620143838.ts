import "./style.css";
import { ThemeManager } from "./theme/theme";
import { TabsManager } from "./tabs/tabs";
import { ChecklistManager } from "./checklist/checklist";
import { InventoryManager } from "./inventory/inventory";
import { SearchManager } from "./search/search";
import { ShoppingManager } from "./shopping/shopping";
import { DateUtils } from "./utils/date-utils";

// Initialize all modules
document.addEventListener(
  "DOMContentLoaded",
  () => {
    // Initialize date dropdown and notes
    DateUtils.populateDateDropdown();
    DateUtils.initNotes();

    // Initialize theme management
    const _themeManager = new ThemeManager(
      "theme-toggle",
      "lynx-logo"
    );

    // Initialize tab navigation
    const _tabsManager = new TabsManager(
      ".tab-btn",
      ".tab-content",
      "tab-checklist"
    );

    // Initialize other managers
    const _checklistManager =
      new ChecklistManager();
    const _inventoryManager =
      new InventoryManager();
    const _searchManager = new SearchManager();
    const _shoppingManager =
      new ShoppingManager();

    console.log(
      "Lynx Apartment Dashboard initialized successfully!"
    );
  }
);
