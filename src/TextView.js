import * as Notification from './utils/Notification.js';
import { unselect } from './utils/SelectTools.js';
import { updateHighlight } from './DisplayPanel/DisplayControls.js';

/** @module TextView */

const $ = require('jquery');

/*
 * Class that manages getting the text for syllables in Neon from the mei file
 */
class TextView {
  /**
   * A constructor for a TextView.
   * @param {NeonView} neonView = The NeonView parent.
   */
  constructor (neonView) {
    this.neonView = neonView;
    this.notificationSent = false;

    // add checkbox to enable/disable the view
    let block = document.getElementById('extensible-block');
    let textLabel = document.createElement('label');
    let bboxLabel = document.createElement('label');
    let textButton = document.createElement('input');
    let bboxButton = document.createElement('input');
    textLabel.classList.add('checkbox');
    bboxLabel.classList.add('checkbox');
    textLabel.textContent = 'Display Text: ';
    bboxLabel.textContent = 'Display Text BBoxes: ';
    textButton.classList.add('checkbox');
    bboxButton.classList.add('checkbox');
    textButton.id = 'displayText';
    textButton.type = 'checkbox';
    bboxButton.id = 'displayBBox';
    bboxButton.type = 'checkbox';
    textButton.checked = false;
    bboxButton.checked = false;
    textLabel.appendChild(textButton);
    bboxLabel.appendChild(bboxButton);
    block.prepend(bboxLabel);
    block.prepend(textLabel);

    this.setTextViewControls();
    this.neonView.view.addUpdateCallback(this.updateTextViewVisibility.bind(this));
    this.neonView.view.addUpdateCallback(this.updateBBoxViewVisibility.bind(this));
  }

  /**
  * set listeners on textview visibility checkbox
  */
  setTextViewControls () {
    this.updateTextViewVisibility();
    this.updateBBoxViewVisibility();
    $('#displayText').on('click', () => {
      this.updateTextViewVisibility();
    });
    $('#displayBBox').on('click', () => {
      this.updateBBoxViewVisibility();
    });
  }

  /**
   * update visibility of text bounding boxes
   */
  updateBBoxViewVisibility () {
    if ($('#displayBBox').is(':checked')) {
      $('.sylTextRect').addClass('sylTextRect-display');
      $('.sylTextRect').removeClass('sylTextRect');
      $('.syl.selected').find('.sylTextRect-display').css('fill', 'red');

      if (this.neonView.getUserMode() !== 'viewer' && this.neonView.TextEdit !== undefined) {
        this.neonView.TextEdit.initSelectByBBoxButton();
      }
    } else {
      if ($('#selByBBox').hasClass('is-active')) {
        unselect();
        $('#selByBBox').removeClass('is-active');
        $('#selBySyl').addClass('is-active');
      }
      $('.sylTextRect-display').addClass('sylTextRect');
      $('.sylTextRect-display').removeClass('sylTextRect-display');
      $('.syl.selected').find('sylTextRect').css('fill', 'none');
      $('#selByBBox').css('display', 'none');
    }
    updateHighlight();
  }

  /**
  * update the visibility of the textview box
  * and add the event listeners to make sure the syl highlights when moused over
  */
  updateTextViewVisibility () {
    if ($('#displayText').is(':checked')) {
      $('#syl_text').css('display', '');
      $('#syl_text').html('<p>' + this.getSylText() + '</p>');
      let spans = Array.from($('#syl_text').children('p').children('span'));
      spans.forEach(span => {
        let syllable = $('#' + $(span).attr('class'));
        let syl = syllable.children('.syl');
        let text = syl.children('text');
        let rect = syl.children('rect');
        if (text.attr('class') == null) {
          text.addClass('text');
        }
        $(span).on('mouseenter', () => {
          syllable.addClass('selected');
          rect.css('fill', '#d00');
          // syl.attr('fill', '#ffc7c7');
          // this.highlightBoundingBox(span);
        });
        $(span).on('mouseleave', () => {
          syllable.removeClass('selected');
          if (syllable.css('fill') !== 'rgb(0, 0, 0)') {
            rect.css('fill', syllable.css('fill'));
          } else {
            rect.css('fill', 'blue');
          }
          // syl.attr('fill', null);
          // this.removeBoundingBox(span);
        });
      });
      if (this.neonView.getUserMode() !== 'viewer' && this.neonView.TextEdit !== undefined) {
        this.neonView.TextEdit.initTextEdit();
      }
    } else {
      $('#syl_text').css('display', 'none');
    }
  }

  /**
   * Get the syllable text of the loaded file
   * @returns {string}
   */
  getSylText () {
    var lyrics = '';
    let uniToDash = /\ue551/g;
    let syllables = Array.from($('.active-page .syllable'));
    syllables.forEach(syllable => {
      if ($(syllable).has('.syl').length) {
        let syl = $(syllable).children('.syl')[0];
        lyrics += "<span class='" + syllable.id + "'>";
        if (syl.textContent.trim() === '') {
          lyrics += '&#x25CA; ';
        } else {
          Array.from(syl.children[0].children[0].children).forEach(text => {
            lyrics += text.textContent !== '' ? text.textContent : '&#x25CA; ';
          });
        }
        lyrics += ' </span>';
      }
    });
    if (!TextView.notificationSent) {
      Notification.queueNotification('Blank syllables are represented by &#x25CA;!');
      TextView.notificationSent = true;
    }
    return lyrics.replace(uniToDash, '-');
  }
}

export { TextView as default };
