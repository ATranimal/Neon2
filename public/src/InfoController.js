function InfoController(vrvToolkit) {

    // This function updates the neume information box in the editor
    function updateInfo(id) {
        // For now, since Clefs do not have their own element tag in mei4, there is not a way to select the <g> element
        // So we will simply return if ID does not exist for now
        if (id == "") {
            $("#neume_info").empty();
            console.log("No id!");
            return;
        }

        var element = d3.select("#" + id);
        var elementClass = element.attr("class");
        var body = "";

        // Gets the pitches depending on element type and 
        switch(elementClass) {
            case "neume":
                var ncs = element.selectAll('.nc');
                var pitches = [];
                ncs.each( function () {
                    var ncId = d3.select(this).attr("id");
                    var ncPitch = vrvToolkit.getElementAttr(ncId).pname;
                    pitches.push(ncPitch);
                })
                // TODO: Somehow get the grouping name from verovio? Requires quite a bit of refactoring in verovio for this though
                body += "Pitch(es): " + pitches;
                break;
            case "custos":
                body += "Pitch: " + vrvToolkit.getElementAttr(id).pname;
                break;
            default:
                body += "";
                break;
        }

        // Resetting info box then adding relevant info
        $("#neume_info").empty();
        $("#neume_info").append(
            "<article class='message'>" +
            "<div class='message-header'> <p>" + elementClass + "</p> <button id='notification-delete' class='delete' aria-label='delete'></button> </div>" +
            "<div class='message-body'>" + body + "</div> </article>"
        );

        // Setting up listener for dismissing message
        $("#notification-delete").on("click", function() {
            $("#neume_info").empty();
        })
    }

    InfoController.prototype.updateInfo = updateInfo;
}