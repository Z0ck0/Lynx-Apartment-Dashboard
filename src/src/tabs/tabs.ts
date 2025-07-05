export class TabsManager {
  private tabBtns: NodeListOf<HTMLButtonElement>;
  private tabContents: NodeListOf<HTMLElement>;
  private activeTab: string;
  constructor(
    tabBtnSelector: string,
    tabContentSelector: string,
    defaultTabId: string
  ) {
    this.tabBtns = document.querySelectorAll(
      tabBtnSelector
    );
    this.tabContents = document.querySelectorAll(
      tabContentSelector
    );
    this.activeTab = defaultTabId;
    this.init();
  }
  private init() {
    this.tabBtns.forEach((btn, idx) => {
      btn.addEventListener("click", () => {
        this.tabBtns.forEach(b =>
          b.classList.remove("active")
        );
        this.tabContents.forEach(c =>
          c.classList.remove("active")
        );
        btn.classList.add("active");
        
        // Safety check to ensure tab content exists at this index
        if (this.tabContents[idx]) {
          this.tabContents[idx].classList.add(
            "active"
          );
        } else {
          console.warn(
            `Tab content at index ${idx} does not exist. Please check DOM structure.`
          );
        }
        
        this.activeTab = btn.id;
        btn.setAttribute("aria-selected", "true");
        btn.setAttribute("tabindex", "0");
        this.tabBtns.forEach((b, i) => {
          if (i !== idx) {
            b.setAttribute(
              "aria-selected",
              "false"
            );
            b.setAttribute("tabindex", "-1");
          }
        });
      });
    });
  }
  public getActiveTab(): string {
    return this.activeTab;
  }
}
