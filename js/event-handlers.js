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

    // Copy address functionality - use existing function if available
    const copyButtons = document.querySelectorAll(
      '[data-action="copy-address"]'
    );
    copyButtons.forEach(btn => {
      btn.addEventListener("click", function () {
        // Check if copyAddress function exists in the current page
        if (typeof copyAddress === "function") {
          copyAddress();
        } else {
          // Fallback implementation
          const addressText =
            document.getElementById(
              "pickup-address"
            )?.textContent ||
            "Boulevard Serbia 31, Cevahir Sky City, Tower C, Floor 11, Apartment 109";
          navigator.clipboard
            .writeText(addressText)
            .then(() => {
              // Show success message
              const originalText =
                this.textContent;
              this.textContent = "Copied!";
              this.style.backgroundColor =
                "#4CAF50";
              setTimeout(() => {
                this.textContent = originalText;
                this.style.backgroundColor = "";
              }, 2000);
            })
            .catch(err => {
              console.error(
                "Failed to copy: ",
                err
              );
            });
        }
      });
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
        if (
          typeof copyInstructionLink ===
          "function"
        ) {
          copyInstructionLink(instructionId);
        } else {
          // Fallback implementation
          const url =
            window.location.href.split("#")[0] +
            "#" +
            instructionId;
          navigator.clipboard
            .writeText(url)
            .then(() => {
              const originalText =
                this.textContent;
              this.textContent = "Link Copied!";
              setTimeout(() => {
                this.textContent = originalText;
              }, 2000);
            })
            .catch(err => {
              console.error(
                "Failed to copy link: ",
                err
              );
            });
        }
      });
    });

    // Dropdown toggle functionality
    const dropdownButtons =
      document.querySelectorAll(
        '[data-action="toggle-dropdown"]'
      );
    dropdownButtons.forEach(btn => {
      btn.addEventListener("click", function () {
        if (
          typeof toggleDropdown === "function"
        ) {
          toggleDropdown(this);
        } else {
          // Fallback implementation
          const content = this.nextElementSibling;
          this.classList.toggle("active");
          content.classList.toggle("active");
        }
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
        if (typeof openModal === "function") {
          openModal(parseInt(modalIndex));
        } else {
          console.log(
            "openModal function not found"
          );
        }
      });
    });

    const modalCloseButtons =
      document.querySelectorAll(
        '[data-action="close-modal"]'
      );
    modalCloseButtons.forEach(btn => {
      btn.addEventListener("click", function () {
        if (typeof closeModal === "function") {
          closeModal();
        } else {
          console.log(
            "closeModal function not found"
          );
        }
      });
    });

    const modalPrevButtons =
      document.querySelectorAll(
        '[data-action="prev-modal"]'
      );
    modalPrevButtons.forEach(btn => {
      btn.addEventListener("click", function () {
        if (typeof prevModalImg === "function") {
          prevModalImg();
        } else {
          console.log(
            "prevModalImg function not found"
          );
        }
      });
    });

    const modalNextButtons =
      document.querySelectorAll(
        '[data-action="next-modal"]'
      );
    modalNextButtons.forEach(btn => {
      btn.addEventListener("click", function () {
        if (typeof nextModalImg === "function") {
          nextModalImg();
        } else {
          console.log(
            "nextModalImg function not found"
          );
        }
      });
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
        if (
          videoType === "garage" &&
          typeof openGarageVideoModalFromPreview ===
            "function"
        ) {
          openGarageVideoModalFromPreview();
        } else if (
          typeof openVideoModalFromPreview ===
          "function"
        ) {
          openVideoModalFromPreview();
        } else {
          console.log(
            "Video modal function not found"
          );
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
        if (typeof selectStatus === "function") {
          selectStatus(this, status);
        } else {
          console.log(
            "selectStatus function not found"
          );
        }
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
        if (
          typeof selectEditStatus === "function"
        ) {
          selectEditStatus(this, status);
        } else {
          console.log(
            "selectEditStatus function not found"
          );
        }
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
        if (typeof editEntry === "function") {
          editEntry(parseInt(index), pageType);
        } else {
          console.log(
            "editEntry function not found"
          );
        }
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
        if (typeof deleteEntry === "function") {
          deleteEntry(parseInt(index), pageType);
        } else {
          console.log(
            "deleteEntry function not found"
          );
        }
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
        if (
          typeof addToShoppingList === "function"
        ) {
          addToShoppingList(item);
        } else {
          console.log(
            "addToShoppingList function not found"
          );
        }
      });
    });

    const addShoppingItemButtons =
      document.querySelectorAll(
        '[data-action="add-shopping-item"]'
      );
    addShoppingItemButtons.forEach(btn => {
      btn.addEventListener("click", function () {
        if (
          typeof addShoppingItem === "function"
        ) {
          addShoppingItem();
        } else {
          console.log(
            "addShoppingItem function not found"
          );
        }
      });
    });

    const saveChecklistButtons =
      document.querySelectorAll(
        '[data-action="save-checklist"]'
      );
    saveChecklistButtons.forEach(btn => {
      btn.addEventListener("click", function () {
        if (typeof saveChecklist === "function") {
          saveChecklist();
        } else {
          console.log(
            "saveChecklist function not found"
          );
        }
      });
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
        if (
          typeof toggleAllSections === "function"
        ) {
          toggleAllSections(expand);
        } else {
          console.log(
            "toggleAllSections function not found"
          );
        }
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
          if (typeof setTheme === "function") {
            setTheme(
              !document.body.classList.contains(
                "dark-mode"
              )
            );
          } else {
            console.log(
              "setTheme function not found"
            );
          }
        }
      );
    }

    // Initialize theme if setTheme function exists
    if (typeof setTheme === "function") {
      (function () {
        const saved =
          localStorage.getItem("lynx-theme");
        setTheme(saved === "dark" || !saved);
      })();
    }
  }
);

