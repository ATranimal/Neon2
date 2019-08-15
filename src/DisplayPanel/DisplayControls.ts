/** @module DisplayPanel/DisplayControls */

import * as Color from '../utils/Color';
import Icons from '../img/icons.svg';
import ZoomHandler from '../SingleView/Zoom';

let lastGlyphOpacity: number, lastImageOpacity: number;

/**
 * Initialize listeners and controls for display panel.
 * @param {string} meiClassName - The class used to signifiy the MEI element(s).
 * @param {string} background - The class used to signify the background.
 */
export function initDisplayControls (meiClassName: string, background: string): void {
  setOpacityControls(meiClassName);
  setBackgroundOpacityControls(background);
  setHighlightControls();
  setBurgerControls();

  const displayContents = document.getElementById('displayContents');
  const toggleDisplay = document.getElementById('toggleDisplay');

  toggleDisplay.addEventListener('click', () => {
    if (displayContents.style.display === 'none') {
      displayContents.style.display = '';
      toggleDisplay.setAttribute('xlink:href', Icons + '#dropdown-down');
    } else {
      displayContents.style.display = 'none';
      toggleDisplay.setAttribute('xlink:href', Icons + '#dropdown-side');
    }
  });
}

/**
 * Set zoom control listener for button and slider
 */
export function setZoomControls (zoomHandler?: ZoomHandler): void {
  if (zoomHandler === undefined) {
    return;
  }
  const zoomSlider = document.getElementById('zoomSlider') as HTMLInputElement;
  const zoomOutput = document.getElementById('zoomOutput') as HTMLOutputElement;

  zoomSlider.value = '100';
  document.getElementById('reset-zoom').addEventListener('click', () => {
    zoomOutput.value = '100';
    zoomSlider.value = '100';
    zoomHandler.resetZoomAndPan();
  });

  zoomSlider.addEventListener('input', inputChangeHandler);
  zoomSlider.addEventListener('change', inputChangeHandler);

  function inputChangeHandler (): void {
    zoomOutput.value = zoomSlider.value;
    zoomHandler.zoomTo(Number(zoomOutput.value) / 100.0);
  }

  document.body.addEventListener('keydown', (evt) => {
    const currentZoom = parseInt(zoomOutput.value);
    if (evt.key === '+') { // increase zoom by 20
      const newZoom = Math.min(currentZoom + 20, parseInt(zoomSlider.getAttribute('max')));
      zoomHandler.zoomTo(newZoom / 100.0);
      zoomOutput.value = String(newZoom);
      zoomSlider.value = String(newZoom);
    } else if (evt.key === '-') { // decrease zoom by 20
      const newZoom = Math.max(currentZoom - 20, parseInt(zoomSlider.getAttribute('min')));
      zoomHandler.zoomTo(newZoom / 100.0);
      zoomOutput.value = String(Math.round(newZoom));
      zoomSlider.value = String(newZoom);
    } else if (evt.key === '0') {
      zoomOutput.value = '100';
      zoomSlider.value = '100';
      zoomHandler.resetZoomAndPan();
    }
  });
}

/**
 * Set rendered MEI opacity button and slider listeners.
 */
function setOpacityControls (meiClassName: string): void {
  lastGlyphOpacity = 100;
  const opacitySlider = document.getElementById('opacitySlider') as HTMLInputElement;
  const opacityOutput = document.getElementById('opacityOutput') as HTMLOutputElement;

  opacitySlider.value = '100';

  document.getElementById('reset-opacity').addEventListener('click', () => {
    // Definition scale is the root element of what is generated by verovio
    const lowerOpacity = lastGlyphOpacity < 95 ? lastGlyphOpacity / 100.0 : 0;
    const newOpacity = opacitySlider.value === '100' ? lowerOpacity : 1;
    (document.querySelector('.' + meiClassName) as HTMLElement)
      .style.opacity = newOpacity.toString();

    lastGlyphOpacity = Number(opacitySlider.value);
    opacitySlider.value = String(newOpacity * 100);
    opacityOutput.value = String(Math.round(newOpacity * 100));
  });

  opacitySlider.addEventListener('input', inputChangeOpacity);
  opacitySlider.addEventListener('change', inputChangeOpacity);

  function inputChangeOpacity (): void {
    opacityOutput.value = opacitySlider.value;
    lastGlyphOpacity = Number(opacitySlider.value);
    (document.querySelector('.' + meiClassName) as HTMLElement)
      .style.opacity = (Number(opacityOutput.value) / 100.0).toString();
  }
}

/**
 * Update MEI opacity to value from the slider.
 */
export function setOpacityFromSlider (meiClassName?: string): void {
  const opacityOutput = document.getElementById('opacityOutput') as HTMLOutputElement;
  opacityOutput.value = (document.getElementById('opacitySlider') as HTMLInputElement).value;
  try {
    ((document.querySelector('.' + meiClassName)) as HTMLElement)
      .style.opacity = (Number(opacityOutput.value) / 100.0).toString();
  } catch (e) {}
}

/**
 * Set background image opacity button and slider listeners.
 */
