export class ThemeManager {
  private themeToggle: HTMLElement | null;
  private logoImg: HTMLImageElement | null;
  constructor(themeToggleId: string, logoImgId: string) {
    this.themeToggle = document.getElementById(themeToggleId);
    this.logoImg = document.getElementById(logoImgId) as HTMLImageElement;
    this.init();
  }
  private setTheme(dark: boolean) {
    if (dark) {
      document.body.classList.add('dark-mode');
      if (this.themeToggle) this.themeToggle.textContent = '☀️';
      if (this.logoImg) this.logoImg.src = '/logo-lynx-dark.png';
      localStorage.setItem('lynx-theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      if (this.themeToggle) this.themeToggle.textContent = '🌙';
      if (this.logoImg) this.logoImg.src = '/logo-lynx.png';
      localStorage.setItem('lynx-theme', 'light');
    }
  }
  private init() {
    if (!this.themeToggle) return;
    this.themeToggle.addEventListener('click', () => {
      this.setTheme(!document.body.classList.contains('dark-mode'));
    });
    const saved = localStorage.getItem('lynx-theme');
    this.setTheme(saved === 'dark');
  }
} 