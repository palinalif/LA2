// Text dialogue stuff

$(function () {
    let form;

    function addText() {
        textOptions = {
            // get options from the dropdown menus here
            font: $("#font").val(),
            fontSize: $("#size").val(),
            text: $("#text").val()
        }
        drawio.selectedElement = new Text({x: cursorX, y: cursorY}, textOptions);
        drawio.shapes.push(drawio.selectedElement);
        drawio.selectedElement = null;
        drawCanvas();
        dialog.dialog( "close" );
    }
    // Defining dialog globally so it can be accessed 
    dialog = $( "#dialog-form" ).dialog({
        autoOpen: false,
        height: 250,
        width: 350,
        modal: true,
        buttons: {
        "Add text": addText,
        Cancel: function() {
            dialog.dialog( "close" );
        }
        },
        close: function() {
        form[ 0 ].reset();
        }
    });

    form = dialog.find( "form" ).on( "submit", function( event ) {
        event.preventDefault();
        addText();
    });
})