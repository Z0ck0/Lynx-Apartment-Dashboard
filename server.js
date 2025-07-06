const express = require('express');
const cors = require('cors');
const fs = require('fs-extra');
const path = require('path');
const simpleGit = require('simple-git');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Git
const git = simpleGit();

// Function to initialize Git repository if needed
async function initializeGitRepository() {
  try {
    // Check if we're already in a Git repository
    await git.status();
    console.log('Git repository already initialized');
  } catch (error) {
    console.log('Initializing Git repository...');
    try {
      await git.init();
      await git.addConfig('user.name', 'Admin Panel');
      await git.addConfig('user.email', 'admin@lynx-apartments.com');
      
      // Create initial commit if needed
      const status = await git.status();
      if (status.files.length > 0) {
        await git.add('.');
        await git.commit('Initial commit');
      }
      
      console.log('Git repository initialized successfully');
    } catch (initError) {
      console.error('Failed to initialize Git repository:', initError);
    }
  }
}

// Initialize Git repository on startup
initializeGitRepository();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'public');
    fs.ensureDirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Utility function to create a new branch
async function createBranch(branchName) {
  try {
    await git.checkoutLocalBranch(branchName);
    console.log(`Created and switched to branch: ${branchName}`);
    return true;
  } catch (error) {
    console.error('Error creating branch:', error);
    return false;
  }
}

// Utility function to commit changes
async function commitChanges(message) {
  try {
    await git.add('.');
    await git.commit(message);
    console.log(`Committed changes: ${message}`);
    return true;
  } catch (error) {
    console.error('Error committing changes:', error);
    return false;
  }
}

// Utility function to merge branch to main
async function mergeBranch(branchName) {
  try {
    await git.checkout('main');
    await git.mergeFromTo(branchName, 'main');
    await git.deleteLocalBranch(branchName);
    console.log(`Merged branch ${branchName} to main and deleted branch`);
    return true;
  } catch (error) {
    console.error('Error merging branch:', error);
    return false;
  }
}

