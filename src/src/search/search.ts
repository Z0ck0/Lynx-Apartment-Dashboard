export class SearchManager {
  private searchInput: HTMLInputElement | null;

  constructor() {
    this.searchInput = document.getElementById(
      "search-input"
    ) as HTMLInputElement;
    this.init();
  }

  private init(): void {
    if (this.searchInput) {
      this.searchInput.addEventListener(
        "input",
        e => {
          const val = (
            e.target as HTMLInputElement
          ).value.toLowerCase();
          this.filterItems(val);
        }
      );
    }
  }

  private filterItems(searchValue: string): void {
    document
      .querySelectorAll(".section-items label")
      .forEach(label => {
        const text =
          label.textContent?.toLowerCase() || "";
        const shouldShow =
          text.includes(searchValue);
        (label as HTMLElement).style.display =
          shouldShow ? "flex" : "none";
      });
  }

  public clearSearch(): void {
    if (this.searchInput) {
      this.searchInput.value = "";
      this.filterItems("");
    }
  }
}
