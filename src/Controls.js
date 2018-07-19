/** @module Controls */

import * as Color from "./Color.js";
import * as Contents from "./Contents.js";
import * as Cursor from "./Cursor.js";

/** @type {module:Zoom~ZoomHandler} */
var zoomHandler;

/**
 * Initialize listeners and controls for display panel.
 * @param {module:Zoom~ZoomHandler} zHandler - An instantiated ZoomHandler.
 */
export function initDisplayControls (zHandler) {
    zoomHandler = zHandler;

    setZoomControls();
    setOpacityControls();
    setBackgroundOpacityControls();
    setSylControls();
    setHighlightControls();

    $("#displayHeader").on("click", () => {
        if ($("#displayContents").is(":hidden")) {
            $("#displayContents").css("display", "");
        }
        else {
            $("#displayContents").css("display", "none");
        }
    });
}

/**
 * Set zoom control listener for button and slider
 */
function setZoomControls() {
    $("#reset-zoom").click(() => {
        $("#zoomOutput").val(100);
        $("#zoomSlider").val(100);
        zoomHandler.resetZoomAndPan();
    });

    $(document).on("input change", "#zoomSlider", () => {
        zoomHandler.zoomTo($("#zoomOutput").val() / 100.0);
    });
}

/**
 * Set rendered MEI opacity button and slider listeners.
 */
function setOpacityControls() {
    $("#reset-opacity").click( function() {
        // Definition scale is the root element of what is generated by verovio
        $(".definition-scale").css("opacity", 1);

        $("#opacitySlider").val(100);
        $("#opacityOutput").val(100);
    });

    $(document).on('input change', '#opacitySlider', setOpacityFromSlider);
}

/** * Set background image opacity button and slider listeners.
 */
function setBackgroundOpacityControls() {
    $("#reset-bg-opacity").click( function() {
        $("#bgimg").css("opacity", 1);

        $("#bgOpacitySlider").val(100);
        $("#bgOpacityOutput").val(100);
    });

    $(document).on('input change', '#bgOpacitySlider', function () {
        $("#bgimg").css("opacity", $("#bgOpacityOutput").val() / 100.0);
    });
}

/**
 * Set listener on syllable visibility checkbox.
 */
export function setSylControls() {
    updateSylVisibility();
    $("#displayText").click(updateSylVisibility);
}

/**
 * Update MEI opacity to value from the slider.
 */
export function setOpacityFromSlider() {
    $(".definition-scale").css("opacity", $("#opacityOutput").val() / 100.0);
};


/**
 * Set listener on staff highlighting checkbox.
 */
export function setHighlightControls() {
    updateHighlight();
    $("#highlightStaves").click(updateHighlight);
}

export function updateSylVisibility() {
    if ($("#displayText").is(":checked")) {
        $(".syl").css("visibility", "visible");
    } else {
        $(".syl").css("visibility", "hidden");
    }
}

export function updateHighlight() {
    if ($("#highlightStaves").is(":checked")) {
        Color.setStaffHighlight();
    } else {
        Color.unsetStaffHighlight();
    }
}


/**
 * Initialize Edit and Insert control panels.
 * @param {NeonView} neonView - The NeonView parent.
 */
export function initInsertEditControls(neonView) {
    $("#insertMenu").on("click", () => {
        if ($("#insertContents").is(":hidden")) {
            $("#insertContents").css("display", "");
        } else {
            $("#insertContents").css("display", "none");
        }
    });

    $("#editMenu").on("click", () => {
        if ($("#editContents").is(":hidden")) {
            $("#editContents").css("display", "");
        } else {
            $("#editContents").css("display", "none");
        }
    });

    $("#undo").on("click", () => {
        if (!neonView.undo()) {
            console.error("Failed to undo action.");
        } else {
            neonView.refreshPage();
        }
    });

    $("#redo").on("click", () => {
        if (!neonView.redo()) {
            console.error("Failed to redo action");
        } else {
            neonView.refreshPage();
        }
    });

    $("#save").on("click", () => {
        neonView.saveMEI();
    });

    $("#delete").on("click", () => {
        let toRemove = [];
        var selected = Array.from(document.getElementsByClassName("selected"));
        selected.forEach(elem => {
            toRemove.push(
                {
                    "action": "remove",
                    "param": {
                        "elementId": elem.id
                    }
                }
            );
        });
        let chainAction = {
            "action": "chain",
            "param": toRemove
        };
        neonView.edit(chainAction);
        neonView.refreshPage();
    });
}

