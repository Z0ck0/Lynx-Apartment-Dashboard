class InstructionsPage {
  constructor(page) {
    this.page = page;
    
    // Locators
    this.trashVideoPreview = page.locator('#trash-video-preview');
    this.videoPlayOverlay = page.locator('#video-play-overlay');
    this.videoModal = page.locator('#videoModal');
    this.modalVideo = page.locator('#modalVideo');
    this.videoModalClose = page.locator('.video-modal-close');
    this.themeToggle = page.locator('#theme-toggle');
  }

  async navigate() {
    await this.page.goto('/Instructions.html');
  }

  async clickTrashVideoPreview() {
    await this.trashVideoPreview.click();
  }

  async isVideoModalVisible() {
    return await this.videoModal.isVisible();
  }

  async getVideoSource() {
    return await this.modalVideo.locator('source').getAttribute('src');
  }

  async closeVideoModal() {
    await this.videoModalClose.click();
  }

  async isVideoModalClosed() {
    return await this.videoModal.isHidden();
  }

  async isTrashVideoPreviewVisible() {
    return await this.trashVideoPreview.isVisible();
  }

  async isVideoPlayOverlayVisible() {
    return await this.videoPlayOverlay.isVisible();
  }

  async waitForVideoModalToOpen() {
    await this.videoModal.waitFor({ state: 'visible' });
  }

  async waitForVideoModalToClose() {
    await this.videoModal.waitFor({ state: 'hidden' });
  }
}

module.exports = InstructionsPage;