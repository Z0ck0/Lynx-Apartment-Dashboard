// Types for checklist items
export interface ChecklistItem {
  text: string;
  priority?: "high" | "medium" | "low";
  time?: number;
  frequency?: string;
}

// Types for inventory items
export interface InventoryItem {
  text: string;
  type: "E" | "O"; // Essential or Optional
}

// Types for section groups
export interface SectionGroup {
  group: string;
  sections: string[];
}

// Types for shopping list items
export interface ShoppingItem {
  text: string;
  completed: boolean;
}

// Types for checklist sections
export type ChecklistSections = Record<
  string,
  string[]
>;
export type InventorySections = Record<
  string,
  InventoryItem[]
>;

// Types for checked state
export type CheckedState = boolean[];
