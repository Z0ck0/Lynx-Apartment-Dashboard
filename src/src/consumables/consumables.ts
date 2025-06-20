import {
  ConsumablesGroups,
  ConsumablesSections,
} from "../data/consumables-data";
import type { CheckedState } from "../types";

export class ConsumablesManager {
  private container: HTMLElement | null;

  constructor() {
    this.container = document.getElementById(
      "consumables-sections"
    );
    this.init();
  }

  private init(): void {
    if (this.container) {
      this.renderConsumablesAccordions();
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

  private renderSectionWithProgress(
    title: string,
    items: string[],
    sectionKey: string,
    onProgressChange?: () => void
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

    items.forEach((item, idx) => {
      const label =
        document.createElement("label");
      label.style.display = "flex";
      label.style.alignItems = "center";
      label.style.justifyContent =
        "space-between";

      label.innerHTML = `<span><input type="checkbox" data-section="${sectionKey}" data-idx="${idx}"> ${item}</span>
                         <button class="add-to-shopping-btn" data-item="${item}">🛒</button>`;

      const checkbox = label.querySelector(
        'input[type="checkbox"]'
      ) as HTMLInputElement;
      checkbox.checked = checkedArr[idx];

      checkbox.addEventListener("change", () => {
        checkedArr[idx] = checkbox.checked;
        this.setCheckedState(
          sectionKey,
          checkedArr
        );
        if (onProgressChange) {
          onProgressChange();
        }
      });

      ul.appendChild(label);
    });

    sectionDiv.appendChild(ul);

    header.addEventListener("click", e => {
      if (
        (e.target as HTMLElement).tagName ===
        "INPUT"
      )
        return;
      ul.style.display =
        ul.style.display === "none"
          ? "block"
          : "none";
    });

    return sectionDiv;
  }

  private renderConsumablesAccordions(): void {
    if (!this.container) return;

    this.container.innerHTML = "";

    ConsumablesGroups.forEach(groupObj => {
      const acc = document.createElement("div");
      acc.className = "accordion";

      const header =
        document.createElement("div");
      header.className = "accordion-header";

      let totalItems = 0;
      let completedItems = 0;

      groupObj.sections.forEach(section => {
        const items =
          ConsumablesSections[section];
        totalItems += items.length;
        const checkedArr =
          this.getCheckedState(section);
        if (Array.isArray(checkedArr)) {
          completedItems +=
            checkedArr.filter(Boolean).length;
        }
      });

      header.innerHTML = `
        <span>${groupObj.group}</span>
        <span class="section-stats">${completedItems}/${totalItems} завршено</span>
      `;
      acc.appendChild(header);

      const content =
        document.createElement("div");
      content.className = "accordion-content";

      groupObj.sections.forEach(section => {
        content.appendChild(
          this.renderSectionWithProgress(
            section,
            ConsumablesSections[section],
            section,
            () => {
              let newTotal = 0;
              let newCompleted = 0;
              groupObj.sections.forEach(s => {
                const items =
                  ConsumablesSections[s];
                newTotal += items.length;
                const checkedArr =
                  this.getCheckedState(s);
                if (Array.isArray(checkedArr)) {
                  newCompleted +=
                    checkedArr.filter(
                      Boolean
                    ).length;
                }
              });
              const statsElement =
                header.querySelector(
                  ".section-stats"
                );
              if (statsElement) {
                statsElement.textContent = `${newCompleted}/${newTotal} завршено`;
              }
            }
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