// Utility function to inject content into HTML files
async function injectContentToFile(filePath, content, insertionPoint) {
  try {
    const fileContent = await fs.readFile(filePath, 'utf8');
    
    // Find the insertion point based on the file type
    let insertionIndex;
    if (filePath.includes('house-rules.html')) {
      // Insert before the closing tag of rules-container
      insertionIndex = fileContent.indexOf('</section><!-- rules-container -->');
      if (insertionIndex === -1) {
        insertionIndex = fileContent.indexOf('</details>');
        if (insertionIndex !== -1) {
          insertionIndex = fileContent.indexOf('</section>', insertionIndex);
        }
      }
    } else if (filePath.includes('Instructions.html')) {
      // Insert before the main-content closing tag
      insertionIndex = fileContent.indexOf('</div><!-- main-content -->');
      if (insertionIndex === -1) {
        insertionIndex = fileContent.indexOf('<div class="disclaimer-section">');
      }
    }
    
    if (insertionIndex !== -1) {
      const newContent = fileContent.slice(0, insertionIndex) + content + '\n' + fileContent.slice(insertionIndex);
      await fs.writeFile(filePath, newContent, 'utf8');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error injecting content:', error);
    return false;
  }
}

// Route to handle house rules submission
app.post('/api/house-rules', upload.none(), async (req, res) => {
  try {
    const { icon, title, description, status, statusText, type, startTime, endTime, maxGuests } = req.body;
    
    // Create a unique branch name
    const branchName = `add-house-rule-${Date.now()}`;
    
    // Create branch
    if (!(await createBranch(branchName))) {
      return res.status(500).json({ error: 'Failed to create branch' });
    }
    
    // Generate HTML content
    let ruleHTML = `
        <article class="rule-section">
          <div class="rule-item">
            <div class="rule-header">
              <span class="rule-icon" aria-hidden="true">${icon}</span>
              <span class="rule-label">${title}</span>`;
    
    if (statusText) {
      ruleHTML += `<span class="status-chip ${status}">${statusText}</span>`;
    }
    
    ruleHTML += `</div><div class="rule-content">`;
    
    if (description) {
      ruleHTML += `<p class="rule-desc">${description}</p>`;
    }
    
    if (type === 'time' && startTime && endTime) {
      const formatTime = (timeString) => {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
      };
      
      ruleHTML += `
          <div class="time-settings">
            <div class="time-row">
              <span class="time-label">Start time:</span>
              <span class="time-value">${formatTime(startTime)}</span>
            </div>
            <div class="time-row">
              <span class="time-label">End time:</span>
              <span class="time-value">${formatTime(endTime)}</span>
            </div>
          </div>`;
    }
    
    ruleHTML += `</div></div></article>`;
    
    // Inject content into house-rules.html
    const filePath = path.join(__dirname, 'house-rules.html');
    if (!(await injectContentToFile(filePath, ruleHTML))) {
      return res.status(500).json({ error: 'Failed to inject content' });
    }
    
    // Commit changes
    if (!(await commitChanges(`Add house rule: ${title}`))) {
      return res.status(500).json({ error: 'Failed to commit changes' });
    }
    
    // Merge branch to main
    if (!(await mergeBranch(branchName))) {
      return res.status(500).json({ error: 'Failed to merge branch' });
    }
    
    res.json({ success: true, message: 'House rule added successfully via Git workflow' });
    
  } catch (error) {
    console.error('Error processing house rule:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to handle instructions submission
app.post('/api/instructions', upload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'video', maxCount: 1 }
]), async (req, res) => {
  try {
    const { icon, title, steps } = req.body;
    const images = req.files?.images || [];
    const video = req.files?.video?.[0];
    
    // Input validation
    if (!title || title.trim().length < 3) {
      return res.status(400).json({ error: 'Title must be at least 3 characters long' });
    }
    
    if (!steps || steps.trim().length < 10) {
      return res.status(400).json({ error: 'Instructions must be at least 10 characters long' });
    }
    
    // Sanitize input to prevent injection attacks
    const sanitizedTitle = title.trim().replace(/[<>]/g, '');
    const sanitizedSteps = steps.trim().replace(/[<>]/g, '');
    
    // Check if we're in a Git repository
    try {
      await git.status();
    } catch (gitError) {
      console.error('Git repository not initialized:', gitError);
      return res.status(500).json({ error: 'Git repository not properly configured. Please contact administrator.' });
    }
    
    // Create a unique branch name
    const branchName = `add-instruction-${Date.now()}`;
    
    // Create branch
    try {
      await git.checkoutLocalBranch(branchName);
      console.log(`Created and switched to branch: ${branchName}`);
    } catch (branchError) {
      console.error('Error creating branch:', branchError);
      return res.status(500).json({ error: 'Failed to create branch. Please try again.' });
    }
    
    // Generate HTML content
    let instructionHTML = `
        <div class="card">
          <div class="card-title">
            ${icon || '📝'} ${sanitizedTitle}
          </div>`;
    
    if (images.length > 0) {
      instructionHTML += `
          <div class="carousel">
            <div class="checkin-gallery">`;
      
      images.forEach((image, index) => {
        instructionHTML += `
              <div class="gallery-item">
                <img src="${path.relative(__dirname, image.path)}" alt="Step ${index + 1}" class="gallery-image">
                <div class="gallery-caption">Step ${index + 1}</div>
              </div>`;
      });
      
      instructionHTML += `</div></div>`;
    }
    
    instructionHTML += `
          <div class="dropdown-container">
            <button class="dropdown-button" onclick="toggleDropdown(this)">
              <span class="dropdown-text">📄 More detailed instructions</span>
              <span class="dropdown-arrow">▼</span>
            </button>
            <div class="dropdown-content">
              <div style="line-height: 1.6; font-size: 1rem;">
                <p>${sanitizedSteps.replace(/\n/g, '</p><p>')}</p>`;
    
    if (video) {
      instructionHTML += `
                <h4 style="color: var(--lynx-yellow); margin-top: 20px; margin-bottom: 10px;">🎥 Video Guide:</h4>
                <div style="text-align: center; margin-top: 16px;">
                  <video controls style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
                    <source src="${path.relative(__dirname, video.path)}" type="${video.mimetype}">
                    Your browser does not support the video tag.
                  </video>
                </div>`;
    }
    
    instructionHTML += `</div></div></div></div>`;
    
    // Inject content into Instructions.html
    const filePath = path.join(__dirname, 'Instructions.html');
    
    try {
      const contentInjected = await injectContentToFile(filePath, instructionHTML);
      if (!contentInjected) {
        throw new Error('Failed to inject content into file');
      }
    } catch (fileError) {
      console.error('Error injecting content:', fileError);
      // Try to switch back to main branch
      try {
        await git.checkout('main');
        await git.deleteLocalBranch(branchName);
      } catch (cleanupError) {
        console.error('Error cleaning up branch:', cleanupError);
      }
      return res.status(500).json({ error: 'Failed to update Instructions.html file' });
    }
    
    // Commit changes
    try {
      await git.add('.');
      await git.commit(`Add instruction: ${sanitizedTitle}`);
      console.log(`Committed changes: Add instruction: ${sanitizedTitle}`);
    } catch (commitError) {
      console.error('Error committing changes:', commitError);
      // Try to switch back to main branch
      try {
        await git.checkout('main');
        await git.deleteLocalBranch(branchName);
      } catch (cleanupError) {
        console.error('Error cleaning up branch:', cleanupError);
      }
      return res.status(500).json({ error: 'Failed to commit changes. Please try again.' });
    }
    
    // Merge branch to main
    try {
      await git.checkout('main');
      await git.mergeFromTo(branchName, 'main');
      await git.deleteLocalBranch(branchName);
      console.log(`Merged branch ${branchName} to main and deleted branch`);
    } catch (mergeError) {
      console.error('Error merging branch:', mergeError);
      return res.status(500).json({ error: 'Failed to merge changes. Please contact administrator.' });
    }
    
    res.json({ success: true, message: 'Instruction added successfully via Git workflow' });
    
  } catch (error) {
    console.error('Error processing instruction:', error);
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
});

// Route to get current Git status
app.get('/api/git-status', async (req, res) => {
  try {
    const status = await git.status();
    res.json({ status });
  } catch (error) {
    console.error('Error getting git status:', error);
    res.status(500).json({ error: 'Failed to get git status' });
  }
});

// Route to get commit history
app.get('/api/commits', async (req, res) => {
  try {
    const log = await git.log({ maxCount: 10 });
    res.json({ commits: log.all });
  } catch (error) {
    console.error('Error getting commit history:', error);
    res.status(500).json({ error: 'Failed to get commit history' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Admin panel available at http://localhost:${PORT}/admin.html`);
});