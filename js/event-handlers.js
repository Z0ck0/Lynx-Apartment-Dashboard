// Centralized event handlers for Lynx Apartment HTML files
// This file replaces all inline onclick handlers with proper event listeners

document.addEventListener(
  "DOMContentLoaded",
  function () {
    // Navigation handlers
    const homeButtons = document.querySelectorAll(
      '[data-action="home"]'
    );
    homeButtons.forEach(btn => {
      btn.addEventListener(
        "click",
        () => (window.location.href = "home.html")
      );
    });

    // Copy address functionality
    const copyButtons = document.querySelectorAll(
      '[data-action="copy-address"]'
    );
    copyButtons.forEach(btn => {
      btn.addEventListener("click", copyAddress);
    });

    // Copy instruction link functionality
    const copyInstructionButtons =
      document.querySelectorAll(
        '[data-action="copy-instruction"]'
      );
    copyInstructionButtons.forEach(btn => {
      btn.addEventListener("click", function () {
        const instructionId = this.getAttribute(
          "data-instruction-id"
        );
        copyInstructionLink(instructionId);
      });
    });

    // Dropdown toggle functionality
    const dropdownButtons =
      document.querySelectorAll(
        '[data-action="toggle-dropdown"]'
      );
    dropdownButtons.forEach(btn => {
      btn.addEventListener("click", function () {
        toggleDropdown(this);
      });
    });

    // Modal functionality
    const modalOpenButtons =
      document.querySelectorAll(
        '[data-action="open-modal"]'
      );
    modalOpenButtons.forEach(btn => {
      btn.addEventListener("click", function () {
        const modalIndex = this.getAttribute(
          "data-modal-index"
        );
        openModal(parseInt(modalIndex));
      });
    });

    const modalCloseButtons =
      document.querySelectorAll(
        '[data-action="close-modal"]'
      );
    modalCloseButtons.forEach(btn => {
      btn.addEventListener("click", closeModal);
    });

    const modalPrevButtons =
      document.querySelectorAll(
        '[data-action="prev-modal"]'
      );
    modalPrevButtons.forEach(btn => {
      btn.addEventListener("click", prevModalImg);
    });

    const modalNextButtons =
      document.querySelectorAll(
        '[data-action="next-modal"]'
      );
    modalNextButtons.forEach(btn => {
      btn.addEventListener("click", nextModalImg);
    });

    // Video modal functionality
    const videoModalButtons =
      document.querySelectorAll(
        '[data-action="open-video-modal"]'
      );
    videoModalButtons.forEach(btn => {
      btn.addEventListener("click", function () {
        const videoType = this.getAttribute(
          "data-video-type"
        );
        if (videoType === "garage") {
          openGarageVideoModalFromPreview();
        } else {
          openVideoModalFromPreview();
        }
      });
    });

    // File upload functionality
    const fileUploadAreas =
      document.querySelectorAll(
        '[data-action="file-upload"]'
      );
    fileUploadAreas.forEach(area => {
      area.addEventListener("click", function () {
        const inputId = this.getAttribute(
          "data-input-id"
        );
        document.getElementById(inputId).click();
      });
    });

    // Status selection functionality
    const statusChips = document.querySelectorAll(
      '[data-action="select-status"]'
    );
    statusChips.forEach(chip => {
      chip.addEventListener("click", function () {
        const status = this.getAttribute(
          "data-status"
        );
        selectStatus(this, status);
      });
    });

    const editStatusChips =
      document.querySelectorAll(
        '[data-action="select-edit-status"]'
      );
    editStatusChips.forEach(chip => {
      chip.addEventListener("click", function () {
        const status = this.getAttribute(
          "data-status"
        );
        selectEditStatus(this, status);
      });
    });

    // Admin functionality
    const editButtons = document.querySelectorAll(
      '[data-action="edit-entry"]'
    );
    editButtons.forEach(btn => {
      btn.addEventListener("click", function () {
        const index =
          this.getAttribute("data-index");
        const pageType = this.getAttribute(
          "data-page-type"
        );
        editEntry(parseInt(index), pageType);
      });
    });

    const deleteButtons =
      document.querySelectorAll(
        '[data-action="delete-entry"]'
      );
    deleteButtons.forEach(btn => {
      btn.addEventListener("click", function () {
        const index =
          this.getAttribute("data-index");
        const pageType = this.getAttribute(
          "data-page-type"
        );
        deleteEntry(parseInt(index), pageType);
      });
    });

    // Shopping list functionality
    const addShoppingButtons =
      document.querySelectorAll(
        '[data-action="add-shopping"]'
      );
    addShoppingButtons.forEach(btn => {
      btn.addEventListener("click", function () {
        const item =
          this.getAttribute("data-item");
        addToShoppingList(item);
      });
    });

    const addShoppingItemButtons =
      document.querySelectorAll(
        '[data-action="add-shopping-item"]'
      );
    addShoppingItemButtons.forEach(btn => {
      btn.addEventListener(
        "click",
        addShoppingItem
      );
    });

    const saveChecklistButtons =
      document.querySelectorAll(
        '[data-action="save-checklist"]'
      );
    saveChecklistButtons.forEach(btn => {
      btn.addEventListener(
        "click",
        saveChecklist
      );
    });

    const toggleAllButtons =
      document.querySelectorAll(
        '[data-action="toggle-all"]'
      );
    toggleAllButtons.forEach(btn => {
      btn.addEventListener("click", function () {
        const expand =
          this.getAttribute("data-expand") ===
          "true";
        toggleAllSections(expand);
      });
    });

    // Theme toggle functionality
    const themeToggle = document.getElementById(
      "theme-toggle"
    );
    if (themeToggle) {
      themeToggle.addEventListener(
        "click",
        function () {
          setTheme(
            !document.body.classList.contains(
              "dark-mode"
            )
          );
        }
      );
    }

    // Initialize theme
    (function () {
      const saved =
        localStorage.getItem("lynx-theme");
      setTheme(saved === "dark" || !saved);
    })();
  }
);

