import "./style.css";
import { ThemeManager } from "./theme/theme";
import { TabsManager } from "./tabs/tabs";
import { ChecklistManager } from "./checklist/checklist";
import { ConsumablesManager } from "./consumables/consumables";
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

    // Initialize managers
    new ThemeManager("theme-toggle", "lynx-logo");
    const tabsManager = new TabsManager(
      ".tab-btn",
      ".tab-content",
      "tab-checklist"
    );
    const shoppingManager = new ShoppingManager();

    new ChecklistManager();
    new ConsumablesManager();
    new InventoryManager();
    new SearchManager();

    // Connect 'Add to Shopping' buttons
    document.body.addEventListener("click", e => {
      const target = e.target as HTMLElement;
      if (
        target.classList.contains(
          "add-to-shopping-btn"
        )
      ) {
        const itemText = target.dataset.item;
        if (itemText) {
          shoppingManager.addToShoppingList(
            itemText
          );
          // Optional: show a confirmation toast
          console.log(
            `Added "${itemText}" to shopping list.`
          );
        }
      }
    });

    // Show/hide shopping buttons based on active tab
    const observer = new MutationObserver(() => {
      const activeTabId =
        tabsManager.getActiveTabId();
      const shoppingButtons =
        document.querySelectorAll(
          ".add-to-shopping-btn"
        );

      shoppingButtons.forEach(button => {
        (button as HTMLElement).style.display =
          activeTabId === "content-consumables"
            ? "inline-block"
            : "none";
      });
    });

    // Observe the tab container for changes
    const tabContainer =
      document.querySelector(".tabs");
    if (tabContainer) {
      observer.observe(tabContainer, {
        attributes: true,
        childList: true,
        subtree: true,
      });
    }

    console.log(
      "Lynx Apartment Dashboard initialized successfully!"
    );
  }
);
