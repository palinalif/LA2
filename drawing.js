// Set drawing canvas width to the width of the screen
var canvas = document.getElementById("drawingCanvas");
var ctx = canvas.getContext("2d");

let drawmode="pen";
let color="FF0000";
let linewidth=5;

ctx.fillStyle=color;
ctx.strokeStyle=color; // should probably differentiate between the two but this is ok for now
ctx.lineWidth = linewidth;

// add mousedown, mousemove, and mouseup event listeners canvas here
canvas.addEventListener('mousedown', setPosition);
canvas.addEventListener('mousemove', setPosition);  
canvas.addEventListener('mouseenter', setPosition);

var pos = {"x": 0,"y": 0}

function setPosition(evt) {
    var rect = canvas.getBoundingClientRect();
    pos.x = evt.pageX- rect.x;
    pos.y = evt.pageY - rect.y;
}

// add some kind of queue here for redo/undo

function changeColor(elem) {
    return;
}
function changeLineWidth(elem) {
    return;
}
function changeDrawMode(elem) {
    drawmode=elem.value;
    switch (drawmode) {
        case "pen":
            let AC;
            function penUp() {
                canvas.removeEventListener('mousemove', drawPen);
                canvas.removeEventListener('mousedown', penDown);
                AC.abort();
            }
            function penDown() {
                AC = new AbortController();
                ctx.beginPath();
                ctx.moveTo(pos.x,pos.y);
                canvas.addEventListener('mousemove', drawPen, {signal: AC.signal});     
            }
            function drawPen() {
                ctx.lineTo(pos.x, pos.y);
                ctx.stroke();
            }
            canvas.addEventListener('mousedown', penDown);
            canvas.addEventListener('mouseleave', penUp);
            canvas.addEventListener('mouseup', penUp);
            break;
        case "circle":
            // use arc and stuff 
            break;
        case "rectangle":
            let rectAC;
            // Remove other event
            canvas.removeEventListener('mousedown', penDown);
            function rectDown() {
                rectAC = new AbortController()
                let startX = pos.x;
                let startY = pos.y;
                canvas.addEventListener('mousemove', function () {
                    drawRect(startX, startY);
                }, {signal: rectAC.signal});
            }
            canvas.addEventListener('mousedown', rectDown);
            canvas.addEventListener('mouseup', function () {
                rectAC.abort();
            });
            break;
        case "line":
            break;
        case "text":
            break;
        default:
            break;
    }
}

function drawRect(startX, startY) {
    ctx.fillRect(startX, startY, pos.x, pos.y);
}