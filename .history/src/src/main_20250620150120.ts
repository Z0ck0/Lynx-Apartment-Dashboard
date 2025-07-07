import "./style.css";
import { ThemeManager } from "./theme/theme";
import { TabsManager } from "./tabs/tabs";
import { ChecklistManager } from "./checklist/checklist";
import { ConsumablesManager } from "./consumables/consumables";
import { InventoryManager } from "./inventory/inventory";
import { SearchManager } from "./search/search";
import { ShoppingManager } from "./shopping/shopping";
import { DateUtils } from "./utils/date-utils";
import { PdfGenerator } from "./utils/pdf-generator";
import { showToast } from "./utils/toast";

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
          showToast(
            "Успешно додадено во Шопинг листа"
          );
        }
      }
    });

    // Connect 'Save Checklist' button
    const saveButton = document.getElementById(
      "save-checklist-global"
    );
    if (saveButton) {
      saveButton.addEventListener("click", () => {
        PdfGenerator.generateChecklistPdf();
      });
    }

    // Show/hide shopping buttons based on active tab
    const observer = new MutationObserver(() => {
      const activeTabId =
        tabsManager.getActiveTab();
      const shoppingButtons =
        document.querySelectorAll(
          ".add-to-shopping-btn"
        );

      shoppingButtons.forEach(button => {
        (button as HTMLElement).style.display =
          activeTabId === "tab-consumables"
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
