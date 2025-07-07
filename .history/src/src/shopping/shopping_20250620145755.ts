import type { ShoppingItem } from "../types";

export class ShoppingManager {
  private shoppingList: ShoppingItem[] = [];
  private container: HTMLElement | null;
  private addButton: HTMLElement | null;
  private dragSrcIndex: number | null = null;

  constructor() {
    this.container = document.getElementById(
      "shopping-list"
    );
    this.addButton = document.getElementById(
      "add-shopping-item"
    );
    this.init();
  }

  private init(): void {
    this.loadShoppingList();
    this.renderShoppingList();

    if (this.addButton) {
      this.addButton.addEventListener(
        "click",
        () => this.addShoppingItem()
      );
    }

    // Use event delegation for delete buttons
    this.container?.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.closest('.delete-item-btn')) {
        const itemIndex = target.closest('li')?.dataset.index;
        if (itemIndex) {
          this.deleteShoppingItem(parseInt(itemIndex, 10));
        }
      }
    });
  }

  private loadShoppingList(): void {
    const saved = localStorage.getItem(
      "shoppingList"
    );
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.shoppingList = Array.isArray(parsed)
          ? parsed
          : [];
      } catch {
        this.shoppingList = [];
      }
    }
  }

  private saveShoppingList(): void {
    localStorage.setItem(
      "shoppingList",
      JSON.stringify(this.shoppingList)
    );
  }

  private renderShoppingList(): void {
    if (!this.container) return;

    this.container.innerHTML = "";

    this.shoppingList.forEach((item, idx) => {
      const li = document.createElement("li");
      li.setAttribute("draggable", "true");
      li.setAttribute(
        "data-index",
        idx.toString()
      );
      li.style.display = "flex";
      li.style.alignItems = "center";
      li.style.justifyContent = "space-between";
      li.style.padding = "4px 0";

      // Drag and drop event handlers
      li.addEventListener("dragstart", e => {
        this.dragSrcIndex = idx;
        e.dataTransfer!.effectAllowed = "move";
        li.style.opacity = "0.5";
      });

      li.addEventListener("dragend", () => {
        li.style.opacity = "";
      });

      li.addEventListener("dragover", e => {
        e.preventDefault();
      });

      li.addEventListener("drop", e => {
        e.preventDefault();
        if (
          this.dragSrcIndex !== null &&
          this.dragSrcIndex !== idx
        ) {
          const moved = this.shoppingList.splice(
            this.dragSrcIndex,
            1
          )[0];
          this.shoppingList.splice(idx, 0, moved);
          this.saveShoppingList();
          this.renderShoppingList();
        }
        this.dragSrcIndex = null;
      });

      li.innerHTML = `
        <span class="shopping-item-text">
          <input type="checkbox" ${
            item.completed ? "checked" : ""
          }> ${item.text}
        </span>
        <button class="delete-item-btn" style="background: none; border: none; cursor: pointer; font-size: 16px;">🗑️</button>
      `;

      const checkbox = li.querySelector(
        'input[type="checkbox"]'
      ) as HTMLInputElement;
      checkbox.addEventListener("change", () => {
        item.completed = checkbox.checked;
        this.saveShoppingList();
      });

      this.container!.appendChild(li);
    });
  }

  private addShoppingItem(): void {
    const itemText = prompt("Enter shopping item:");
    if (itemText && itemText.trim() !== "") {
      this.shoppingList.push({
        text: itemText.trim(),
        completed: false,
      });
      this.saveShoppingList();
      this.renderShoppingList();
    }
  }

  private deleteShoppingItem(index: number): void {
    this.shoppingList.splice(index, 1);
    this.saveShoppingList();
    this.renderShoppingList();
  }

  public addToShoppingList(
    itemText: string
  ): void {
    // Avoid adding duplicates
    if (this.shoppingList.some(item => item.text === itemText)) {
      showToast(`"${itemText}" is already on the list.`);
      return;
    }
    this.shoppingList.push({
      text: itemText,
      completed: false,
    });
    this.saveShoppingList();
    this.renderShoppingList();
    showToast(`Added "${itemText}" to shopping list.`);
  }

  public refresh(): void {
    this.loadShoppingList();
    this.renderShoppingList();
  }
}

// Helper function to be used in addToShoppingList
declare function showToast(message: string): void;
