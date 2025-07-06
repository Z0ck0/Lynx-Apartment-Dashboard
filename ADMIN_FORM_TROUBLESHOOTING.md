# Admin Form Troubleshooting Guide

## Common Errors and Solutions

### 1. "An error occurred while submitting the instruction. Please try again."

**Causes:**
- Git repository not properly initialized
- Server not running
- Network connection issues
- File permission problems
- Branch creation/merging failures

**Solutions:**
1. **Check Server Status:**
   ```bash
   npm start
   ```
   Ensure the server is running on port 3000

2. **Initialize Git Repository:**
   ```bash
   git init
   git config user.name "Admin Panel"
   git config user.email "admin@lynx-apartments.com"
   ```

3. **Check File Permissions:**
   Ensure the server has write permissions to the project directory

4. **Verify Git Status:**
   ```bash
   git status
   ```

### 2. "Error adding instruction: The string did not match the expected pattern."

**Causes:**
- Invalid characters in input fields (< or > symbols)
- Browser form validation restrictions
- Input length validation failures

**Solutions:**
1. **Check Input Content:**
   - Avoid using `<` or `>` symbols in title or instructions
   - Ensure title is at least 3 characters long
   - Ensure instructions are at least 10 characters long

2. **Clear Browser Cache:**
   ```
   Ctrl + Shift + Delete (Windows)
   Cmd + Shift + Delete (Mac)
   ```

3. **Try Different Browser:**
   Test with Chrome, Firefox, or Safari

## Form Validation Rules

### Title Field
- **Minimum length:** 3 characters
- **Prohibited characters:** `<` and `>`
- **Required:** Yes

### Instructions Field
- **Minimum length:** 10 characters
- **Prohibited characters:** `<` and `>`
- **Required:** Yes

### Images
- **Maximum files:** 10
- **Supported formats:** JPG, PNG, GIF
- **Required:** No

### Video
- **Maximum files:** 1
- **Supported formats:** MP4, WebM, MOV
- **Required:** No

## Best Practices

1. **Input Sanitization:**
   - The system automatically removes `<` and `>` characters
   - Use plain text formatting for instructions

2. **Error Handling:**
   - Check browser console for detailed error messages
   - Button states are managed automatically (disabled during submission)

3. **Git Management:**
   - Each submission creates a new branch
   - Changes are automatically merged to main branch
   - Failed operations are cleaned up automatically

## Debugging Steps

1. **Open Browser Developer Tools:**
   - Press F12 or right-click → Inspect
   - Go to Console tab
   - Look for error messages

2. **Check Server Logs:**
   - Look at the terminal where the server is running
   - Check for Git-related errors

3. **Verify File Structure:**
   ```
   project/
   ├── admin.html
   ├── Instructions.html
   ├── server.js
   ├── package.json
   └── .git/
   ```

4. **Test with Minimal Input:**
   - Title: "Test"
   - Instructions: "This is a test instruction"
   - No images or video

## Contact Information

If issues persist after following this guide, please contact the system administrator with:
- Error message screenshot
- Browser console logs
- Server terminal output
- Steps to reproduce the issue

## Recent Fixes Applied

- Enhanced input validation on both client and server
- Improved error messages with specific guidance
- Added Git repository auto-initialization
- Better handling of special characters
- Improved button state management during submission
- Added comprehensive error handling for Git operations