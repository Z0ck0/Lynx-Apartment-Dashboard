import './style.css'
import { ThemeManager } from './theme/theme'
import { TabsManager } from './tabs/tabs'
import { ChecklistManager } from './checklist/checklist'
import { InventoryManager } from './inventory/inventory'
import { SearchManager } from './search/search'
import { ShoppingManager } from './shopping/shopping'

// Initialize all modules
document.addEventListener('DOMContentLoaded', () => {
  // Initialize theme management
  const themeManager = new ThemeManager('theme-toggle', 'lynx-logo')
  
  // Initialize tab navigation
  const tabsManager = new TabsManager('.tab-btn', '.tab-content', 'tab-checklist')
  
  // Initialize other managers (to be implemented)
  const checklistManager = new ChecklistManager()
  const inventoryManager = new InventoryManager()
  const searchManager = new SearchManager()
  const shoppingManager = new ShoppingManager()
  
  console.log('Lynx Apartment Dashboard initialized successfully!')
})