function setBackgroundOpacityControls (background: string): void {
  lastImageOpacity = 100;
  const bgOpacitySlider = document.getElementById('bgOpacitySlider') as HTMLInputElement;
  const bgOpacityOutput = document.getElementById('bgOpacityOutput') as HTMLOutputElement;

  bgOpacitySlider.value = '100';
  document.getElementById('reset-bg-opacity').addEventListener('click', () => {
    const lowerOpacity = lastImageOpacity < 95 ? lastImageOpacity / 100.0 : 0;
    const newOpacity = bgOpacitySlider.value === '100' ? lowerOpacity : 1;
    (document.getElementsByClassName(background)[0] as HTMLElement)
      .style.opacity = newOpacity.toString();

    lastImageOpacity = Number(bgOpacitySlider.value);
    bgOpacitySlider.value = String(newOpacity * 100);
    bgOpacityOutput.value = String(Math.round(newOpacity * 100));
  });

  bgOpacitySlider.addEventListener('input', bgInputChangeHandler);
  bgOpacitySlider.addEventListener('change', bgInputChangeHandler);

  function bgInputChangeHandler (): void {
    bgOpacityOutput.value = bgOpacitySlider.value;
    lastImageOpacity = Number(bgOpacitySlider.value);
    (document.getElementsByClassName(background)[0] as HTMLElement)
      .style.opacity = (Number(bgOpacityOutput.value) / 100.0).toString();
  }
}

/**
 * Set listener on staff highlighting checkbox.
 */
export function setHighlightControls (): void {
  const highlightDropdown = document.getElementById('highlight-dropdown');
  const highlightStaff = document.getElementById('highlight-staff');
  const highlightSyllable = document.getElementById('highlight-syllable');
  const highlightNeume = document.getElementById('highlight-neume');
  const highlightNone = document.getElementById('highlight-none');
  const highlightType = document.getElementById('highlight-type');

  document.getElementById('highlight-button').addEventListener('click', (evt) => {
    evt.stopPropagation();
    highlightDropdown.classList.toggle('is-active');
    if (highlightDropdown.classList.contains('is-active')) {
      document.body.addEventListener('click', highlightClickaway);
      highlightStaff.addEventListener('click', () => {
        highlightDropdown.classList.remove('is-active');
        document.querySelectorAll('.highlight-selected').forEach(elem => {
          elem.classList.remove('highlight-selected');
        });
        highlightStaff.classList.add('highlight-selected');
        highlightType.textContent = ' - Staff';
        Color.setGroupingHighlight('staff');
      });
      highlightSyllable.addEventListener('click', () => {
        highlightDropdown.classList.remove('is-active');
        document.querySelectorAll('.highlight-selected').forEach(elem => {
          elem.classList.remove('highlight-selected');
        });
        highlightSyllable.classList.add('highlight-selected');
        highlightType.textContent = ' - Syllable';
        Color.setGroupingHighlight('syllable');
      });
      highlightNeume.addEventListener('click', () => {
        highlightDropdown.classList.remove('is-active');
        document.querySelectorAll('.highlight-selected').forEach(elem => {
          elem.classList.remove('highlight-selected');
        });
        highlightNeume.classList.add('highlight-selected');
        highlightType.textContent = ' - Neume';
        Color.setGroupingHighlight('neume');
      });
      highlightNone.addEventListener('click', () => {
        highlightDropdown.classList.remove('is-active');
        document.querySelectorAll('.highlight-selected').forEach(elem => {
          elem.classList.remove('highlight-selected');
        });
        highlightType.textContent = ' - Off';
        Color.unsetGroupingHighlight();
      });
    } else {
      document.body.removeEventListener('click', highlightClickaway);
    }
  });
}

export function setHighlightSelectionControls (): void {
  const highlightSelection = document.getElementById('highlight-selection');
  highlightSelection.addEventListener('click', () => {
    document.getElementById('highlight-dropdown').classList.remove('is-active');
    document.querySelectorAll('.highlight-selected').forEach(elem => {
      elem.classList.remove('highlight-selected');
    });
    highlightSelection.classList.add('highlight-selected');
    document.getElementById('highlight-type').textContent = ' - Selection';
    Color.setGroupingHighlight('selection');
  });
}

/**
 * Reset the highlight for different types based on the 'highlight-selected' class in the DOM.
 */
export function updateHighlight (): void {
  let highlightId: string;
  try {
    highlightId = document.querySelector('.highlight-selected').id;
  } catch (e) {
    highlightId = '';
  }
  switch (highlightId) {
    case 'highlight-staff':
      Color.setGroupingHighlight('staff');
      break;
    case 'highlight-syllable':
      Color.setGroupingHighlight('syllable');
      break;
    case 'highlight-neume':
      Color.setGroupingHighlight('neume');
      break;
    case 'highlight-selection':
      Color.setGroupingHighlight('selection');
      break;
    default:
      Color.unsetGroupingHighlight();
  }
}

/**
 * Set listener on burger menu for smaller screens.
 */
function setBurgerControls () {
  document.getElementById('burgerMenu').addEventListener('click', () => {
    this.classList.toggle('is-active');
    document.getElementById('navMenu').classList.toggle('is-active');
  });
}

/**
 * Clickaway listener for the highlight dropdown.
 */
function highlightClickaway () {
  document.body.removeEventListener('click', highlightClickaway);
  document.getElementById('highlight-dropdown').classList.remove('is-active');
}
