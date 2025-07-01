import {
  CleaningHeuristics,
  QuickHeuristics,
  CommonOversights,
  CleaningSequence,
} from "../data/cleaning-heuristics";

export interface CleaningValidationResult {
  isComplete: boolean;
  missingItems: string[];
  warnings: string[];
  suggestions: string[];
  score: number; // 0-100
}

export interface RoomValidation {
  room: string;
  completed: boolean;
  missingItems: string[];
  criticalIssues: string[];
}

export class CleaningValidator {
  private completedTasks: Set<string> = new Set();
  private roomValidations: Map<
    string,
    RoomValidation
  > = new Map();

  constructor() {
    this.initializeRoomValidations();
  }

  private initializeRoomValidations() {
    const rooms = [
      "Општо",
      "Спална",
      "Дневна",
      "Кујна",
      "Трпезарија",
      "Купатило",
      "Тераса",
      "Ходник",
    ];

    rooms.forEach(room => {
      this.roomValidations.set(room, {
        room,
        completed: false,
        missingItems: [],
        criticalIssues: [],
      });
    });
  }

  // Mark a task as completed
  markTaskCompleted(task: string, room?: string) {
    this.completedTasks.add(task);

    if (room && this.roomValidations.has(room)) {
      const validation =
        this.roomValidations.get(room)!;
      validation.completed = true;
    }
  }

  // Validate cleaning completeness
  validateCleaning(): CleaningValidationResult {
    const missingItems: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    let totalChecks = 0;
    let passedChecks = 0;

    // Check critical heuristics first
    const criticalHeuristics =
      CleaningHeuristics.filter(
        h => h.priority === "critical"
      );

    criticalHeuristics.forEach(heuristic => {
      totalChecks += heuristic.checklist.length;

      heuristic.checklist.forEach(check => {
        if (
          this.completedTasks.has(check) ||
          this.isTaskCompleted(check)
        ) {
          passedChecks++;
        } else {
          missingItems.push(
            `${heuristic.name}: ${check}`
          );
        }
      });
    });

    // Check for common oversights
    Object.entries(CommonOversights).forEach(
      ([area, items]) => {
        items.forEach(item => {
          if (
            !this.completedTasks.has(item) &&
            !this.isTaskCompleted(item)
          ) {
            warnings.push(`${area}: ${item}`);
          }
        });
      }
    );

    // Generate suggestions based on missing items
    if (missingItems.length > 0) {
      suggestions.push(
        "Focus on critical items first"
      );
      suggestions.push(
        "Follow the top-to-bottom cleaning sequence"
      );
    }

    if (warnings.length > 0) {
      suggestions.push(
        "Check common oversights in each room"
      );
      suggestions.push(
        "Use the guest perspective method"
      );
    }

    // Calculate score
    const score =
      totalChecks > 0
        ? Math.round(
            (passedChecks / totalChecks) * 100
          )
        : 0;

    return {
      isComplete:
        missingItems.length === 0 &&
        warnings.length === 0,
      missingItems,
      warnings,
      suggestions,
      score,
    };
  }

  // Validate specific room
  validateRoom(
    room: string
  ): RoomValidation | null {
    const validation =
      this.roomValidations.get(room);
    if (!validation) return null;

    // Check room-specific common oversights
    const roomOversights =
      CommonOversights[
        room as keyof typeof CommonOversights
      ] || [];

    validation.missingItems =
      roomOversights.filter(
        item =>
          !this.completedTasks.has(item) &&
          !this.isTaskCompleted(item)
      );

    validation.completed =
      validation.missingItems.length === 0;

    return validation;
  }

  // Get quick checklist for specific scenario
  getQuickChecklist(
    scenario: keyof typeof QuickHeuristics
  ): string[] {
    return QuickHeuristics[scenario] || [];
  }

  // Get systematic cleaning sequence
  getCleaningSequence(): string[] {
    return CleaningSequence;
  }

  // Check if a task is implicitly completed based on other completed tasks
  private isTaskCompleted(task: string): boolean {
    // This is a simplified check - in a real implementation, you might have more complex logic
    const taskLower = task.toLowerCase();

    // Check if related tasks are completed
    if (
      taskLower.includes("dust") &&
      this.completedTasks.has(
        "Избриши прашина од површини"
      )
    ) {
      return true;
    }

    if (
      taskLower.includes("vacuum") &&
      this.completedTasks.has(
        "Усисај теписи, подови, гарнитура, столице"
      )
    ) {
      return true;
    }

    if (
      taskLower.includes("floor") &&
      this.completedTasks.has("Изџогирај под")
    ) {
      return true;
    }

    return false;
  }

  // Get heuristics for specific priority level
  getHeuristicsByPriority(
    priority:
      | "critical"
      | "high"
      | "medium"
      | "low"
  ) {
    return CleaningHeuristics.filter(
      h => h.priority === priority
    );
  }

  // Get all missing critical items
  getCriticalMissingItems(): string[] {
    const criticalHeuristics =
      this.getHeuristicsByPriority("critical");
    const missing: string[] = [];

    criticalHeuristics.forEach(heuristic => {
      heuristic.checklist.forEach(check => {
        if (
          !this.completedTasks.has(check) &&
          !this.isTaskCompleted(check)
        ) {
          missing.push(
            `${heuristic.name}: ${check}`
          );
        }
      });
    });

    return missing;
  }

  // Reset validation state
  reset() {
    this.completedTasks.clear();
    this.initializeRoomValidations();
  }

  // Export validation report
  generateReport(): string {
    const result = this.validateCleaning();
    let report = `Cleaning Validation Report\n`;
    report += `========================\n\n`;
    report += `Overall Score: ${result.score}%\n`;
    report += `Status: ${
      result.isComplete
        ? "COMPLETE"
        : "INCOMPLETE"
    }\n\n`;

    if (result.missingItems.length > 0) {
      report += `Missing Critical Items:\n`;
      result.missingItems.forEach(item => {
        report += `- ${item}\n`;
      });
      report += `\n`;
    }

    if (result.warnings.length > 0) {
      report += `Warnings (Common Oversights):\n`;
      result.warnings.forEach(warning => {
        report += `- ${warning}\n`;
      });
      report += `\n`;
    }

    if (result.suggestions.length > 0) {
      report += `Suggestions:\n`;
      result.suggestions.forEach(suggestion => {
        report += `- ${suggestion}\n`;
      });
    }

    return report;
  }
}

export default CleaningValidator;
