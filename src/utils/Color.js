/** @module utils/Color */

const $ = require('jquery');

/**
 * Set a highlight by a different grouping. Either staff, syllable, or neume.
 * @param {string} grouping - The grouping name.
 */
export function setGroupingHighlight (grouping) {
  unsetGroupingHighlight();
  if (grouping === 'staff') {
    setStaffHighlight();
    return;
  } else if (grouping === 'selection') {
    let temp = $('.sel-by.is-active').attr('id');
    switch (temp) {
      case 'selBySyl':
      case 'selByBBox':
        grouping = 'syllable';
        break;
      case 'selByStaff':
        grouping = 'staff';
        break;
      default: 
        grouping = 'neume';
        break;
    }
    setGroupingHighlight(grouping);
    return;
  }

  let groups = Array.from($('.' + grouping));
  for (var i = 0; i < groups.length; i++) {
    let groupColor = ColorPalette[i % ColorPalette.length];
    if (!$(groups[i]).parents('.selected').length && !$(groups[i]).hasClass('selected')) {
      groups[i].setAttribute('fill', groupColor);
      let rects = Array.from($(groups[i]).find('.sylTextRect-display'));
      rects.forEach(function (rect) {
        $(rect).css('fill', groupColor);
      });
      $(groups[i]).addClass('highlighted');
      $(groups[i]).find('.sylTextRect-display').addClass('highlighted');
    } else {
      if (!$(groups[i]).hasClass('selected')) {
        groups[i].setAttribute('fill', null);
      } else {
        groups[i].setAttribute('fill', '#d00');
      }
      $(groups[i]).removeClass('highlighted');
    }
  }
}

/**
 * Unset highlight for all grouping types
 */
export function unsetGroupingHighlight () {
  unsetStaffHighlight();
  let highlighted = Array.from($('.highlighted').filter((index, elem) => { return !$(elem.parentElement).hasClass('selected'); }));
  highlighted.forEach(elem => {
    elem.setAttribute('fill', null);
    let rects = Array.from($(elem).find('.sylTextRect-display'));
    if (!rects.length) {
      if (Array.from($(elem).parents('syllable')).length) {
        rects = Array.from($(elem).parents('syllable').find('.sylTextRect-display'));
      }
    }
    rects.forEach(function (rect) {
      if ($(rect).closest('.syllable').hasClass('selected')) {
        $(rect).css('fill', 'red');
      } else {
        $(rect).css('fill', 'blue');
      }
      $(rect).removeClass('highlighted');
    });
    $(elem).removeClass('highlighted');
    $(elem).find('sylTextRect-display').removeClass('highlighted');
  });
}

/**
 * Highlight each staff a different color.
 */
export function setStaffHighlight () {
  let staves = Array.from(document.getElementsByClassName('staff'));
  for (var i = 0; i < staves.length; i++) {
    let staffColor = ColorPalette[i % ColorPalette.length];
    highlight(staves[i], staffColor);
  }
}

/**
 * Remove the highlight from each staff.
 */
export function unsetStaffHighlight () {
  unhighlight('.staff');
}

/**
 * Highlight a staff a certain color.
 * @param {SVGGElement} staff - The staff's SVG element.
 * @param {string} color - The color to highlight the staff.
 */
export function highlight (staff, color) {
  let children = Array.from($('#' + staff.id).children());
  children.forEach(child => {
    if (child.tagName === 'path') {
      child.setAttribute('stroke', color);
    } else if (child.classList.contains('resizePoint') || child.id === 'resizeRect' || child.classList.contains('skewPoint')) {
      return;
    } else {
      child.setAttribute('fill', color);
      let rects = Array.from($(child).find('.sylTextRect-display'));
      if (!rects.length) { rects = Array.from($(child).parents('syllable').find('.sylTextRect-display')); }
      rects.forEach(function (rect) {
        let syllable = $(rect).parents('.syllable');
        if (!syllable.hasClass('selected')) {
          $(rect).css('fill', color);
          $(rect).addClass('highlighted');
        }
      });
    }
    $(child).addClass('highlighted');
  });
}

/**
 * Remove the highlight from a staff.
 * @param {(SVGGElement|string)} staff - The staff's SVG element or a JQuery selector.
 */
export function unhighlight (staff) {
  let children = Array.from($(staff).filter(':not(.selected)').children('.highlighted'));
  children.forEach(elem => {
    if (elem.tagName === 'path') {
      elem.setAttribute('stroke', '#000000');
    } else {
      elem.removeAttribute('fill');
      let rects = Array.from($(elem).find('.sylTextRect-display'));
      if (!rects.length) { rects = Array.from($(elem).parents('syllable').find('.sylTextRect-display')); }
      rects.forEach(function (rect) {
        if ($(rect).closest('.syllable').hasClass('selected')) {
        $(rect).css('fill', 'red');
      } else {
        $(rect).css('fill', 'blue');
      }
      $(rect).removeClass('highlighted');
      });
    }
  });
  $(staff).filter(':not(.selected)').children('.highlighted').removeClass('highlighted');
}

/**
 * Color palette from Figure 2 (Colors optimized for color-blind
 * individuals) from
 * ["Points of view: Color blindness" by Bang Wong published in Nature Methods volume 8 on 27 May 2011]{@link https://www.nature.com/articles/nmeth.1618?WT.ec_id=NMETH-201106}
 * @type {string[]}
 */
const ColorPalette = [
//    "rgb(0,0,0)",
  'rgb(230, 159, 0)',
  'rgb(86, 180, 233)',
  'rgb(0, 158, 115)',
  'rgb(240, 228, 66)',
  'rgb(0, 114, 178)',
  'rgb(213, 94, 0)',
  'rgb(204, 121, 167)'
];
