import MathService from "./math.service";

class Polygon {
    constructor(centerX, centerY, radius, numberOfAngles) {
        this._centerPoint = {
            x: centerX,
            y: centerY
        };
        this._vertices = [];
        this._radius = radius;
        this._numberOfAngles = numberOfAngles;
        this._isIntersected = false;
        this._intersections = [];
    }
    get vertices() {
        return this._vertices;
    }
    get centerPoint() {
        return this._centerPoint;
    }
    get isIntersected() {
        return this._isIntersected;
    }
    get intersections() {
        return this._intersections;
    }
    set isIntersected(value) {
        this._isIntersected = value;
    }

    initialize() {
        let firstAngle = -Math.PI / 2, x, y;
        this._vertices = [];
        for (let i = 0; i < this._numberOfAngles; i++) {
            let nextAngle = firstAngle + (Math.PI * 2 * i) / this._numberOfAngles;
            x = Math.round(this._centerPoint.x + this._radius * Math.cos(nextAngle));
            y = Math.round(this._centerPoint.y + this._radius * Math.sin(nextAngle));
            let vertex = {
                x: x,
                y: y
            }
            this._vertices.push(vertex);
        }
    }
    draw(ctx) {
        if(this._isIntersected)
            ctx.fillStyle = "#FF0000";
        else 
            ctx.fillStyle = "#000000";
        ctx.beginPath();
        ctx.moveTo(this._vertices[0].x, this._vertices[0].y);
        this._vertices.forEach((item, i) => {
            if(i){
                ctx.lineTo(item.x, item.y);
            }
        });
        ctx.fill();
    }
    isPointInPolygon(x, y) {
        let previousVertex = this._vertices.length - 1,
            value = false;
        this._vertices.forEach((item, i ,arr) => {
            let line = MathService.initializeLine(arr[previousVertex], item),
                isCoordinateYinPolygon = MathService.isYBelongsLine(y, line),
                isCoordinateXinPolygon = MathService.isPointWithinTheBorder(x, y, line);
            if(isCoordinateYinPolygon && isCoordinateXinPolygon)
                value = !value;
            previousVertex = i;
        });
        return value;
    }
    isPolygonWindowIntersects(polygon) {
        let topBoard = 0,
            bottomBoard = Math.floor(this._vertices.length / 2),
            rightBoard = Math.round(bottomBoard / 2),
            leftBoard = this._vertices.length - rightBoard,
            window = MathService.initializeRectangle(this._vertices[topBoard], this._vertices[rightBoard], this._vertices[bottomBoard], this._vertices[leftBoard]);
        return polygon.vertices.some((item) => {
            if(MathService.isPointWithinTheWindow(item, window))
                return true;
        });
    }
    isPolygonIntersects(secondLine) {
        let previousVertex = this._vertices.length - 1;
        return this._vertices.some((item, i ,arr) => {
            let line = MathService.initializeLine(arr[previousVertex], item);
            if(MathService.isLinesCross(line, secondLine))
                return true;
            previousVertex = i;
        });
    }
    addIntersection(index) {
        if(this._intersections.indexOf(index) === -1) {
            this._intersections.push(index)
            this._isIntersected = true;
        }
    }
    deleteIntersection(index) {
        if(this._intersections.indexOf(index) !== -1) {
            this._intersections.splice(this._intersections.indexOf(index), 1)
            if(!this._intersections.length) 
                this._isIntersected = false;
        }
    }
    move(dx, dy) {
        this._vertices.forEach((item) => {
            item.x += dx;
            item.y += dy;
        })
        this._centerPoint.x += dx;
        this._centerPoint.y += dy;
    }
};

export default Polygon;