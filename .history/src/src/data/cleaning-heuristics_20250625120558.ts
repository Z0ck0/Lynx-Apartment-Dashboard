import type { ChecklistItem } from "../types";

// Cleaning Heuristics - Systematic approach to ensure nothing is forgotten

export interface CleaningHeuristic {
  name: string;
  description: string;
  checklist: string[];
  tips: string[];
  priority: "critical" | "high" | "medium" | "low";
}

export const CleaningHeuristics: CleaningHeuristic[] = [
  {
    name: "Top-to-Bottom Rule",
    description: "Always clean from top to bottom to avoid re-contamination",
    checklist: [
      "Start with ceilings and light fixtures",
      "Clean walls and windows",
      "Clean furniture surfaces",
      "Clean floors last"
    ],
    tips: [
      "Dust falls downward, so this prevents re-cleaning",
      "Use a systematic approach: left to right, top to bottom",
      "Don't forget to clean above eye level"
    ],
    priority: "critical"
  },
  {
    name: "Inside-to-Outside Rule",
    description: "Clean interior spaces before exterior areas",
    checklist: [
      "Clean all interior rooms first",
      "Clean hallways and common areas",
      "Clean balconies and terraces last",
      "Clean entrance areas after interior"
    ],
    tips: [
      "Prevents tracking dirt back inside",
      "Focus on guest-visible areas first",
      "Exterior cleaning can be weather-dependent"
    ],
    priority: "high"
  },
  {
    name: "Five Senses Check",
    description: "Use all five senses to ensure thorough cleaning",
    checklist: [
      "Sight: Check for visible dirt, stains, and damage",
      "Touch: Feel surfaces for stickiness or roughness",
      "Smell: Detect odors, mold, or cleaning product residue",
      "Hearing: Listen for unusual sounds from appliances",
      "Taste: Not applicable for cleaning (safety first)"
    ],
    tips: [
      "Run your hand over surfaces to detect missed spots",
      "Use natural light to spot missed areas",
      "Check corners and edges where dirt accumulates"
    ],
    priority: "high"
  },
  {
    name: "Guest Perspective Method",
    description: "View each room as a guest would see it",
    checklist: [
      "Enter each room as a guest would",
      "Check what's immediately visible",
      "Test all guest-accessible features",
      "Verify comfort and functionality",
      "Ensure nothing looks neglected"
    ],
    tips: [
      "Sit on furniture to test comfort",
      "Open drawers and cabinets guests might use",
      "Test all light switches and outlets",
      "Check temperature and air quality"
    ],
    priority: "critical"
  },
  {
    name: "Functionality Test",
    description: "Test all appliances and systems after cleaning",
    checklist: [
      "Test all electrical appliances",
      "Check water pressure and temperature",
      "Verify heating/cooling systems",
      "Test door locks and security features",
      "Check WiFi and entertainment systems"
    ],
    tips: [
      "Turn appliances on briefly to ensure they work",
      "Check for error messages or warning lights",
      "Verify remote controls have working batteries",
      "Test all modes of multi-function appliances"
    ],
    priority: "high"
  },
  {
    name: "Hidden Areas Protocol",
    description: "Systematically check areas that are easily overlooked",
    checklist: [
      "Behind and under furniture",
      "Inside drawers and cabinets",
      "Under rugs and mats",
      "Behind appliances",
      "Inside closets and storage areas",
      "Under beds and sofas",
      "Behind curtains and blinds"
    ],
    tips: [
      "Use a flashlight to check dark areas",
      "Move furniture to clean underneath",
      "Check for lost items or damage",
      "Look for signs of pests or moisture"
    ],
    priority: "medium"
  },
  {
    name: "Supply Verification",
    description: "Ensure all necessary supplies are stocked and accessible",
    checklist: [
      "Toilet paper and tissues",
      "Soap and cleaning supplies",
      "Towels and linens",
      "Kitchen essentials",
      "Emergency supplies",
      "Guest information materials"
    ],
    tips: [
      "Check expiration dates on consumables",
      "Ensure supplies are easily accessible to guests",
      "Keep backup supplies in storage",
      "Update guest information as needed"
    ],
    priority: "high"
  },
  {
    name: "Safety and Security Check",
    description: "Verify all safety and security measures are in place",
    checklist: [
      "Check smoke detectors and fire extinguishers",
      "Verify emergency exit routes",
      "Test door locks and security systems",
      "Check for trip hazards",
      "Verify electrical safety",
      "Check for water leaks or damage"
    ],
    tips: [
      "Test smoke detectors monthly",
      "Keep emergency contact information visible",
      "Ensure first aid kit is stocked",
      "Check for loose handrails or steps"
    ],
    priority: "critical"
  },
  {
    name: "Seasonal Considerations",
    description: "Adjust cleaning based on season and weather",
    checklist: [
      "Check heating/cooling systems",
      "Inspect for weather damage",
      "Adjust ventilation as needed",
      "Check for seasonal pests",
      "Verify weather-appropriate supplies"
    ],
    tips: [
      "Winter: Check for drafts and heating efficiency",
      "Summer: Ensure AC works and check for mold",
      "Rainy season: Check for leaks and drainage",
      "Dry season: Check for dust accumulation"
    ],
    priority: "medium"
  },
  {
    name: "Quality Assurance Walkthrough",
    description: "Final comprehensive check before considering cleaning complete",
    checklist: [
      "Walk through entire property systematically",
      "Check each room against cleaning checklist",
      "Verify all tasks are completed",
      "Test all guest amenities",
      "Ensure property is guest-ready",
      "Document any issues found"
    ],
    tips: [
      "Take photos of any damage or issues",
      "Note any maintenance needs",
      "Verify all lights are working",
      "Check that property smells fresh and clean"
    ],
    priority: "critical"
  }
];

