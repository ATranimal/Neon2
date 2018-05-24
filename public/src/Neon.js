function Neon (params) {

    //////////////
    // Constructor
    //////////////

    // Width/Height needs to be set based on MEI information in the future
    var pageWidth = 600;
    var pageHeight = 800;

    var vrvToolkit = new verovio.toolkit();
    var fileName = params.meifile;
    var zoomController = new ZoomController(this);
    var infoController = new InfoController(vrvToolkit);
    var controlsController = new ControlsController(zoomController);

    var vrvOptions = {
        pageWidth: pageWidth,
        pageHeight: pageHeight,
        noFooter: 1,
        noHeader: 1
    };
    vrvToolkit.setOptions(vrvOptions);
    
    $.get("/uploads/mei/" + fileName, function(data) {
        loadData(data);
        loadPage();
    });

    // Set keypress listener
    d3.select("body")
        .on("keydown", keydownListener)
        .on("keyup", () => {
            if (d3.event.key == "Shift") {
                d3.select("body").on(".drag", null);
            }
        });
    ////////////
    // Functions
    ////////////
    function loadData (data) {
        vrvToolkit.loadData(data);
        loadPage();
    }

    function loadPage () {
        var svg = vrvToolkit.renderToSVG(1);
        $("#svg_output").html(svg);
        d3.select("#svg_output").select("svg").attr("id", "svg_container");
        infoController.infoListeners();
    }

    function refreshPage () {
        var meiData = vrvToolkit.getMEI();
        loadData(meiData);
        zoomController.restoreTransformation();
    }

    function saveMEI() {
        var meiData = vrvToolkit.getMEI();
        $.ajax({
            type: "POST",
            url: "/save/" + fileName,
            data: {"meiData": meiData,
                    "fileName": fileName}
        }) 
    }

    function keydownListener () {
        var unit = 10;
        switch (d3.event.key) {
            case "Shift":
                d3.select("body").call(
                    d3.drag()
                        .on("start", zoomController.startDrag)
                        .on("drag", zoomController.dragging)
                );
                break;
            case "s":
                saveMEI();
                break;
            case "z":
                zoomController.zoom(1.25);
                break;
            case "Z":
                zoomController.zoom(0.80);
                break;
            default: break;
        }
    }
    
    // Constructor reference
    Neon.prototype.pageWidth = pageWidth;
    Neon.prototype.pageHeight = pageHeight;

    Neon.prototype.constructor = Neon;
    Neon.prototype.loadData = loadData;
    Neon.prototype.loadPage = loadPage;
    Neon.prototype.refreshPage = refreshPage;
    Neon.prototype.saveMEI = saveMEI;
}

