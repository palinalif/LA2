window.drawio = {
    shapes: [],
    redoQueue: [],
    selectedShape: 'pen',
    shapeFilled: false,
    selectedLineWidth: 1,
    selectedStrokeColor: 'black',
    selectedFillColor: 'black',
    canvas: undefined,
    ctx: undefined,
    hoveredElement: null,
    selectedElement: null,
    moveElement: false,
    availableShapes: {
        RECTANGLE: 'rectangle',
        PEN: 'pen',
        LINE: 'line',
        CIRCLE: 'circle',
        TEXT: 'text'
    }
}

function changeDrawMode(elem) {
    if (elem.id == "circle-filled-button" || elem.id == "rectangle-filled-button") {
        drawio.shapeFilled = true;
    }
    else {
        drawio.shapeFilled = false;
    }
    drawio.selectedShape = elem.value;
}
function changeLineWidth(elem) {
    drawio.selectedLineWidth = elem.value;
}

function changeStrokeColor(elem) {
    drawio.selectedStrokeColor = elem.value;
    $("#strokeColor").css("background-color",elem.value);
}

function changeFillColor(elem) {
    drawio.selectedFillColor = elem.value;
    $("#fillColor").css("background-color",elem.value);
}

function undo() {
    if (drawio.shapes.length != 0) {
        let item = drawio.shapes.pop();
        drawio.redoQueue.push(item);
        drawCanvas();
    }
}

function redo() {
    if (drawio.redoQueue.length != 0) {
        let item = drawio.redoQueue.pop();
        drawio.shapes.push(item);
        drawCanvas();
    }
}

function save() {
    localStorage.setItem('shapes', JSON.stringify(drawio.shapes));
}

function load() {
    drawio.shapes = [];
    drawio.redoQueue = [];
    let shapes = JSON.parse(localStorage.getItem('shapes'));
    shapes.forEach(shape => {
        let newShape;
        switch (shape.shapeType) {
            case drawio.availableShapes.RECTANGLE:
                newShape = new Rectangle(shape.position, shape.width, shape.height);
                break;
            case drawio.availableShapes.CIRCLE:
                newShape = new Circle(shape.position, shape.width, shape.height);
                break;
            case drawio.availableShapes.LINE:
                newShape = new Line(shape.position, shape.endPosition);
                break;
            case drawio.availableShapes.PEN:
                newShape = new Pen(shape.position);
                newShape.points = shape.points;
                break;
            case drawio.availableShapes.TEXT:
                let textOptions = {
                    text: shape.text,
                    font: shape.font,
                    fontSize: shape.fontSize
                }
                newShape = new Text(shape.position, textOptions);
                break;
            default:
                break;
        }
        // Setting universal settings here so we don't repeat it for every shape
        newShape.strokeWidth = shape.strokeWidth;
        newShape.strokeColor = shape.strokeColor;
        newShape.fillColor = shape.fillColor;
        newShape.shapeFilled = shape.shapeFilled;
        drawio.shapes.push(newShape);
    });
    drawCanvas();
}

function drawCanvas() {
    drawio.ctx.clearRect(0,0,drawio.canvas.width, drawio.canvas.height);
    if (drawio.selectedElement) {
        drawio.selectedElement.render();
    }
    for (let i = 0; i < drawio.shapes.length; i++) {
        drawio.shapes[i].render();
    }
}

$(function () {
    drawio.canvas = document.getElementById('drawingCanvas');
    drawio.ctx = document.getElementById('drawingCanvas').getContext('2d');
    $("#drawingCanvas").on('mousedown', function (mouseEvent) {
        if (drawio.hoveredElement == null) {
            switch (drawio.selectedShape) {
                case drawio.availableShapes.RECTANGLE:
                    drawio.selectedElement = new Rectangle({x: mouseEvent.offsetX, y: mouseEvent.offsetY}, 0, 0)
                    break;
                case drawio.availableShapes.PEN:
                    drawio.selectedElement = new Pen({x: mouseEvent.offsetX, y: mouseEvent.offsetY});
                    break;
                case drawio.availableShapes.CIRCLE:
                    drawio.selectedElement = new Circle({x: mouseEvent.offsetX, y: mouseEvent.offsetY}, 0, 0);
                    break;
                case drawio.availableShapes.LINE:
                    drawio.selectedElement = new Line({x: mouseEvent.offsetX, y: mouseEvent.offsetY},{x: mouseEvent.offsetX, y: mouseEvent.offsetY})
                    break;
                case drawio.availableShapes.TEXT:
                    // These, annoyingly, also need to be global variables to be able to be changed here...
                    cursorX = mouseEvent.offsetX;
                    cursorY = mouseEvent.offsetY;
                    dialog.dialog( "open" );
                    break;
                default:
                    break;
            }
        }
        else {
            drawio.moveElement = true;
        }
    });

    $('#drawingCanvas').on('mousemove', function (mouseEvent) {
        drawCanvas();
        if (drawio.selectedElement) {
            drawio.selectedElement.resize(mouseEvent.offsetX, mouseEvent.offsetY);
        }
        else if (drawio.moveElement) {
            // move element on drag
            drawio.hoveredElement.movePosition(mouseEvent.offsetX, mouseEvent.offsetY);
        }
        else {
            // if the mouse hovers over an object, change the mouse cursor to the one with two arrows
            drawio.shapes.forEach(shape => {
                console.log(shape);
                if (shape.mouseOver(mouseEvent.offsetX, mouseEvent.offsetY)) {
                    drawio.canvas.style.cursor = "move";
                    drawio.hoveredElement = shape;
                }
                else {
                    drawio.canvas.style.cursor = "default";
                    drawio.hoveredElement = null;
                }
            });   
        }
    });

    $('#drawingCanvas').on('mouseup', function () {
        drawio.redoQueue = []; // Clear the redo queue if a new shape is drawn
        if (drawio.selectedElement != null && drawio.selectedShape != drawio.availableShapes.TEXT) {
            drawio.shapes.push(drawio.selectedElement);
            drawio.selectedElement=null;
        }
        drawio.moveElement = false;
    });
}
);