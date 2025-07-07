import { CleaningSections } from "../data/checklist-data";
import { ConsumablesSections } from "../data/consumables-data";
import { inventorySectionsData } from "../data/inventory-data";

export function resetApplicationState(): void {
  const confirmation = confirm(
    "Do you want to reset all progress and clear the checklist?"
  );

  if (confirmation) {
    // Clear all checklist sections from local storage
    const allSections = {
      ...CleaningSections,
      ...ConsumablesSections,
      ...inventorySectionsData,
    };

    Object.keys(allSections).forEach(
      sectionKey => {
        localStorage.removeItem(
          `checked_${sectionKey}`
        );
      }
    );

    // Clear notes and shopping list
    localStorage.removeItem("notes");
    localStorage.removeItem("shoppingList");

    // Reload the page to reflect the cleared state
    location.reload();
  }
}
