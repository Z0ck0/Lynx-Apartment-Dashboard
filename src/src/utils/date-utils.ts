export class DateUtils {
  static populateDateDropdown(): void {
    const select = document.getElementById(
      "date"
    ) as HTMLSelectElement;
    if (!select) return;

    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dd = String(d.getDate()).padStart(
        2,
        "0"
      );
      const mm = String(
        d.getMonth() + 1
      ).padStart(2, "0");
      const yyyy = d.getFullYear();
      const dateStr = `${dd}-${mm}-${yyyy}`;

      const option =
        document.createElement("option");
      option.value = dateStr;
      option.text = dateStr;
      if (i === 0) option.selected = true;
      select.appendChild(option);
    }
  }

  static initNotes(): void {
    const notesInput = document.getElementById(
      "notes"
    ) as HTMLInputElement;
    if (!notesInput) return;

    // Load saved notes
    const savedNotes =
      localStorage.getItem("notes");
    if (savedNotes) {
      notesInput.value = savedNotes;
    }

    // Save notes on input
    notesInput.addEventListener("input", e => {
      localStorage.setItem(
        "notes",
        (e.target as HTMLInputElement).value
      );
    });
  }
}
