import {
  CleaningGroups,
  CleaningSections,
} from "../data/checklist-data";
import { CheckedState } from "../types";

export class ChecklistManager {
  private container: HTMLElement | null;

  constructor() {
    this.container = document.getElementById(
      "checklist-sections"
    );
    this.init();
  }

  private init(): void {
    if (this.container) {
      this.renderCleaningAccordions();
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

    // Section header
    const header = document.createElement("div");
    header.className = "section-header";
    header.innerHTML = `<label>${title}</label>`;
    sectionDiv.appendChild(header);

    // Items list
    const ul = document.createElement("div");
    ul.className = "checkbox-group section-items";

    // Load checked state from localStorage
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

      label.innerHTML = `<span><input type="checkbox" data-section="${sectionKey}" data-idx="${idx}"> ${item}</span>`;

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

    // Make header clickable for collapse/expand
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

  private renderCleaningAccordions(): void {
    if (!this.container) return;

    this.container.innerHTML = "";

    // Add collapse/expand all button
    const controlsDiv =
      document.createElement("div");
    controlsDiv.className = "section-controls";
    controlsDiv.innerHTML = `
      <button class="view-all-btn" id="expand-all">Expand All</button>
      <button class="view-all-btn" id="collapse-all">Collapse All</button>
    `;
    this.container.appendChild(controlsDiv);

    // Add event listeners for expand/collapse all
    const expandAllBtn =
      document.getElementById("expand-all");
    const collapseAllBtn =
      document.getElementById("collapse-all");

    if (expandAllBtn) {
      expandAllBtn.addEventListener("click", () =>
        this.toggleAllSections(true)
      );
    }
    if (collapseAllBtn) {
      collapseAllBtn.addEventListener(
        "click",
        () => this.toggleAllSections(false)
      );
    }

    CleaningGroups.forEach(groupObj => {
      const acc = document.createElement("div");
      acc.className = "accordion";

      const header =
        document.createElement("div");
      header.className = "accordion-header";

      // Calculate total items and completed items for this group
      let totalItems = 0;
      let completedItems = 0;

      groupObj.sections.forEach(section => {
        const items = CleaningSections[section];
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
            CleaningSections[section],
            section,
            () => {
              // Update group progress when any item changes
              let newTotal = 0;
              let newCompleted = 0;
              groupObj.sections.forEach(s => {
                const items = CleaningSections[s];
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

      // Accordion toggle
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

  private toggleAllSections(
    expand: boolean
  ): void {
    document
      .querySelectorAll(".accordion-content")
      .forEach(content => {
        content.style.display = expand
          ? "block"
          : "none";
      });
    document
      .querySelectorAll(".accordion")
      .forEach(acc => {
        acc.classList.toggle("active", expand);
      });
  }

  public refresh(): void {
    this.renderCleaningAccordions();
  }
}
