# Trash Disposal Video Fix

## Issue Description
The trash disposal video on the Instructions.html page was not clickable. When users clicked on the video preview image, the video modal would not open.

## Root Cause
The issue was caused by a missing JavaScript reference. The `openVideoModalFromPreview()` function was trying to find a video element with ID `"trash-disposal-video"` that did not exist in the DOM.

```javascript
// Original problematic code:
function openVideoModalFromPreview() {
  openVideoModal(
    document.getElementById("trash-disposal-video") // This element didn't exist
  );
}
```

## Solution
Fixed the `openVideoModalFromPreview()` function to work directly with the video source path instead of trying to find a non-existent video element:

```javascript
// Fixed code:
function openVideoModalFromPreview() {
  const videoSrc = "public/video/trash-disposal-guide.mp4";
  modalVideo.querySelector("source").src = videoSrc;
  modalVideo.load(); // Reload the video with new source
  videoModal.style.display = "block";
  document.body.style.overflow = "hidden"; // Prevent background scrolling
}
```

## Changes Made

### 1. Fixed the JavaScript Function
- **File**: `Instructions.html`
- **Lines**: 1588-1593 (approximately)
- **Change**: Modified `openVideoModalFromPreview()` to set the video source directly

### 2. Cleaned Up Unused Code
- **File**: `Instructions.html`
- **Lines**: 1551-1587 (approximately)
- **Change**: Removed event listeners and references to the non-existent `trash-disposal-video` element

## Testing
Added comprehensive Playwright tests to verify the fix:

### Test Structure
- **Page Object**: `tests/pages/InstructionsPage.js`
- **Test File**: `tests/trash-disposal-video.spec.js`
- **Config**: `playwright.config.js`

### Test Coverage
1. **Display Test**: Verifies trash video preview and overlay are visible
2. **Click Test**: Verifies video modal opens when preview is clicked
3. **Source Test**: Verifies correct video source is loaded
4. **Close Tests**: Verifies modal closes via:
   - Close button
   - Escape key
   - Clicking outside the modal

### Running Tests
```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests in headed mode
npm run test:headed

# Run specific test file
npx playwright test tests/trash-disposal-video.spec.js
```

## Files Modified
- `Instructions.html` - Fixed the video modal functionality
- `package.json` - Added test scripts
- `playwright.config.js` - Added Playwright configuration

## Files Added
- `tests/pages/InstructionsPage.js` - Page object for Instructions page
- `tests/trash-disposal-video.spec.js` - Test file for video functionality

## Video File Location
The video file is located at: `public/video/trash-disposal-guide.mp4`

## Verification
The fix ensures that:
1. ✅ Trash disposal video preview is visible
2. ✅ Video modal opens when clicked
3. ✅ Correct video source is loaded
4. ✅ Modal can be closed properly
5. ✅ All functionality works across different browsers

The issue has been resolved and the trash disposal video is now fully functional and clickable.