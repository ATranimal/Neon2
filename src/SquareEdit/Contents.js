/** @module UnifiedEdit/EditContents */

import PunctumIcon from '../img/punctum.png';
import VirgaIcon from '../img/virga.png';
import DiamondIcon from '../img/diamond.png';
// import WhitePunctumIcon from "./img/white_punct.png";
// import QuilismaIcon from "./img/quilisma.png";
import CustosIcon from '../img/custos.png';
import CClefIcon from '../img/cClef.png';
import FClefIcon from '../img/fClef.png';
import StaffIcon from '../img/staff.png';
// import SmallDivIcon from "./img/smallDiv.png";
// import MinorDivIcon from "./img/minorDiv.png";
// import MajorDivIcon from "./img/majorDiv.png";
// import FinalDivIcon from "./img/finalDiv.png";
import PesIcon from '../img/pes.png';
import ClivisIcon from '../img/clivis.png';
import ScandicusIcon from '../img/scandicus.png';
import ClimacusIcon from '../img/climacus.png';
import TorculusIcon from '../img/torculus.png';
import PorrectusIcon from '../img/porrectus.png';
import PressusIcon from '../img/pressus.png';
import Icons from '../img/icons.svg';

/**
 * HTML for each insert tab (neume, grouping, clef, system, and division).
 * @type {object}
 */
export const insertTabHtml = {
  primitiveTab: "<p class='control'>" +
        "<button id='punctum' class='button insertel smallel' title='punctum'><img src='" + PunctumIcon + "' class='image'/></button></p>" +
        "<p class='control'>" +
        "<button id='virga' class='button insertel smallel' title='virga'><img src='" + VirgaIcon + "' class='image'/></button></p>" +
        "<p class='control'>" +
        "<button id='diamond' class='button insertel smallel' title='inclinatum'><img src='" + DiamondIcon + "' class='image'/></button></p>" +
  /*  "<p class='control'>" +
        "<button id='white_punct' class='button insertel smallel' title='white punctum'><img src='" + WhitePunctumIcon + "' class='image'/></button></p>" +
        "<p class='control'>" +
        "<button id='quilisma' class='button insertel smallel' title='quilisma'><img src='" + QuilismaIcon + "' class='image'/></button></p>" + */
        "<p class='control'>" +
        "<button id='custos' class='button insertel smallel' title='custos'><img src='" + CustosIcon + "' class='image'/></button></p>" +
        "<p class='control'>" +
        "<button id='cClef' class='button insertel smallel' title=' C Clef'><img src='" + CClefIcon + "' class='image' /></button></p>" +
        "<p class='control'>" +
        "<button id='fClef' class='button insertel smallel' title='F Clef'><img src='" + FClefIcon + "' class='image'/></button></p>",
  groupingTab: "<p class='control'>" +
        "<button id='pes' class='button insertel smallel' title='pes'><img src='" + PesIcon + "' class='image'/></button></p>" +
        "<p class='control'>" +
        "<button id='clivis' class='button insertel smallel' title='clivis'><img src='" + ClivisIcon + "' class='image'/></button></p>" +
        "<p class='control'>" +
        "<button id='scandicus' class='button insertel smallel' title='scandicus'><img src='" + ScandicusIcon + "' class='image'/></button></p>" +
        "<p class='control'>" +
        "<button id='climacus' class='button insertel smallel' title='climacus'><img src='" + ClimacusIcon + "' class='image'/></button></p>" +
        "<p class='control'>" +
        "<button id='torculus' class='button insertel smallel' title='toculus'><img src='" + TorculusIcon + "' class='image'/></button></p>" +
        "<p class='control'>" +
        "<button id='porrectus' class='button insertel smallel' title='porrectus'><img src='" + PorrectusIcon + "' class='image'/></button></p>" +
        "<p class='control'>" +
        "<button id='pressus' class='button insertel smallel' title='pressus'><img src='" + PressusIcon + "' class='image'/></button></p>",
  systemTab: "<p class='control'>" +
        "<button id='staff' class='button insertel longel' title='system'><img src='" + StaffIcon + "' class='image' /></button></p>" +
        '<p>Click upper left and lower right corners of new staff.</p>'
  // divisionTab: "<p class='control'>" +
  //     "<button id='smallDiv' class='button insertel tallel'><img src='" + SmallDivIcon + "' class='image'/></button></p>" +
  //     "<p class='control'>" +
  //     "<button id='minorDiv' class='button insertel tallel'><img src='" + MinorDivIcon +"' class='image'/></button></p>" +
  //     "<p class='control'>" +
  //     "<button id='majorDiv' class='button insertel tallel'><img src='" + MajorDivIcon + "' class='image'/></button></p>" +
  //     "<p class='control'>" +
  //     "<button id='finalDiv' class='button insertel tallel'><img src='" + FinalDivIcon + "' class='image'/></button></p>"
};

