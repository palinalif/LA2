function Shape(position) {
    this.position=position;
    this.strokeWidth = drawio.selectedLineWidth;
    this.strokeColor = drawio.selectedStrokeColor;
    this.fillColor = drawio.selectedFillColor;
    this.shapeFilled = drawio.shapeFilled;
}

Shape.prototype.render = function () {

}
Shape.prototype.move = function (position) {
    this.position = position;
}
Shape.prototype.resize = function () {}

Shape.prototype.setStyle = function () {
    drawio.ctx.lineWidth = this.strokeWidth;
    drawio.ctx.strokeStyle = this.strokeColor;
    drawio.ctx.fillStyle = this.fillStyle;
}

Shape.prototype.mouseOver = function (x,y) {}

Shape.prototype.movePosition = function (x,y) {}

// RECTANGLE
function Rectangle(position, width, height) {
    Shape.call(this, position);
    this.shapeType = drawio.availableShapes.RECTANGLE;
    this.width = width;
    this.height = height;
}
Rectangle.prototype = Object.create(Shape.prototype);
Rectangle.prototype.constructor(Rectangle);
Rectangle.prototype.render = function () {
    if (this.shapeFilled) {
        drawio.ctx.fillStyle = this.fillColor;
        drawio.ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
    else {
        this.setStyle();
        drawio.ctx.strokeRect(this.position.x, this.position.y, this.width, this.height);
    }
}
Rectangle.prototype.resize = function(x,y) {
    this.width = x-this.position.x;
    this.height = y-this.position.y;
}

Rectangle.prototype.mouseOver = function (x,y) {
    if (x >= this.position.x && x <= (this.position.x+this.width) && y >= this.position.y && y <= (this.position.y+this.height)) {
        return true;
    }
    return false;
}

Rectangle.prototype.movePosition = function(x,y) {
    this.position = {x: x-(this.width/2), y: y-(this.height/2)};
}

// LINE
function Line(startPosition, endPosition) {
    Shape.call(this, startPosition);
    this.shapeType = drawio.availableShapes.LINE;
    this.endPosition = endPosition;
}
Line.prototype = Object.create(Shape.prototype);
Line.prototype.constructor(Line);
Line.prototype.render = function () {
    // Render a line
    drawio.ctx.beginPath();
    this.setStyle();
    drawio.ctx.moveTo(this.position.x, this.position.y);
    drawio.ctx.lineTo(this.endPosition.x, this.endPosition.y);
    drawio.ctx.stroke();
}
Line.prototype.resize = function(x,y) {
    this.endPosition = {x: x, y: y}
}

Line.prototype.mouseOver = function (x,y) {
    let threshold = 5; // how many pixels of wiggle room it has
    // Formula for the distance of a point to a line
    let distance = Math.abs((this.endPosition.y - this.position.y) * x - (this.endPosition.x - this.position.x) * y + this.endPosition.x * this.position.y - this.endPosition.y * this.position.x) / Math.sqrt(Math.pow(this.endPosition.y - this.position.y, 2) + Math.pow(this.endPosition.x - this.position.x, 2));
    if (distance <= threshold) {
        return true;
    }
    return false;
}

Line.prototype.movePosition = function (x,y) {
    let dx = x - this.position.x;
    let dy = y - this.position.y;
    this.position.x = x;
    this.position.y = y;
    this.endPosition.x += dx;
    this.endPosition.y += dy;
}

// PEN
function Pen(position) {
    Shape.call(this, position);
    this.shapeType = drawio.availableShapes.PEN;
    this.points = [position];
}
Pen.prototype = Object.create(Shape.prototype);
Pen.prototype.constructor(Pen);
Pen.prototype.render = function () {
    // Render a line
    drawio.ctx.beginPath();
    this.setStyle();
    drawio.ctx.moveTo(this.position.x, this.position.y);
    this.points.forEach(point => {
        drawio.ctx.lineTo(point.x, point.y);
    });
    drawio.ctx.stroke();
}
Pen.prototype.resize = function(x,y) {
    this.points.push({x: x, y: y});
}

Pen.prototype.mouseOver = function (x,y) {
    drawio.ctx.moveTo(this.position.x, this.position.y);
    this.points.forEach(point => {
        drawio.ctx.lineTo(point.x, point.y);
    });
    if (drawio.ctx.isPointInPath(x,y)) {
        return true;
    }
    return false;
}

Pen.prototype.movePosition = function (x,y) {
    // Get distance between first point and mouse cursor
    let dx = x - this.points[0].x;
    let dy = y - this.points[0].y;

    this.points.forEach(point => {
        point.x = this.points[0].x + (point.x - this.points[0].x) + dx;
        point.y = this.points[0].y + (point.y - this.points[0].y) + dy;
    });
}

// CIRCLE
function Circle(position, width, height) {
    Shape.call(this, position);
    this.shapeType = drawio.availableShapes.CIRCLE;
    this.width = width;
    this.height = height;
}
Circle.prototype = Object.create(Shape.prototype);
Circle.prototype.constructor(Circle);

Circle.prototype.createCirclePath = function() {
    let radiusX = ((this.position.x + this.width) - this.position.x) * 0.5;
    let radiusY = ((this.position.y + this.height) - this.position.y) * 0.5;
    let centerX = this.position.x + radiusX;
    let centerY = this.position.y + radiusY;

    let angle = Math.PI * 2 - 0.01;

    let circlePath = drawio.ctx.beginPath();
    drawio.ctx.moveTo(centerX + radiusX * Math.cos(0),
    centerY + radiusY * Math.sin(0));

    for (let i = 0; i < angle; i+=0.01) {
        drawio.ctx.lineTo(centerX + radiusX * Math.cos(i),
                   centerY + radiusY * Math.sin(i));
    }
    drawio.ctx.closePath();
    return circlePath;
}

Circle.prototype.render = function () {
    // Render a circle/oval within the rectangle
    let circlePath = this.createCirclePath();
    if (this.shapeFilled) {
        drawio.ctx.fillStyle = this.fillColor;
        drawio.ctx.fill(circlePath);
    }
    else {
        this.setStyle();
        drawio.ctx.stroke();
    }
}
Circle.prototype.resize = function(x,y) {
    this.width = x-this.position.x;
    this.height = y-this.position.y;
}

Circle.prototype.mouseOver = function (x,y) {
    this.createCirclePath();
    if (drawio.ctx.isPointInPath(x,y)) {
        return true;
    }
    return false;
}

Circle.prototype.movePosition = function (x,y) {
    this.position = {x: x-(this.width/2), y: y-(this.height/2)}; // The divisions are to make sure it's moved from the center and not a corner
}

// TEXT
function Text(position, textOptions) {
    Shape.call(this, position);
    this.shapeType = drawio.availableShapes.TEXT;
    this.position = position;
    this.text = textOptions.text;
    this.font = textOptions.font;
    this.fontSize = textOptions.fontSize;
    this.width = textOptions.fontSize * textOptions.text.length; // not super accurate, but good enough!
    this.height = 10;
}
Text.prototype = Object.create(Shape.prototype);
Text.prototype.constructor(Text);
Text.prototype.render = function () {
    // Render text
    this.setStyle();
    drawio.ctx.font = this.fontSize.toString() + "px " + this.font;
    drawio.ctx.fillText(this.text, this.position.x, this.position.y);
}
Text.prototype.mouseOver = function (x,y) {
    if (x >= this.position.x && x <= (this.position.x+this.width) && y <= this.position.y && y >= (this.position.y-this.height)) {
        return true;
    }
    return false;
}

Text.prototype.movePosition = function (x,y) {
    this.position = {x: x-(this.width/2), y: y-(this.height/2)};
}