// Quick reference heuristics for different scenarios
export const QuickHeuristics = {
  "Quick Turnover": [
    "Focus on guest-visible areas first",
    "Prioritize bathroom and kitchen",
    "Change all linens and towels",
    "Quick vacuum and dust",
    "Check essential supplies"
  ],
  "Deep Clean": [
    "Follow top-to-bottom rule strictly",
    "Move all furniture",
    "Clean inside all appliances",
    "Check all hidden areas",
    "Test all systems thoroughly"
  ],
  "Pre-Guest Arrival": [
    "Guest perspective walkthrough",
    "Test all amenities",
    "Verify all supplies",
    "Check for any damage",
    "Ensure everything works perfectly"
  ],
  "Post-Guest Departure": [
    "Check for forgotten items",
    "Inspect for any damage",
    "Deep clean high-touch areas",
    "Restock all supplies",
    "Reset everything to standard"
  ]
};

// Memory aids for common oversights
export const CommonOversights = {
  "Kitchen": [
    "Inside microwave",
    "Under refrigerator",
    "Inside dishwasher",
    "Coffee machine water tank",
    "Spice containers",
    "Under sink area"
  ],
  "Bathroom": [
    "Behind toilet",
    "Inside medicine cabinet",
    "Shower drain",
    "Behind mirror",
    "Inside vanity drawers",
    "Ceiling vent"
  ],
  "Bedroom": [
    "Under bed",
    "Inside nightstand drawers",
    "Behind headboard",
    "Inside closet corners",
    "Under dresser",
    "Behind curtains"
  ],
  "Living Areas": [
    "Behind sofa cushions",
    "Under coffee table",
    "Inside entertainment center",
    "Behind TV",
    "Under rugs",
    "Inside bookshelves"
  ]
};

// Systematic cleaning sequence
export const CleaningSequence = [
  "1. Preparation (gather supplies, open windows)",
  "2. Declutter (remove items, organize)",
  "3. Dust (top to bottom)",
  "4. Clean surfaces (counters, tables, furniture)",
  "5. Clean appliances",
  "6. Clean floors",
  "7. Final inspection",
  "8. Restock supplies"
];

export default CleaningHeuristics; 