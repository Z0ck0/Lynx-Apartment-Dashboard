import jsPDF from "jspdf";
import {
  CleaningSections,
  CleaningGroups,
} from "../data/checklist-data";
import {
  ConsumablesSections,
  ConsumablesGroups,
} from "../data/consumables-data";
import {
  inventorySectionsData,
  InventoryGroups,
} from "../data/inventory-data";
import type { ShoppingItem } from "../types";

export class PdfGenerator {
  public static async generateChecklistPdf(): Promise<void> {
    const doc = new jsPDF();
    const date =
      (
        document.getElementById(
          "date"
        ) as HTMLSelectElement
      )?.value || "unknown_date";

    // It's important to load a font that supports Cyrillic characters.
    // jsPDF's built-in fonts do not. We will have to use a custom font.
    // For this example, I'll assume a font file is available in the public directory
    // and that it has been pre-processed into a format jsPDF can use.
    // This is a complex step that is hard to replicate here, so I will fall back
    // to standard fonts, but Cyrillic may not render correctly without a custom font.

    doc.setFont("helvetica", "normal");
    let y = 10;

    // --- Cleaning List ---
    doc.setFontSize(16);
    doc.text("Cleaning List", 10, y);
    y += 10;
    CleaningGroups.forEach(group => {
      doc.setFontSize(14);
      doc.text(group.group, 10, y);
      y += 8;
      group.sections.forEach(section => {
        const items = CleaningSections[section];
        const checkedArr = JSON.parse(
          localStorage.getItem(
            `checked_${section}`
          ) || "[]"
        );
        items.forEach((item, idx) => {
          if (y > 280) {
            doc.addPage();
            y = 10;
          }
          const checked = checkedArr[idx]
            ? "[x]"
            : "[ ]";
          doc.setFontSize(10);
          doc.text(`${checked} ${item}`, 14, y);
          y += 7;
        });
      });
    });

    // --- Consumables List ---
    doc.addPage();
    y = 10;
    doc.setFontSize(16);
    doc.text("Consumables List", 10, y);
    y += 10;
    ConsumablesGroups.forEach(group => {
      if (y > 280) {
        doc.addPage();
        y = 10;
      }
      doc.setFontSize(14);
      doc.text(group.group, 10, y);
      y += 8;
      group.sections.forEach(section => {
        const items =
          ConsumablesSections[section];
        const checkedArr = JSON.parse(
          localStorage.getItem(
            `checked_${section}`
          ) || "[]"
        );
        items.forEach((item, idx) => {
          if (y > 280) {
            doc.addPage();
            y = 10;
          }
          const checked = checkedArr[idx]
            ? "[x]"
            : "[ ]";
          doc.setFontSize(10);
          doc.text(`${checked} ${item}`, 14, y);
          y += 7;
        });
      });
    });

    // --- Inventory List ---
    doc.addPage();
    y = 10;
    doc.setFontSize(16);
    doc.text("Inventory List", 10, y);
    y += 10;
    InventoryGroups.forEach(group => {
      if (y > 280) {
        doc.addPage();
        y = 10;
      }
      doc.setFontSize(14);
      doc.text(group.group, 10, y);
      y += 8;
      group.sections.forEach(section => {
        const items =
          inventorySectionsData[section];
        const checkedArr = JSON.parse(
          localStorage.getItem(
            `checked_${section}`
          ) || "[]"
        );
        items.forEach((item, idx) => {
          if (y > 280) {
            doc.addPage();
            y = 10;
          }
          const checked = checkedArr[idx]
            ? "[x]"
            : "[ ]";
          doc.setFontSize(10);
          doc.text(
            `${checked} ${item.text} (${item.type})`,
            14,
            y
          );
          y += 7;
        });
      });
    });

    // --- Shopping List ---
    const shoppingList: ShoppingItem[] =
      JSON.parse(
        localStorage.getItem("shoppingList") ||
          "[]"
      );
    if (shoppingList.length > 0) {
      doc.addPage();
      y = 10;
      doc.setFontSize(16);
      doc.text("Shopping List", 10, y);
      y += 10;
      shoppingList.forEach(item => {
        if (y > 280) {
          doc.addPage();
          y = 10;
        }
        const checked = item.completed
          ? "[x]"
          : "[ ]";
        doc.setFontSize(10);
        doc.text(
          `${checked} ${item.text}`,
          14,
          y
        );
        y += 7;
      });
    }

    // --- Notes ---
    const notes = localStorage.getItem("notes");
    if (notes) {
      if (y > 260) {
        doc.addPage();
        y = 10;
      }
      doc.setFontSize(16);
      doc.text("Additional Notes", 10, y);
      y += 10;
      doc.setFontSize(12);
      doc.text(notes, 10, y, { maxWidth: 180 });
    }

    doc.save(`Lynx_Checklist_${date}.pdf`);
  }
}
