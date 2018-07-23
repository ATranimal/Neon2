import DragHandler from "./DragHandler.js";
import GroupingHandler from "./GroupingHandler.js";
import Navbar from "./Navbar.js";
import Select from "./Select.js";
import CursorHandler from "./CursorHandler.js";
import InsertControls from "./InsertControls.js";
import InsertHandler from "./InsertHandler.js";
import DragSelect from "./DragSelect.js"
import SelectOptions from "./SelectOptions.js";
import Icons from "./img/icons.svg";

/**
 * Creates user interface for editing and creates necessary tools.
 * @constructor
 * @param {NeonView} neonView - The NeonView parent object.
 * @param {string} meiFile - The path to the MEi file.
 * @param {module:ZoomHandler~ZoomHandler} zoomHandler - The ZoomHandler object.
 */
function EditMode (neonView, meiFile, zoomHandler){
    var dragHandler = null;
    var groupingHandler = null;
    var navbarHandler = null;
    var selectOptions = null;
    var select = null;
    var insertControls = null;
    var cursorHandler = null;
    var dragSelect = null;
    var insertHandler = null;
    // var vbHeight = null;
    // var vbWidth = null;


    // Set edit mode listener
    $("#edit_mode").on("click", function(){
        $("#dropdown_toggle").empty();
        $("#dropdown_toggle").append(  
            "<div class='navbar-item has-dropdown is-hoverable'><a class='navbar-link'>File</a>" +
            "<div class='navbar-dropdown'>" +
            "<a id='getmei' class='navbar-item' href='' download=''> Download MEI </a>" +
            "<a id='getpng' class='navbar-item' href='' download=''> Download PNG </a>" +
            "<a id='revert' class='navbar-item' href=''> Revert </a>"
        );
        $("#insert_controls").append(
            "<p class='panel-heading' id='insertMenu'>Insert" +
            "<svg class='icon is-pulled-right'><use id='toggleInsert' xlink:href='" + Icons + "#dropdown-up'></use></svg></p>" +
            "<div id='insertContents'>" +
            "<p class='panel-tabs'>" +
            "<a id='neumeTab' class='insertTab'>Neume</a>" +
            "<a id='groupingTab' class='insertTab'>Grouping</a>" +
            "<a id='clefTab' class='insertTab'>Clef</a>" +
            "<a id='systemTab' class='insertTab'>System</a>" +
            "<a id='divisionTab' class='insertTab'>Division</a></p>" +
            "<a class='panel-block has-text-centered'>" +
            "<div id='insert_data' class='field is-grouped'/></a></div>"
        );
        $("#edit_controls").append(
            "<p class='panel-heading' id='editMenu'>Edit" +
            "<svg class='icon is-pulled-right'><use id='toggleEdit' xlink:href='" + Icons + "#dropdown-up'></use></svg></p>" +
            "<div id='editContents'>" +
            "<a class='panel-block'>" +
            "<label>Select By:&nbsp;</label>" +
            "<div class='field has-addons'>" +
            "<p class='control'>" + 
            "<button class='button sel-by is-active' id='selBySyl'>Syllable</button></p>" +
            "<p class='control'>" + 
            "<button class='button sel-by' id='selByNeume'>Neume</button></p>" +
            "<p class='control'>" +
            "<button class='button sel-by' id='selByNc'>Neume Component</button></p>" +
            "<p class='control'>" +
            "<button class='button sel-by' id='selByStaff'>Staff</button></p></div></a>" +
            "<a class='panel-block'>" + 
            "<div class='field is-grouped'>" +
            "<p class='control'>" +
            "<button class='button' id='undo'>Undo</button></p>" +
            "<p class='control'>" +
            "<button class='button' id='redo'>Redo</button></p>" +
            "<p class='control'>" +
            "<button class='button' id='save'>Save Changes</button></p>" +
            "<p class='control'>" +
            "<button class='button' id='delete'>Delete</button></p></div></a>" +
            "<a id='moreEdit' class='panel-block is-invisible'>" + 
            "<a id='neumeEdit' class='panel-block is-invisible'></div>"
        );

        init();
    })

    /**
     * Initialize handlers and controls and create event listeners.
     */
    function init() {
        dragHandler = new DragHandler(neonView);
        groupingHandler = new GroupingHandler(neonView);
        navbarHandler = new Navbar(meiFile);
        selectOptions = new SelectOptions(neonView, groupingHandler);
        select = new Select(neonView, dragHandler, selectOptions);
        cursorHandler = new CursorHandler();
        insertHandler = new InsertHandler(neonView);
        insertControls = new InsertControls(cursorHandler, insertHandler);
        dragSelect = new DragSelect(neonView, dragHandler, zoomHandler, groupingHandler, selectOptions);

        $("#toggleInsert").on("click", () => {
            if ($("#insertContents").is(":hidden")) {
                $("#insertContents").css("display", "");
                $("#toggleInsert").attr("xlink:href", Icons + "#dropdown-up");
            } else {
                $("#insertContents").css("display", "none");
                $("#toggleInsert").attr("xlink:href", Icons + "#dropdown-down");
            }
        });

        $("#toggleEdit").on("click", () => {
            if ($("#editContents").is(":hidden")) {
                $("#editContents").css("display", "");
                $("#toggleEdit").attr("xlink:href", Icons + "#dropdown-up");
            } else {
                $("#editContents").css("display", "none");
                $("#toggleEdit").attr("xlink:href", Icons + "#dropdown-down");
            }
        });

        $("#undo").on("click", () => {
            if (!neonView.undo()) {
                console.error("Failed to undo action");
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
     * Reset select event listeners.
     */
    function resetListeners() {
        select.selectListeners();
    }

    ////// TODO: pass to cursorHandler to scale insert image ///////
    // function getScale() {
    //     var viewBox = d3.select("#svg_group").attr("viewBox");
    //     vbHeight = parseInt(viewBox.split(" ")[3]);
    //     vbWidth = parseInt(viewBox.split(" ")[2]);
    // }

    EditMode.prototype.resetListeners = resetListeners;
    // EditMode.prototype.getScale = getScale;
}

export {EditMode as default};
