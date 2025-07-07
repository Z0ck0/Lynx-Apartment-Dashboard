import {
  InventoryGroups,
  InventorySections,
} from "../data/inventory-data";
import type {
  CheckedState,
  InventoryItem,
} from "../types";

export class InventoryManager {
  private container: HTMLElement | null;
  private inventoryFilter: "all" | "E" | "O" =
    "all";

  constructor() {
    this.container = document.getElementById(
      "inventory-sections"
    );
    this.init();
  }

  private init(): void {
    if (this.container) {
      this.renderInventoryFilterDropdown();
      this.renderInventoryAccordions();
    }
  }

  private getCheckedState(
    section: string
  ): CheckedState {
    return JSON.parse(
      localStorage.getItem(
        `checked_${section}`
      ) || "[]"
    );
  }

  private setCheckedState(
    section: string,
    arr: CheckedState
  ): void {
    localStorage.setItem(
      `checked_${section}`,
      JSON.stringify(arr)
    );
  }

  private renderInventoryFilterDropdown(): void {
    if (!this.container) return;

    let filterDiv = document.getElementById(
      "inventory-filter-div"
    );
    if (!filterDiv) {
      filterDiv = document.createElement("div");
      filterDiv.id = "inventory-filter-div";
      filterDiv.style.marginBottom = "10px";

      const select =
        document.createElement("select");
      select.innerHTML = `
        <option value="all">All Items</option>
        <option value="E">Essential</option>
        <option value="O">Optional</option>
      `;

      select.addEventListener("change", e => {
        this.inventoryFilter = (
          e.target as HTMLSelectElement
        ).value as "all" | "E" | "O";
        this.renderInventoryAccordions();
      });

      filterDiv.appendChild(select);
      this.container.prepend(filterDiv);
    }
  }

  private renderSection(
    title: string,
    items: InventoryItem[],
    sectionKey: string
  ): HTMLElement {
    const sectionDiv =
      document.createElement("div");
    sectionDiv.className = "section";

    const header = document.createElement("div");
    header.className = "section-header";
    header.innerHTML = `<label>${title}</label>`;
    sectionDiv.appendChild(header);

    const ul = document.createElement("div");
    ul.className = "checkbox-group section-items";

    let checkedArr =
      this.getCheckedState(sectionKey);
    if (
      !Array.isArray(checkedArr) ||
      checkedArr.length !== items.length
    ) {
      checkedArr = Array(items.length).fill(
        false
      );
    }

    const filteredItems = items.filter(
      item =>
        this.inventoryFilter === "all" ||
        item.type === this.inventoryFilter
    );

    filteredItems.forEach(
      (item, originalIndex) => {
        const originalItemIndex = items.findIndex(
          i =>
            i.text === item.text &&
            i.type === item.type
        );

        const label =
          document.createElement("label");
        label.style.display = "flex";
        label.style.alignItems = "center";
        label.style.justifyContent =
          "space-between";
        label.innerHTML = `<span><input type="checkbox" data-section="${sectionKey}" data-idx="${originalItemIndex}"> ${item.text} (${item.type})</span>`;

        const checkbox = label.querySelector(
          'input[type="checkbox"]'
        ) as HTMLInputElement;
        checkbox.checked =
          checkedArr[originalItemIndex];

        checkbox.addEventListener(
          "change",
          () => {
            checkedArr[originalItemIndex] =
              checkbox.checked;
            this.setCheckedState(
              sectionKey,
              checkedArr
            );
          }
        );

        ul.appendChild(label);
      }
    );

    sectionDiv.appendChild(ul);
    return sectionDiv;
  }

  private renderInventoryAccordions(): void {
    if (!this.container) return;

    // Clear everything except the filter
    const filterDiv = document.getElementById(
      "inventory-filter-div"
    );
    this.container.innerHTML = "";
    if (filterDiv) {
      this.container.appendChild(filterDiv);
    }

    InventoryGroups.forEach(groupObj => {
      const acc = document.createElement("div");
      acc.className = "accordion";

      const header =
        document.createElement("div");
      header.className = "accordion-header";
      header.innerHTML = `<span>${groupObj.group}</span>`;
      acc.appendChild(header);

      const content =
        document.createElement("div");
      content.className = "accordion-content";

      groupObj.sections.forEach(section => {
        content.appendChild(
          this.renderSection(
            section,
            InventorySections[section],
            section
          )
        );
      });

      acc.appendChild(content);
      this.container!.appendChild(acc);

      header.addEventListener("click", e => {
        if (
          (e.target as HTMLElement).tagName ===
          "INPUT"
        )
          return;
        acc.classList.toggle("active");
        content.style.display =
          content.style.display === "none"
            ? "block"
            : "none";
      });
    });
  }
}