/**
 * Structure of insert panel with basic grouping tabs.
 * @type {string}
 */
export const insertControlsPanel =
    "<p class='panel-heading' id='insertMenu'>Insert" +
    "<svg class='icon is-pulled-right'><use id='toggleInsert' xlink:href='" + Icons + "#dropdown-down'></use></svg></p>" +
    "<div id='insertContents' style='overflow-y: hidden;'>" +
    "<p class='panel-tabs'>" +
    "<a id='primitiveTab' class='insertTab'>Primitive Elements</a>" +
    "<a id='groupingTab' class='insertTab'>Grouping</a>" +
    "<a id='systemTab' class='insertTab'>System</a></p>" +
    // "<a id='divisionTab' class='insertTab'>Division</a></p>" +
    "<a class='panel-block has-text-centered'>" +
    "<div id='insert_data' class='field is-grouped buttons'/></a></div>";

/**
 * Contents of edit panel with buttons.
 * @type {string}
 */
export const editControlsPanel =
    "<p class='panel-heading' id='editMenu'>Edit" +
    "<svg class='icon is-pulled-right'><use id='toggleEdit' xlink:href='" + Icons + "#dropdown-down'></use></svg></p>" +
    "<div id='editContents'>" +
    "<a class='panel-block'>" +
    '<label>Select By:&nbsp;</label>' +
    "<div class='field has-addons buttons' style='overflow-x: auto;'>" +
    "<p class='control'>" +
    "<button class='button sel-by is-active' id='selBySyl'>Syllable</button></p>" +
    "<p class='control'>" +
    "<button class='button sel-by' id='selByNeume'>Neume</button></p>" +
    "<p class='control'>" +
    "<button class='button sel-by' id='selByNc'>Neume Component</button></p>" +
    "<p class='control'>" +
    "<button class='button sel-by' id='selByStaff'>Staff</button></p></div></a>" +
    "<div class='field is-grouped buttons'>" +
    "<p class='control'>" +
    "<a id='moreEdit' class='panel-block is-invisible'>" +
    "<a id='neumeEdit' class='panel-block is-invisible'></div>";

/**
 * Contents of extra nc action menu.
 * @type {string}
 */
export const ncActionContents =
        '<label>Change Head Shape:&nbsp;</label>' +
        "<div id='drop_select' class='dropdown'>" +
        "<div class='dropdown-trigger'>" +
        "<button id='select-options' class='button' aria-haspopup='true' aria-controls='dropdown-menu'>" +
        '<span>Head Shapes</span>' +
        "<svg class='icon'><use xlink:href='" + Icons + "#dropdown-down'></use></svg></button></div>" +
        "<div class='dropdown-menu' id='dropdown-menu' role='menu'>" +
        "<div class='dropdown-content'>" +
        "<a id='Punctum' class='dropdown-item'>Punctum</a>" +
        "<a id='Virga' class='dropdown-item'>Virga</a>" +
        "<a id='Inclinatum' class='dropdown-item'>Inclinatum</a></div></div></div>" +
        "<p class='control'>" +
        "<button class='button' id='delete'>Delete</button></p></div>";

/**
 * Contents of extra neume action menu.
 * @type {string}
 */