// Theme management function
function setTheme(dark) {
  const themeToggle = document.getElementById(
    "theme-toggle"
  );
  if (dark) {
    document.body.classList.add("dark-mode");
    if (themeToggle)
      themeToggle.textContent = "☀️";
    localStorage.setItem("lynx-theme", "dark");
  } else {
    document.body.classList.remove("dark-mode");
    if (themeToggle)
      themeToggle.textContent = "🌙";
    localStorage.setItem("lynx-theme", "light");
  }
}

// Copy address function
function copyAddress() {
  const addressText = document.getElementById(
    "pickup-address"
  ).textContent;
  navigator.clipboard
    .writeText(addressText)
    .then(() => {
      // Show success message
      const button = event.target;
      const originalText = button.textContent;
      button.textContent = "Copied!";
      button.style.backgroundColor = "#4CAF50";
      setTimeout(() => {
        button.textContent = originalText;
        button.style.backgroundColor = "";
      }, 2000);
    })
    .catch(err => {
      console.error("Failed to copy: ", err);
    });
}

// Copy instruction link function
function copyInstructionLink(instructionId) {
  const url =
    window.location.href.split("#")[0] +
    "#" +
    instructionId;
  navigator.clipboard
    .writeText(url)
    .then(() => {
      // Show success message
      const button = event.target;
      const originalText = button.textContent;
      button.textContent = "Link Copied!";
      setTimeout(() => {
        button.textContent = originalText;
      }, 2000);
    })
    .catch(err => {
      console.error("Failed to copy link: ", err);
    });
}

// Dropdown toggle function
function toggleDropdown(button) {
  const content = button.nextElementSibling;
  button.classList.toggle("active");
  content.classList.toggle("active");
}

// Modal functions (these should be defined in the specific HTML files that use them)
// Placeholder functions - these will be overridden by the actual implementations
function openModal(index) {
  console.log(
    "openModal called with index:",
    index
  );
}

function closeModal() {
  console.log("closeModal called");
}

function prevModalImg() {
  console.log("prevModalImg called");
}

function nextModalImg() {
  console.log("nextModalImg called");
}

function openGarageVideoModalFromPreview() {
  console.log(
    "openGarageVideoModalFromPreview called"
  );
}

function openVideoModalFromPreview() {
  console.log("openVideoModalFromPreview called");
}

// Admin functions (placeholders)
function selectStatus(element, status) {
  console.log(
    "selectStatus called with:",
    status
  );
}

function selectEditStatus(element, status) {
  console.log(
    "selectEditStatus called with:",
    status
  );
}

function editEntry(index, pageType) {
  console.log(
    "editEntry called with:",
    index,
    pageType
  );
}

function deleteEntry(index, pageType) {
  console.log(
    "deleteEntry called with:",
    index,
    pageType
  );
}

// Shopping list functions (placeholders)
function addToShoppingList(item) {
  console.log(
    "addToShoppingList called with:",
    item
  );
}

function addShoppingItem() {
  console.log("addShoppingItem called");
}

function saveChecklist() {
  console.log("saveChecklist called");
}

function toggleAllSections(expand) {
  console.log(
    "toggleAllSections called with:",
    expand
  );
}
