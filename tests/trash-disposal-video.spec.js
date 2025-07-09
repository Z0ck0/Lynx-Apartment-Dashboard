const { test, expect } = require('@playwright/test');
const InstructionsPage = require('./pages/InstructionsPage');

test.describe('Trash Disposal Video', () => {
  let instructionsPage;

  test.beforeEach(async ({ page }) => {
    instructionsPage = new InstructionsPage(page);
    await instructionsPage.navigate();
  });

  test('should display trash disposal video preview image', async () => {
    await test.step('Verify trash video preview is visible', async () => {
      expect(await instructionsPage.isTrashVideoPreviewVisible()).toBeTruthy();
    });

    await test.step('Verify video play overlay is visible', async () => {
      expect(await instructionsPage.isVideoPlayOverlayVisible()).toBeTruthy();
    });
  });

  test('should open video modal when trash video preview is clicked', async () => {
    await test.step('Click on trash video preview', async () => {
      await instructionsPage.clickTrashVideoPreview();
    });

    await test.step('Verify video modal opens', async () => {
      await instructionsPage.waitForVideoModalToOpen();
      expect(await instructionsPage.isVideoModalVisible()).toBeTruthy();
    });

    await test.step('Verify video source is correctly set', async () => {
      const videoSource = await instructionsPage.getVideoSource();
      expect(videoSource).toContain('public/video/trash-disposal-guide.mp4');
    });
  });

  test('should close video modal when close button is clicked', async () => {
    await test.step('Open video modal', async () => {
      await instructionsPage.clickTrashVideoPreview();
      await instructionsPage.waitForVideoModalToOpen();
    });

    await test.step('Close video modal', async () => {
      await instructionsPage.closeVideoModal();
      await instructionsPage.waitForVideoModalToClose();
    });

    await test.step('Verify video modal is closed', async () => {
      expect(await instructionsPage.isVideoModalClosed()).toBeTruthy();
    });
  });

  test('should close video modal when escape key is pressed', async ({ page }) => {
    await test.step('Open video modal', async () => {
      await instructionsPage.clickTrashVideoPreview();
      await instructionsPage.waitForVideoModalToOpen();
    });

    await test.step('Press escape key', async () => {
      await page.keyboard.press('Escape');
      await instructionsPage.waitForVideoModalToClose();
    });

    await test.step('Verify video modal is closed', async () => {
      expect(await instructionsPage.isVideoModalClosed()).toBeTruthy();
    });
  });

  test('should close video modal when clicking outside the video', async ({ page }) => {
    await test.step('Open video modal', async () => {
      await instructionsPage.clickTrashVideoPreview();
      await instructionsPage.waitForVideoModalToOpen();
    });

    await test.step('Click outside video modal', async () => {
      await page.locator('#videoModal').click({
        position: { x: 10, y: 10 }
      });
      await instructionsPage.waitForVideoModalToClose();
    });

    await test.step('Verify video modal is closed', async () => {
      expect(await instructionsPage.isVideoModalClosed()).toBeTruthy();
    });
  });
});