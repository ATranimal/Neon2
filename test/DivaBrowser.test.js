/* eslint-env jest */
const fs = require('fs-extra');
const { Builder, By, until } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
const chrome = require('selenium-webdriver/chrome');

const uploadPath = './public/uploads/iiif/';
const editUrl = 'http://localhost:8080/edit/test/diva-test';

var browserNames = ['firefox', 'chrome'];
if (require('os').platform() === 'darwin') {
  browserNames.push('safari');
}

jest.setTimeout('15000');

beforeAll(() => {
  // Link test folder
  fs.copySync('./test/test', uploadPath + 'test');
});

afterAll(() => {
  fs.removeSync(uploadPath + 'test');
});

describe.each(['firefox', 'chrome', 'safari'])('Tests on %s', (title) => {
  var browser;

  beforeAll(async () => {
    browser = await new Builder()
      .forBrowser(title)
      .setFirefoxOptions(new firefox.Options().headless())
      .setChromeOptions(new chrome.Options().headless().windowSize({ width: 1280, height: 800 }))
      .build();
    await browser.get(editUrl);
  });

  afterAll(() => {
    browser.quit();
  });

  describe('Neon Basics', () => {
    test('Render Page', async () => {
      const title = await browser.getTitle();
      expect(title).toBe('Neon');
    });
  });

  describe('Boundingbox selecting', () => {
    test('Select syl bbox', async () => {
      await browser.wait(until.elementLocated(By.id('displayBBox')), 10000);
      let displayButton = await browser.findElement(By.id('displayBBox'));
      // safari webdriver was not cooperating, so some things have to be done slightly differently in safari:
      if (title !== 'safari') {
        await browser.actions().click(displayButton).perform();
      } else {
        await browser.executeScript(() => { document.getElementById('displayBBox').click(); });
      }

      await browser.wait(until.elementLocated(By.id('edit_mode')), 10000);
      let editButton = await browser.findElement(By.id('edit_mode'));
      if (title !== 'safari') {
        await browser.actions().click(editButton).perform();
      } else {
        await browser.executeScript(() => { document.getElementById('edit_mode').click(); });
        await browser.executeScript(() => { document.getElementById('selByBBox').scrollIntoView(true); });
      }

      await browser.wait(until.elementLocated(By.id('selByBBox')), 10000);
      let selButton = await browser.findElement(By.id('selByBBox'));
      await browser.actions().click(selButton).perform();
      await browser.wait(until.elementLocated(By.className('sylTextRect-display')), 10000);
      let firstBBox = await browser.findElement(By.className('sylTextRect-display'));
      if (title !== 'safari') {
        await browser.actions().click(firstBBox).perform();
      } else {
        await browser.executeScript(() => { (document.getElementsByClassName('sylTextRect-display')[0]).dispatchEvent(new window.Event('mousedown')); });
      }
      let resizeRectCount = (await browser.findElements(By.id('resizeRect'))).length;
      expect(resizeRectCount).toBe(1);
      let sylSelectedCount = (await browser.findElements(By.className('syl selected'))).length;
      expect(sylSelectedCount).toBe(1);

      await browser.actions().click(selButton).perform();
    });
  });

  describe('Check Display Panel', () => {
    beforeAll(async () => {
      // Ensure document loaded
      await browser.wait(until.elementLocated(By.id('opacitySlider')), 10000);
    });

    test('Check Glyph Opacity', async () => {
      // Set opacity to 0
      await browser.executeScript(() => { document.getElementById('opacitySlider').scrollIntoView(true); });
      let glyphOpacitySlider = await browser.findElement(By.id('opacitySlider'));
      let rect = await glyphOpacitySlider.getRect();
      await browser.actions().dragAndDrop(glyphOpacitySlider, { x: -1 * parseInt(rect.width / 2), y: 0 }).perform();
      let opacityText = await browser.findElement(By.id('opacityOutput')).getText();
      expect(opacityText).toBe('0');
      await browser.wait(until.elementLocated(By.className('neon-container')), 10000);
      let containerStyle = await browser.findElement(By.className('neon-container')).getAttribute('style');
      expect(containerStyle).toContain('opacity: 0;');

      // Reset opacity to 1
      let opacityButton = await browser.findElement(By.id('reset-opacity'));
      await browser.actions().click(opacityButton).perform();
      opacityText = await browser.findElement(By.id('opacityOutput')).getText();
      containerStyle = await browser.findElement(By.className('neon-container')).getAttribute('style');
      expect(opacityText).toBe('100');
      expect(containerStyle).toContain('opacity: 1;');
    });

    test('Check Image Opacity', async () => {
      // Set opacity to 0
      let imageOpacitySlider = await browser.findElement(By.id('bgOpacitySlider'));
      let rect = await imageOpacitySlider.getRect();
      await browser.actions().dragAndDrop(imageOpacitySlider, { x: -1 * parseInt(rect.width), y: 0 }).perform();
      let opacityText = await browser.findElement(By.id('bgOpacityOutput')).getText();
      let canvasStyle = await browser.findElement(By.className('diva-viewer-canvas')).getAttribute('style');
      expect(opacityText).toBe('0');
      expect(canvasStyle).toContain('opacity: 0;');

      // Reset opacity to 1
      let opacityButton = await browser.findElement(By.id('reset-bg-opacity'));
      await browser.actions().click(opacityButton).perform();
      opacityText = await browser.findElement(By.id('bgOpacityOutput')).getText();
      canvasStyle = await browser.findElement(By.className('diva-viewer-canvas')).getAttribute('style');
      expect(opacityText).toBe('100');
      expect(canvasStyle).toContain('opacity: 1;');
    });

    test('Test Highlight (Syllable)', async () => {
      await browser.executeScript(() => { document.getElementById('highlight-button').click(); });
      await browser.executeScript(() => { document.getElementById('highlight-syllable').click(); });
      await browser.wait(until.elementLocated(By.className('syllable')), 10000);
      let someSyllable = await browser.findElement(By.className('syllable'));
      let syllableClasses = await someSyllable.getAttribute('class');
      expect(syllableClasses).toContain('highlighted');
    });
  });

  describe('Test diva.js viewer', () => {
    test('Test scrolling to new active page', async () => {
      // Verify that the first page is active.
      await browser.wait(until.elementLocated(By.id('neon-container-0')), 10000);
      let containerZero = await browser.findElement(By.id('neon-container-0'));
      let containerZeroClass = await containerZero.getAttribute('class');
      expect(containerZeroClass).toContain('active-page');

      // Change page and verify that active page changes
      // scroll
      await browser.executeScript(() => { document.getElementById('diva-1-viewport').scrollBy(0, 1000); });
      // Wait for load
      await browser.wait(until.elementLocated(By.id('neon-container-1')), 2000);
      let containerOneClass = await browser.findElement(By.id('neon-container-1')).getAttribute('class');
      expect(containerOneClass).toContain('active-page');
    });

    test('Test diva.js zoom', async () => {
      // Zoom in
      let zoomInButton = await browser.findElement(By.id('diva-1-zoom-in-button'));
      await browser.wait(until.elementLocated(By.className('neon-container')), 10000);
      let activeContainer = await browser.findElement(By.className('neon-container'));
      let initialSize = await activeContainer.getRect();
      await browser.actions().click(zoomInButton).perform();
      // wait until active container is visible
      await browser.wait(async () => {
        let style = await activeContainer.getAttribute('style');
        return style.match(/display: none;/);
      }, 1500);
      await browser.wait(async () => {
        let style = await activeContainer.getAttribute('style');
        return !style.match(/display: none;/);
      }, 1500);
      let zoomedSize = await activeContainer.getRect();
      await browser.sleep(3000);
      expect(zoomedSize.height).toBeGreaterThan(initialSize.height);
      expect(zoomedSize.width).toBeGreaterThan(initialSize.width);
    });
  });
});
