import {
  CleaningHeuristics,
  QuickHeuristics,
  CommonOversights,
  CleaningSequence,
} from "../data/cleaning-heuristics";
import CleaningValidator from "../utils/cleaning-validator";

export class CleaningHeuristicsChecklist {
  private validator: CleaningValidator;
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.validator = new CleaningValidator();
    this.container = container;
    this.render();
  }

  private render() {
    this.container.innerHTML = `
      <div class="heuristics-container">
        <h2>🧹 Cleaning Heuristics - Never Forget Anything!</h2>
        
        <div class="heuristics-grid">
          <div class="heuristic-section">
            <h3>🎯 Critical Heuristics</h3>
            ${this.renderHeuristicsByPriority(
              "critical"
            )}
          </div>
          
          <div class="heuristic-section">
            <h3>⚡ Quick Reference</h3>
            ${this.renderQuickHeuristics()}
          </div>
          
          <div class="heuristic-section">
            <h3>🔍 Common Oversights</h3>
            ${this.renderCommonOversights()}
          </div>
          
          <div class="heuristic-section">
            <h3>📋 Systematic Sequence</h3>
            ${this.renderCleaningSequence()}
          </div>
        </div>
        
        <div class="validation-section">
          <h3>✅ Validation</h3>
          <button id="validate-cleaning" class="btn btn-primary">Validate Cleaning</button>
          <div id="validation-result"></div>
        </div>
      </div>
    `;

    this.attachEventListeners();
    this.addStyles();
  }

  private renderHeuristicsByPriority(
    priority:
      | "critical"
      | "high"
      | "medium"
      | "low"
  ) {
    const heuristics = CleaningHeuristics.filter(
      h => h.priority === priority
    );

    return heuristics
      .map(
        heuristic => `
      <div class="heuristic-card ${priority}">
        <h4>${heuristic.name}</h4>
        <p>${heuristic.description}</p>
        <div class="heuristic-checklist">
          ${heuristic.checklist
            .map(
              item => `
            <label class="heuristic-item">
              <input type="checkbox" data-heuristic="${heuristic.name}" data-item="${item}">
              <span>${item}</span>
            </label>
          `
            )
            .join("")}
        </div>
        <div class="heuristic-tips">
          <strong>Tips:</strong>
          <ul>
            ${heuristic.tips
              .map(tip => `<li>${tip}</li>`)
              .join("")}
          </ul>
        </div>
      </div>
    `
      )
      .join("");
  }

  private renderQuickHeuristics() {
    return Object.entries(QuickHeuristics)
      .map(
        ([scenario, items]) => `
      <div class="quick-heuristic">
        <h4>${scenario}</h4>
        <ul>
          ${items
            .map(item => `<li>${item}</li>`)
            .join("")}
        </ul>
      </div>
    `
      )
      .join("");
  }

  private renderCommonOversights() {
    return Object.entries(CommonOversights)
      .map(
        ([area, items]) => `
      <div class="oversight-area">
        <h4>${area}</h4>
        <ul>
          ${items
            .map(
              item => `
            <li>
              <label class="oversight-item">
                <input type="checkbox" data-area="${area}" data-item="${item}">
                <span>${item}</span>
              </label>
            </li>
          `
            )
            .join("")}
        </ul>
      </div>
    `
      )
      .join("");
  }

  private renderCleaningSequence() {
    return `
      <div class="cleaning-sequence">
        <ol>
          ${CleaningSequence.map(
            step => `<li>${step}</li>`
          ).join("")}
        </ol>
      </div>
    `;
  }

  private attachEventListeners() {
    // Handle heuristic checkboxes
    this.container
      .querySelectorAll("input[data-heuristic]")
      .forEach(checkbox => {
        checkbox.addEventListener("change", e => {
          const target =
            e.target as HTMLInputElement;
          const heuristic =
            target.dataset.heuristic!;
          const item = target.dataset.item!;

          if (target.checked) {
            this.validator.markTaskCompleted(
              item
            );
          }
        });
      });

    // Handle oversight checkboxes
    this.container
      .querySelectorAll("input[data-area]")
      .forEach(checkbox => {
        checkbox.addEventListener("change", e => {
          const target =
            e.target as HTMLInputElement;
          const area = target.dataset.area!;
          const item = target.dataset.item!;

          if (target.checked) {
            this.validator.markTaskCompleted(
              item,
              area
            );
          }
        });
      });

    // Handle validation button
    const validateBtn =
      this.container.querySelector(
        "#validate-cleaning"
      );
    if (validateBtn) {
      validateBtn.addEventListener(
        "click",
        () => {
          this.showValidationResult();
        }
      );
    }
  }

  private showValidationResult() {
    const result =
      this.validator.validateCleaning();
    const resultDiv =
      this.container.querySelector(
        "#validation-result"
      );

    if (resultDiv) {
      resultDiv.innerHTML = `
        <div class="validation-result">
          <div class="score ${
            result.score >= 80
              ? "good"
              : result.score >= 60
              ? "warning"
              : "poor"
          }">
            <h4>Score: ${result.score}%</h4>
            <div class="score-bar">
              <div class="score-fill" style="width: ${
                result.score
              }%"></div>
            </div>
          </div>
          
          ${
            result.missingItems.length > 0
              ? `
            <div class="missing-items">
              <h4>Missing Critical Items:</h4>
              <ul>
                ${result.missingItems
                  .map(item => `<li>${item}</li>`)
                  .join("")}
              </ul>
            </div>
          `
              : ""
          }
          
          ${
            result.warnings.length > 0
              ? `
            <div class="warnings">
              <h4>Common Oversights:</h4>
              <ul>
                ${result.warnings
                  .map(
                    warning =>
                      `<li>${warning}</li>`
                  )
                  .join("")}
              </ul>
            </div>
          `
              : ""
          }
          
          ${
            result.suggestions.length > 0
              ? `
            <div class="suggestions">
              <h4>Suggestions:</h4>
              <ul>
                ${result.suggestions
                  .map(
                    suggestion =>
                      `<li>${suggestion}</li>`
                  )
                  .join("")}
              </ul>
            </div>
          `
              : ""
          }
          
          ${
            result.isComplete
              ? `
            <div class="complete-message">
              <h4>🎉 Cleaning Complete!</h4>
              <p>All critical items have been addressed. Your property is guest-ready!</p>
            </div>
          `
              : ""
          }
        </div>
      `;
    }
  }

  private addStyles() {
    const style = document.createElement("style");
    style.textContent = `
      .heuristics-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }

      .heuristics-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
        margin: 20px 0;
      }

      .heuristic-section {
        background: #f8f9fa;
        border-radius: 8px;
        padding: 20px;
        border: 1px solid #e9ecef;
      }

      .heuristic-section h3 {
        color: #495057;
        margin-bottom: 15px;
        border-bottom: 2px solid #007bff;
        padding-bottom: 5px;
      }

      .heuristic-card {
        background: white;
        border-radius: 6px;
        padding: 15px;
        margin-bottom: 15px;
        border-left: 4px solid;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }

      .heuristic-card.critical {
        border-left-color: #dc3545;
      }

      .heuristic-card.high {
        border-left-color: #fd7e14;
      }

      .heuristic-card.medium {
        border-left-color: #ffc107;
      }

      .heuristic-card.low {
        border-left-color: #28a745;
      }

      .heuristic-card h4 {
        color: #212529;
        margin-bottom: 10px;
      }

      .heuristic-checklist {
        margin: 15px 0;
      }

      .heuristic-item {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
        cursor: pointer;
      }

      .heuristic-item input[type="checkbox"] {
        margin-right: 8px;
      }

      .heuristic-tips {
        background: #e3f2fd;
        padding: 10px;
        border-radius: 4px;
        margin-top: 10px;
      }

      .heuristic-tips ul {
        margin: 5px 0;
        padding-left: 20px;
      }

      .quick-heuristic, .oversight-area {
        background: white;
        border-radius: 6px;
        padding: 15px;
        margin-bottom: 15px;
        border: 1px solid #dee2e6;
      }

      .oversight-item {
        display: flex;
        align-items: center;
        margin-bottom: 5px;
        cursor: pointer;
      }

      .oversight-item input[type="checkbox"] {
        margin-right: 8px;
      }

      .cleaning-sequence ol {
        padding-left: 20px;
      }

      .cleaning-sequence li {
        margin-bottom: 8px;
        padding: 5px 0;
      }

      .validation-section {
        background: white;
        border-radius: 8px;
        padding: 20px;
        margin-top: 20px;
        border: 1px solid #dee2e6;
      }

      .btn {
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 16px;
        margin: 10px 0;
      }

      .btn-primary {
        background: #007bff;
        color: white;
      }

      .btn-primary:hover {
        background: #0056b3;
      }

      .validation-result {
        margin-top: 20px;
      }

      .score {
        text-align: center;
        margin-bottom: 20px;
      }

      .score.good .score-fill {
        background: #28a745;
      }

      .score.warning .score-fill {
        background: #ffc107;
      }

      .score.poor .score-fill {
        background: #dc3545;
      }

      .score-bar {
        width: 100%;
        height: 20px;
        background: #e9ecef;
        border-radius: 10px;
        overflow: hidden;
        margin-top: 10px;
      }

      .score-fill {
        height: 100%;
        transition: width 0.3s ease;
      }

      .missing-items, .warnings, .suggestions {
        background: #f8f9fa;
        padding: 15px;
        border-radius: 6px;
        margin-bottom: 15px;
      }

      .missing-items h4 {
        color: #dc3545;
      }

      .warnings h4 {
        color: #fd7e14;
      }

      .suggestions h4 {
        color: #007bff;
      }

      .complete-message {
        background: #d4edda;
        color: #155724;
        padding: 15px;
        border-radius: 6px;
        text-align: center;
      }
    `;
    document.head.appendChild(style);
  }

  // Public method to get validation result
  getValidationResult() {
    return this.validator.validateCleaning();
  }

  // Public method to reset
  reset() {
    this.validator.reset();
    this.render();
  }
}

export default CleaningHeuristicsChecklist;
