/**
 * Admin Content Manager
 * Handles content injection into house-rules.html and Instructions.html
 */

class AdminContentManager {
    constructor() {
        this.houseRulesFile = 'house-rules.html';
        this.instructionsFile = 'Instructions.html';
    }

    /**
     * Add a new house rule to the house-rules.html file
     * @param {Object} ruleData - The rule data from the form
     */
    async addHouseRule(ruleData) {
        try {
            // Try to use the server endpoint first
            try {
                const response = await fetch('/api/add-house-rule', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ ruleData })
                });

                if (response.ok) {
                    const result = await response.json();
                    return {
                        success: true,
                        html: result.html,
                        message: result.message,
                        serverInjected: true
                    };
                }
            } catch (serverError) {
                console.log('Server not available, falling back to client-side generation');
            }

            // Fallback to client-side generation
            const newRuleHtml = this.generateHouseRuleHTML(ruleData);
            
            return {
                success: true,
                html: newRuleHtml,
                message: 'Rule HTML generated successfully (manual insertion required)',
                serverInjected: false
            };
            
        } catch (error) {
            console.error('Error adding house rule:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Add a new instruction to the Instructions.html file
     * @param {Object} instructionData - The instruction data from the form
     */
    async addInstruction(instructionData) {
        try {
            // Try to use the server endpoint first
            try {
                const response = await fetch('/api/add-instruction', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ instructionData })
                });

                if (response.ok) {
                    const result = await response.json();
                    return {
                        success: true,
                        html: result.html,
                        message: result.message,
                        serverInjected: true
                    };
                }
            } catch (serverError) {
                console.log('Server not available, falling back to client-side generation');
            }

            // Fallback to client-side generation
            const newInstructionHtml = this.generateInstructionHTML(instructionData);
            
            return {
                success: true,
                html: newInstructionHtml,
                message: 'Instruction HTML generated successfully (manual insertion required)',
                serverInjected: false
            };
            
        } catch (error) {
            console.error('Error adding instruction:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Generate HTML for a new house rule
     * @param {Object} ruleData - The rule data
     * @returns {string} - The generated HTML
     */
    generateHouseRuleHTML(ruleData) {
        let html = `        <article class="rule-section">
          <div class="rule-item">
            <div class="rule-header">
              <span class="rule-icon" aria-hidden="true">${ruleData.icon || '📋'}</span>
              <span class="rule-label">${ruleData.title}</span>`;

        // Add status chip if provided
        if (ruleData.statusText) {
            html += `
              <span class="status-chip ${ruleData.status}">${ruleData.statusText}</span>`;
        }

        html += `
            </div>
            <div class="rule-content">`;

        // Add description if provided
        if (ruleData.description) {
            html += `
              <p class="rule-desc">${ruleData.description}</p>`;
        }

        // Add time settings for time-based rules
        if (ruleData.type === 'time' && ruleData.startTime && ruleData.endTime) {
            html += `
              <div class="time-settings">
                <div class="time-row">
                  <span class="time-label">Start time:</span>
                  <span class="time-value">${this.formatTime(ruleData.startTime)}</span>
                </div>
                <div class="time-row">
                  <span class="time-label">End time:</span>
                  <span class="time-value">${this.formatTime(ruleData.endTime)}</span>
                </div>
              </div>`;
        }

        // Add guest settings for guest-based rules
        if (ruleData.type === 'guest' && ruleData.maxGuests) {
            html += `
              <div class="guest-settings">
                <div class="guest-row">
                  <span class="guest-label">Maximum guests:</span>
                  <span class="guest-value">${ruleData.maxGuests}</span>
                </div>
              </div>`;
        }

        html += `
            </div>
          </div>
        </article>`;

        return html;
    }

    /**
     * Generate HTML for a new instruction
     * @param {Object} instructionData - The instruction data
     * @returns {string} - The generated HTML
     */
    generateInstructionHTML(instructionData) {
        let html = `      <div class="card">
        <div class="card-title">
          ${instructionData.icon || '🛠️'} ${instructionData.title}
        </div>`;

        // Add images carousel if images are provided
        if (instructionData.images && instructionData.images.length > 0) {
            html += `
        <div class="carousel">
          <div class="checkin-gallery">`;

            instructionData.images.forEach((image, index) => {
                const imageName = `instruction-${Date.now()}-${index}.${image.name.split('.').pop()}`;
                html += `
            <div class="gallery-item">
              <img src="public/${imageName}" alt="Step ${index + 1}" class="gallery-image">
              <div class="gallery-caption">Step ${index + 1}</div>
            </div>`;
            });

            html += `
          </div>
        </div>`;
        } else {
            // Add placeholder carousel if no images
            html += `
        <div class="carousel">
          <div class="carousel-placeholder">
            [Images will be added here]
          </div>
        </div>`;
        }

        // Add dropdown with detailed instructions
        html += `
        <div class="dropdown-container">
          <button class="dropdown-button" onclick="toggleDropdown(this)">
            <span class="dropdown-text">📄 More detailed instructions</span>
            <span class="dropdown-arrow">▼</span>
          </button>
          <div class="dropdown-content">
            <div style="line-height: 1.6; font-size: 1rem;">`;

        // Add instruction steps
        if (instructionData.steps) {
            const paragraphs = instructionData.steps.split('\n').filter(p => p.trim());
            paragraphs.forEach(paragraph => {
                html += `
              <p>${paragraph}</p>`;
            });
        }

        // Add video if provided
        if (instructionData.video) {
            const videoName = `instruction-video-${Date.now()}.${instructionData.video.name.split('.').pop()}`;
            html += `
              <h4 style="color: var(--lynx-yellow); margin-top: 20px; margin-bottom: 10px;">🎥 Video Guide:</h4>
              <div style="text-align: center; margin-top: 16px;">
                <video controls style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
                  <source src="public/video/${videoName}" type="video/${instructionData.video.type}">
                  Your browser does not support the video tag.
                </video>
              </div>`;
        }

        html += `
            </div>
          </div>
        </div>
      </div>`;

        return html;
    }

    /**
     * Format time from 24-hour to 12-hour format
     * @param {string} timeString - Time in HH:MM format
     * @returns {string} - Formatted time
     */
    formatTime(timeString) {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
    }

    /**
     * Export content for manual insertion
     * @param {string} type - 'house-rules' or 'instructions'
     * @param {string} html - The generated HTML
     * @returns {string} - Instructions for manual insertion
     */
    exportForManualInsertion(type, html) {
        const instructions = type === 'house-rules' 
            ? `To add this house rule to house-rules.html:
1. Open house-rules.html in a text editor
2. Find the line that contains: <details class="additional-rules">
3. Insert the following HTML BEFORE that line:

${html}

4. Save the file`
            : `To add this instruction to Instructions.html:
1. Open Instructions.html in a text editor
2. Find the line that contains: <div class="disclaimer-section">
3. Insert the following HTML BEFORE that line:

${html}

4. Save the file`;

        return instructions;
    }

    /**
     * Download content as a file
     * @param {string} content - The content to download
     * @param {string} filename - The filename
     */
    downloadContent(content, filename) {
        const blob = new Blob([content], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * Copy content to clipboard
     * @param {string} content - The content to copy
     */
    async copyToClipboard(content) {
        try {
            await navigator.clipboard.writeText(content);
            return true;
        } catch (error) {
            console.error('Failed to copy to clipboard:', error);
            return false;
        }
    }
}

// Export for use in other scripts
if (typeof window !== 'undefined') {
    window.AdminContentManager = AdminContentManager;
}

// For Node.js environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdminContentManager;
}