// Do all the dropdown stuff here including dialogue box

$(function () {
    // add children to #font dropdown
    let fontList = [
        {
            fontName: "helvetica", // Font name to use in CSS
            fontDisplay: "Helvetica", // Font name to display in the dropdown menu
            style: "sans-serif" // Backup to display if the font is not installed on the display device
        },
        {
            fontName: "arial",
            fontDisplay: "Arial",
            style: "sans-serif"
        },
        {
            fontName: "arial black",
            fontDisplay: "Arial Black",
            style: "sans-serif"
        },
        {
            fontName: "verdana",
            fontDisplay: "Verdana",
            style: "sans-serif"
        },
        {
            fontName: "Tahoma",
            fontDisplay: "Tahoma",
            style: "sans-serif"
        },
        {
            fontName: "trebuchet ms",
            fontDisplay: "Trebuchet MS",
            style: "sans-serif"
        },
        {
            fontName: "impact",
            fontDisplay: "Impact",
            style: "sans-serif"
        },
        {
            fontName: "gill sans",
            fontDisplay: "Gill Sans",
            style: "sans-serif"
        },
        {
            fontName: "times new roman",
            fontDisplay: "Times New Roman",
            style: "serif"
        },
        {
            fontName: "georgia",
            fontDisplay: "Georgia",
            style: "serif"
        },
        {
            fontName: "palatino",
            fontDisplay: "Palatino",
            style: "serif"
        },
        {
            fontName: "baskerville",
            fontDisplay: "Baskerville",
            style: "serif"
        },
        {
            fontName: "andale mono",
            fontDisplay: "Andalé Mono",
            style: "monospace"
        },
        {
            fontName: "courier",
            fontDisplay: "Courier",
            style: "monospace"
        },
        {
            fontName: "lucidia console",
            fontDisplay: "Lucida Console",
            style: "monospace"
        },
        {
            fontName: "bradley hand",
            fontDisplay: "Bradley Hand",
            style: "cursive"
        },
        {
            fontName: "brush script mt",
            fontDisplay: "Brush Script MT",
            style: "cursive"
        },
        {
            fontName: "luminari",
            fontDisplay: "Luminari",
            style: "fantasy"
        },
        {
            fontName: "comic sans ms",
            fontDisplay: "Comic Sans",
            style: "cursive"
        }
    ];
    let fontDropdown = $("#font");
    fontList.forEach(listItem => {
        // Add new option element to dropdown
        fontDropdown.append(new Option(listItem.fontDisplay, listItem.fontName));
    });
    let sizeDropdown = $("#size");
    for (var i = 8; i <= 48; i++) {
        sizeDropdown.append(new Option(i.toString(), i));
    }

    // Line width dropdown
    for (let i = 1; i < 10; i++) {
        $("#lineWidth").append(new Option(i,i));
    }
    // Color dropdown
    colors = ["#FF0000","#FF7F00","#FFFF00", "#00FF00", "#0000FF", "#4B0082", "#9400D3", "#FFC0CB", "#964B00", "#FFFFFF", "#000000"];
    colors.forEach(color => {
        $("#strokeColor").append(new Option("  ", color)).find("option:last").css({"background-color": color});
        $("#fillColor").append(new Option("  ", color)).find("option:last").css({"background-color": color});;
    });
});