export const neumeActionContents =
        '<label>Change Grouping:&nbsp;</label>' +
        "<div id='drop_select' class='dropdown'>" +
        "<div class='dropdown-trigger'>" +
        "<button id='select-options' class='button' aria-haspopup='true' aria-controls='dropdown-menu'>" +
        '<span>Groupings</span>' +
        "<svg class='icon'><use xlink:href='" + Icons + "#dropdown-down'></use></svg></button></div>" +
        "<div class='dropdown-menu' id='dropdown-menu' role='menu'>" +
        "<div class='dropdown-content scrollable-dropdown'>" +
        "<a id='Pes' class='dropdown-item grouping'>Pes</a>" +
        "<a id='Pes subpunctis' class='dropdown-item grouping'>Pes Subpunctis</a>" +
        "<a id='Clivis' class='dropdown-item grouping'>Clivis</a>" +
        "<a id='Scandicus' class='dropdown-item grouping'>Scandicus</a>" +
        "<a id='Scandicus flexus' class='dropdown-item grouping'>Scandicus Flexus</a>" +
        "<a id='Scandicus subpunctis' class='dropdown-item grouping'>Scandicus Subpunctis</a>" +
        "<a id='Climacus' class='dropdown-item grouping'>Climacus</a>" +
        "<a id='Climacus resupinus' class='dropdown-item grouping'>Climacus Resupinus</a>" +
        "<a id='Torculus' class='dropdown-item grouping'>Torculus</a>" +
        "<a id='Torculus resupinus' class='dropdown-item grouping'>Torculus Resupinus</a>" +
        "<a id='Porrectus' class='dropdown-item grouping'>Porrectus</a>" +
        "<a id='Porrectus flexus' class='dropdown-item grouping'>Porrectus Flexus</a>" +
        "<a id='Porrectus subpunctis' class='dropdown-item grouping'>Porrectus Subpunctis</a>" +
        "<a id='Pressus' class='dropdown-item grouping'>Pressus</a>" +
        '</div></div></div>' +
        "<div><p class='control'>" +
        "<button class='button' id='ungroupNcs'>Ungroup</button>" +
        "<button class='button' id='delete'>Delete</button></p></div>";

/**
 * Contents of extra staff action menu.
 * @type {string}
 */
export const staffActionContents =
    '<label>Merge Systems:&nbsp;</label>' +
    "<div><p class='control'>" +
    "<button id='merge-systems' class='button'>Merge</button>" +
    "<button class='button' id='delete'>Delete</button></p></div>";

/**
 * Contents of default action menu.
 * @type {string}
 */
export const defaultActionContents =
    "<div><p class='control'>" +
    "<button class='button' id='delete'>Delete</button></p></div>";

/**
 * Contents of split action menu.
 * @type {string}
 */
export const splitActionContents =
    '<label>Split System:&nbsp;</label>' +
    "<div><p class='control'>" +
    "<button id='split-system' class='button'>Split</button>" +
    "<button class='button' id='delete'>Delete</button></p></div>";

/**
 * Contents of extra clef action menu.
 * @type {string}
 */
export const clefActionContents =
    '<label>Change Clef Shape:&nbsp;</label>' +
    "<div id='drop_select' class='dropdown'>" +
    "<div class='dropdown-trigger'>" +
    "<button id='select-options' class='button' aria-haspopup='true' aria-controls='dropdown-menu'>" +
    '<span>Clef Shapes</span>' +
    "<svg class='icon'><use xlink:href='" + Icons + "#dropdown-down'></use></svg></button></div>" +
    "<div class='dropdown-menu' id='dropdown-menu' role='menu'>" +
    "<div class='dropdown-content'>" +
    "<a id='CClef' class='dropdown-item'>C Clef</a>" +
    "<a id='FClef' class='dropdown-item'>F Clef</a></div></div>" +
    "<button class='button' id='delete'>Delete</button></div>";

/**
 * HTML for grouping selection menu.
 * @type {object}
 */
export const groupingMenu = {
  'nc': "<div class='field is-grouped'>" +
        "<div><p class='control'>" +
        "<button class='button' id='groupNcs'>Group Neume Components</button>" +
        "<button class='button' id='delete'>Delete</button></p></div>",
  'neume': "<div class='field is-grouped'>" +
        "<div><p class='control'>" +
        "<button class='button' id='groupNeumes'>Group Neumes</button>" +
        "<button class='button' id='delete'>Delete</button></p></div>",
  'syl': "<div class='field is-grouped'>" +
        "<div><p class='control'>" +
        "<button class='button' id='mergeSyls'>Merge Syllables</button>" +
        "<button class='button' id='delete'>Delete</button></p></div>",
  'ligatureNc': "<div class='field is-grouped'>" +
        "<div><p class='control'>" +
        "<button class='button' id='groupNcs'>Group Neume Components</button></p></div>" +
        "<div><p class='control'>" +
        "<button class='button' id='toggle-ligature'>Toggle Ligature</button>" +
        "<button class='button' id='delete'>Delete</button></p></div></div>",
  'ligature': "<div class='field is-grouped'>" +
        "<div><p class='control'>" +
        "<button class='button' id='toggle-ligature'>Toggle Ligature</button>" +
        "<button class='button' id='delete'>Delete</button></p></div></div>",
  'splitSyllable': "<div class='field is-grouped'>" +
        "<div><p class='control'>" +
        "<button class='button' id='toggle-link'>Toggle Linked Syllables</button>" +
        "<button class='button' id='delete'>Delete</button></p></div></div>"
};
