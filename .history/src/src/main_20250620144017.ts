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

    // Initialize all managers (they handle their own initialization)
    new ThemeManager("theme-toggle", "lynx-logo");
    new TabsManager(
      ".tab-btn",
      ".tab-content",
      "tab-checklist"
    );
    new ChecklistManager();
    new InventoryManager();
    new SearchManager();
    new ShoppingManager();

    console.log(
      "Lynx Apartment Dashboard initialized successfully!"
    );
  }
);
