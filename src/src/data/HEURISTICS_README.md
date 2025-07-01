# 🧹 Cleaning Heuristics System

## Overview

This comprehensive cleaning heuristics system ensures you never forget anything during apartment cleaning. It's designed to work alongside your existing checklist system and provides systematic approaches to thorough cleaning.

## 🎯 Key Features

### 1. **Critical Heuristics** (Must-Follow)

- **Top-to-Bottom Rule**: Always clean from ceiling to floor
- **Guest Perspective Method**: View each room as a guest would
- **Safety and Security Check**: Verify all safety measures
- **Quality Assurance Walkthrough**: Final comprehensive check

### 2. **Quick Reference Scenarios**

- **Quick Turnover**: For fast cleaning between guests
- **Deep Clean**: For thorough periodic cleaning
- **Pre-Guest Arrival**: Final preparation checklist
- **Post-Guest Departure**: Post-stay inspection

### 3. **Common Oversights Prevention**

- Kitchen-specific oversights (microwave, under fridge, etc.)
- Bathroom oversights (behind toilet, shower drain, etc.)
- Bedroom oversights (under bed, inside drawers, etc.)
- Living area oversights (behind cushions, under furniture, etc.)

### 4. **Systematic Cleaning Sequence**

8-step process from preparation to final inspection

## 🚀 How to Use

### Basic Usage

```typescript
import CleaningHeuristicsChecklist from "../checklist/cleaning-heuristics-checklist";

// Initialize the heuristics checklist
const container = document.getElementById(
  "heuristics-container"
);
const heuristicsChecklist =
  new CleaningHeuristicsChecklist(container);
```

### Programmatic Usage

```typescript
import CleaningValidator from "../utils/cleaning-validator";

// Create validator instance
const validator = new CleaningValidator();

// Mark tasks as completed
validator.markTaskCompleted(
  "Clean kitchen surfaces",
  "Кујна"
);

// Validate cleaning completeness
const result = validator.validateCleaning();
console.log(`Cleaning Score: ${result.score}%`);
console.log(
  `Missing Items: ${result.missingItems.length}`
);
```

## 📋 Heuristic Categories

### Critical Priority (Must Do)

1. **Top-to-Bottom Rule**

   - Prevents re-contamination
   - Systematic approach: left to right, top to bottom
   - Don't forget above eye level

2. **Guest Perspective Method**

   - Enter each room as a guest would
   - Test all guest-accessible features
   - Ensure nothing looks neglected

3. **Safety and Security Check**

   - Smoke detectors and fire extinguishers
   - Emergency exit routes
   - Door locks and security systems

4. **Quality Assurance Walkthrough**
   - Systematic property walkthrough
   - Test all guest amenities
   - Document any issues found

### High Priority (Important)

1. **Inside-to-Outside Rule**
2. **Five Senses Check**
3. **Functionality Test**
4. **Supply Verification**

### Medium Priority (Good Practice)

1. **Hidden Areas Protocol**
2. **Seasonal Considerations**

## 🔍 Common Oversights by Room

### Kitchen

- Inside microwave
- Under refrigerator
- Inside dishwasher
- Coffee machine water tank
- Spice containers
- Under sink area

### Bathroom

- Behind toilet
- Inside medicine cabinet
- Shower drain
- Behind mirror
- Inside vanity drawers
- Ceiling vent

### Bedroom

- Under bed
- Inside nightstand drawers
- Behind headboard
- Inside closet corners
- Under dresser
- Behind curtains

### Living Areas

- Behind sofa cushions
- Under coffee table
- Inside entertainment center
- Behind TV
- Under rugs
- Inside bookshelves

## 📊 Validation System

The system provides a scoring mechanism (0-100%) based on:

- Critical heuristics completion
- Common oversights addressed
- Systematic approach adherence

### Score Interpretation

- **80-100%**: Excellent - Property is guest-ready
- **60-79%**: Good - Minor issues to address
- **Below 60%**: Needs attention - Critical items missing

## 🛠️ Integration with Existing System

The heuristics system is designed to complement your existing checklist:

1. **Use existing checklist** for room-specific tasks
2. **Use heuristics** for systematic approach and validation
3. **Cross-reference** to ensure nothing is missed
4. **Validate** using the scoring system

## 📝 Best Practices

1. **Start with Critical Heuristics**: Always follow the top-to-bottom rule
2. **Use Guest Perspective**: Regularly view rooms as guests would
3. **Check Common Oversights**: Use the oversight lists for each room
4. **Validate Regularly**: Use the validation system to check completeness
5. **Document Issues**: Note any problems found during cleaning

## 🔧 Customization

You can extend the system by:

1. **Adding new heuristics** to `CleaningHeuristics` array
2. **Modifying common oversights** for your specific property
3. **Adjusting priorities** based on your needs
4. **Adding room-specific heuristics** for unique features

## 📱 Usage Tips

1. **Print the heuristics** for offline reference
2. **Use the validation system** after each cleaning session
3. **Review common oversights** before final inspection
4. **Follow the systematic sequence** for consistent results
5. **Use quick reference scenarios** for different cleaning situations

## 🎯 Success Metrics

Track your cleaning effectiveness by:

- Validation scores over time
- Guest feedback on cleanliness
- Reduction in cleaning-related issues
- Time efficiency improvements

---

_This heuristics system is designed to make your cleaning process more systematic, thorough, and reliable. Use it consistently to ensure your property always meets guest expectations._