// Theme management function (fallback)
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

// Copy address function (fallback)
function copyAddress() {
  const addressText =
    document.getElementById("pickup-address")
      ?.textContent ||
    "Boulevard Serbia 31, Cevahir Sky City, Tower C, Floor 11, Apartment 109";
  navigator.clipboard
    .writeText(addressText)
    .then(() => {
      // Show success message using existing showToast if available
      if (typeof showToast === "function") {
        showToast("Address copied!");
      } else {
        // Fallback toast implementation
        const toast =
          document.createElement("div");
        toast.className = "toast";
        toast.textContent = "Address copied!";
        toast.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #4CAF50;
                color: white;
                padding: 12px 24px;
                border-radius: 4px;
                z-index: 10000;
                font-family: Arial, sans-serif;
                font-size: 14px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                transform: translateX(100%);
                transition: transform 0.3s ease;
            `;
        document.body.appendChild(toast);

        setTimeout(() => {
          toast.style.transform = "translateX(0)";
        }, 100);

        setTimeout(() => {
          toast.style.transform =
            "translateX(100%)";
          setTimeout(() => {
            toast.remove();
          }, 300);
        }, 2000);
      }
    })
    .catch(err => {
      console.error("Failed to copy: ", err);
    });
}

// Copy instruction link function (fallback)
function copyInstructionLink(instructionId) {
  const url =
    window.location.href.split("#")[0] +
    "#" +
    instructionId;
  navigator.clipboard
    .writeText(url)
    .then(() => {
      if (typeof showToast === "function") {
        showToast("Link copied!");
      } else {
        console.log("Link copied to clipboard");
      }
    })
    .catch(err => {
      console.error("Failed to copy link: ", err);
    });
}

// Dropdown toggle function (fallback)
function toggleDropdown(button) {
  const content = button.nextElementSibling;
  button.classList.toggle("active");
  content.classList.toggle("active");
}

// Modal functions (fallbacks)
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

// Admin functions (fallbacks)
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

// Shopping list functions (fallbacks)
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
