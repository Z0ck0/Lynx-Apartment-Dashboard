const fs = require('fs').promises;
const path = require('path');
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Routes
app.post('/api/add-house-rule', async (req, res) => {
    try {
        const { ruleData } = req.body;
        
        // Read the current house-rules.html file
        const filePath = path.join(__dirname, 'house-rules.html');
        const htmlContent = await fs.readFile(filePath, 'utf-8');
        
        // Generate the new rule HTML
        const newRuleHtml = generateHouseRuleHTML(ruleData);
        
        // Find the injection point (before the additional-rules section)
        const injectionPoint = htmlContent.indexOf('<details class="additional-rules">');
        
        if (injectionPoint === -1) {
            return res.status(400).json({ 
                success: false, 
                error: 'Could not find injection point in house-rules.html' 
            });
        }
        
        // Insert the new rule before the additional-rules section
        const beforeSection = htmlContent.substring(0, injectionPoint);
        const afterSection = htmlContent.substring(injectionPoint);
        
        const updatedContent = beforeSection + newRuleHtml + '\n\n        ' + afterSection;
        
        // Write the updated content back to the file
        await fs.writeFile(filePath, updatedContent, 'utf-8');
        
        res.json({
            success: true,
            message: 'House rule added successfully',
            html: newRuleHtml
        });
        
    } catch (error) {
        console.error('Error adding house rule:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.post('/api/add-instruction', async (req, res) => {
    try {
        const { instructionData } = req.body;
        
        // Read the current Instructions.html file
        const filePath = path.join(__dirname, 'Instructions.html');
        const htmlContent = await fs.readFile(filePath, 'utf-8');
        
        // Generate the new instruction HTML
        const newInstructionHtml = generateInstructionHTML(instructionData);
        
        // Find the injection point (before the disclaimer section)
        const injectionPoint = htmlContent.indexOf('<div class="disclaimer-section">');
        
        if (injectionPoint === -1) {
            return res.status(400).json({ 
                success: false, 
                error: 'Could not find injection point in Instructions.html' 
            });
        }
        
        // Insert the new instruction before the disclaimer section
        const beforeSection = htmlContent.substring(0, injectionPoint);
        const afterSection = htmlContent.substring(injectionPoint);
        
        const updatedContent = beforeSection + newInstructionHtml + '\n    ' + afterSection;
        
        // Write the updated content back to the file
        await fs.writeFile(filePath, updatedContent, 'utf-8');
        
        res.json({
            success: true,
            message: 'Instruction added successfully',
            html: newInstructionHtml
        });
        
    } catch (error) {
        console.error('Error adding instruction:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// File upload endpoint for images and videos
app.post('/api/upload-file', async (req, res) => {
    try {
        // This would handle file uploads
        // For now, we'll just return a success message
        res.json({
            success: true,
            message: 'File upload would be handled here',
            filename: `uploaded-${Date.now()}.jpg`
        });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Helper functions
function generateHouseRuleHTML(ruleData) {
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
                  <span class="time-value">${formatTime(ruleData.startTime)}</span>
                </div>
                <div class="time-row">
                  <span class="time-label">End time:</span>
                  <span class="time-value">${formatTime(ruleData.endTime)}</span>
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

function generateInstructionHTML(instructionData) {
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
            const imageName = `instruction-${Date.now()}-${index}.jpg`;
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
        const videoName = `instruction-video-${Date.now()}.mp4`;
        html += `
              <h4 style="color: var(--lynx-yellow); margin-top: 20px; margin-bottom: 10px;">🎥 Video Guide:</h4>
              <div style="text-align: center; margin-top: 16px;">
                <video controls style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
                  <source src="public/video/${videoName}" type="video/mp4">
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

function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
}

// Start the server
app.listen(PORT, () => {
    console.log(`Admin server running on http://localhost:${PORT}`);
    console.log(`Access the admin panel at: http://localhost:${PORT}/admin.html`);
});

module.exports = app;