# Lynx Apartments Admin Panel - Git-Based Content Management

This admin panel now uses Git-based workflow instead of localStorage for managing house rules and instructions.

## What Changed

Instead of storing form submissions in localStorage, the admin panel now:

1. **Creates a new Git branch** for each form submission
2. **Generates HTML content** based on the form data
3. **Injects content** directly into the target HTML files (`house-rules.html` and `Instructions.html`)
4. **Commits changes** with descriptive messages
5. **Merges the branch** back to main automatically
6. **Cleans up** by deleting the feature branch

## How to Use

### Prerequisites

1. Install Node.js dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   ```
   
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

3. Open the admin panel at: `http://localhost:3000/admin.html`

### Adding Content

1. **House Rules**: Fill out the house rules form and click "Add House Rule"
2. **Instructions**: Fill out the instructions form, optionally upload images/videos, and click "Add Instruction"

### What Happens Behind the Scenes

When you submit a form:

1. The browser sends the form data to the backend API
2. The server creates a new Git branch (e.g., `add-house-rule-1234567890`)
3. The server generates appropriate HTML content based on the form data
4. The content gets injected into the target HTML file
5. Changes are committed with a descriptive message
6. The branch is merged back to main
7. The temporary branch is deleted
8. You see a success message confirming the Git workflow completed

### File Structure

- `server.js` - Express server handling Git operations
- `admin.html` - Admin panel interface (updated to use API calls)
- `house-rules.html` - Target file for house rules content
- `Instructions.html` - Target file for instructions content
- `public/` - Directory for uploaded images and videos

### API Endpoints

- `POST /api/house-rules` - Add a new house rule
- `POST /api/instructions` - Add a new instruction with optional files
- `GET /api/git-status` - Get current Git repository status
- `GET /api/commits` - Get recent commit history

### Benefits

- **Version Control**: All changes are tracked in Git
- **Backup**: Content is preserved in repository history
- **Collaboration**: Multiple people can work on content with proper merge history
- **Rollback**: Easy to revert changes if needed
- **Production Ready**: Content is directly integrated into HTML files

### Notes

- The system automatically handles file uploads for instruction images and videos
- All uploads are stored in the `public/` directory
- Branch names are automatically generated with timestamps for uniqueness
- The server handles all Git operations automatically - no manual intervention needed