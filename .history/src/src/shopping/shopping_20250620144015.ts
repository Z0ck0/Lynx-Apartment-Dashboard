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
        li.style.background = "#e6f7ff";
      });

      li.addEventListener("dragleave", () => {
        li.style.background = "";
      });

      li.addEventListener("drop", e => {
        e.preventDefault();
        li.style.background = "";
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

      li.innerHTML = `<span><input type="checkbox" ${
        item.completed ? "checked" : ""
      }> ${item.text}</span>`;

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
    const item = prompt("Enter shopping item:");
    if (item && item.trim() !== "") {
      this.shoppingList.push({
        text: item.trim(),
        completed: false,
      });
      this.saveShoppingList();
      this.renderShoppingList();
    }
  }

  public addToShoppingList(
    itemText: string
  ): void {
    this.shoppingList.push({
      text: itemText,
      completed: false,
    });
    this.saveShoppingList();
    this.renderShoppingList();
  }

  public refresh(): void {
    this.loadShoppingList();
    this.renderShoppingList();
  }
}