/**
 * Bind listeners to insert tabs.'
 * @param {InsertHandler} insertHandler - An InsertHandler to run the tasks.
 */
export function bindInsertTabs(insertHandler) {
    var insertTabs = $(".insertTab");
    var tabIds = $.map(insertTabs, function(tab, i) {
        return tab.id;
    });

    $.each(tabIds, function(i, tab) {
        $("#" + tab).on("click", () => {
            deactivate(".insertTab");
            activate(this.id, insertHandler);
            Cursor.resetCursor();
            $("#insert_data").empty();
            $("#insert_data").append(Contents.insertTabHtml[tab]);
            bindElements(insertHandler);
        });
    });
}

/**
 * Bind listeners to insert tab elements.
 * @param {InsertHandler} insertHandler - An InsertHandler object.
 */
function bindElements(insertHandler) {
    var insertElements = $(".insertel");
    var elementIds = $.map(insertElements, function(el, i){
        return el.id;
    });
    $.each(elementIds, function(i, el){
        $('#' + el).on('click', function(){
            deactivate('.insertel');
            activate(el, insertHandler);  
            Cursor.updateCursor();
        });
    });
}

/**
 * Activate a certain insert action.
 * @param {string} id - The ID of the insert action tab.
 * @param {InsertHandler} insertHandler - An InsertHandler object.
 */
function activate(id, insertHandler) {
    $("#" + id).addClass("is-active");
    insertHandler.insertActive(id);
}

/**
 * Deactivate a certain insert action.
 * @param {string} type - A JQuery selector for the action tab.
 */
function deactivate(type) {
    var elList = $(type);
    for (var i=0; i < elList.length; i++) {
        if(elList[i].classList.length > 1) {
            elList[i].classList.remove("is-active");
        }
    }
}

/**
 * Set listener on switching EditMode button to File dropdown in the navbar.
 * @param {string} filename - The name of the MEI file.
 */
export function initNavbar(filename) {
    // setup navbar listeners 
    $("#revert").on("click", function(){
        if (confirm("Reverting will cause all changes to be lost. Press OK to continue.")) {
            $.ajax({ 
                url: "/revert/" + filename, 
                type: "POST"
            })
        }
    });

    //mei download link
    $("#getmei").attr("href", filename);

    //png download setup
    var pngFile = filename.split('.', 2)[0] + ".png";
    $("#getpng").attr("href", pngFile);
}

/**
 * Set listener on EditMode button.
 * @param {EditMode} editMode - The EditMode object.
 */
export function initEditMode(editMode) {
    $("#edit_mode").on("click", function(){
        $("#dropdown_toggle").empty();
        $("#dropdown_toggle").append(Contents.navbarDropdownMenu);
        $("#insert_controls").append(Contents.insertControlsPanel);
        $("#edit_controls").append(Contents.editControlsPanel);

        editMode.init();
    });
}

/**
 * Set listeners on the buttons to change selection modes.
 */
export function initSelectionButtons() {
    $("#selByNeume").on("click", function(){
        if (!$("#selByNeume").hasClass("is-active")){
            $("#selByNeume").addClass("is-active");
            $("#selByNc").removeClass("is-active");
            $("#selByStaff").removeClass("is-active");
        }           
    });

    $("#selByNc").on("click", function(){
        if (!$("#selByNc").hasClass("is-active")) {
            $("#selByNc").addClass("is-active");
            $("#selByNeume").removeClass("is-active");
            $("#selByStaff").removeClass("is-active");
        }
    });

    $("#selByStaff").on("click", function () {
        if (!$("#selByStaff").hasClass("is-active")) {
            $("#selByStaff").addClass("is-active");
            $("#selByNc").removeClass("is-active");
            $("#selByNeume").removeClass("is-active");
        }
    });
}
