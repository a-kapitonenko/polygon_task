import * as MathService from "./math.service";

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

        this.__initialize();
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

    __initialize() {
        for (let i = 0; i < this._numberOfAngles; i++) {
            const firstAngle = -Math.PI / 2;
            const nextAngle = firstAngle + (Math.PI * 2 * i) / this._numberOfAngles;

            const x = Math.round(this._centerPoint.x + this._radius * Math.cos(nextAngle));
            const y = Math.round(this._centerPoint.y + this._radius * Math.sin(nextAngle));

            const vertex = {x, y};

            this._vertices.push(vertex);
        }
    }
    
    draw(ctx) {
        ctx.fillStyle = this.getFillStyle();
        ctx.beginPath();
        ctx.moveTo(this._vertices[0].x, this._vertices[0].y);

        this._vertices.forEach((vertex) => {
            ctx.lineTo(vertex.x, vertex.y);
        });

        ctx.fill();
    }

    isPointBelongsThePolygon(x, y) {
        let previousVertex = this._vertices.slice(-1)[0];
        let value = false;

        this._vertices.forEach((vertex) => {
            const line = MathService.initializeLine(previousVertex, vertex);
            const isCoordinateYBelongsPolygon = MathService.isYBelongsLine(y, line);
            const isCoordinateXBelongsPolygon = MathService.isPointWithinTheBorder(x, y, line);

            if (isCoordinateYBelongsPolygon && isCoordinateXBelongsPolygon) {
                value = !value;
            }
            previousVertex = vertex;
        });

        return value;
    }

    isPolygonWindowIntersects(polygon) {
        const topBoard = 0;
        const bottomBoard = Math.floor(this._vertices.length / 2);
        const rightBoard = Math.round(bottomBoard / 2);
        const leftBoard = this._vertices.length - rightBoard;

        const window = MathService.initializeRectangle(this._vertices[topBoard], this._vertices[rightBoard], this._vertices[bottomBoard], this._vertices[leftBoard]);

        return polygon.vertices.some((item) => {
            return MathService.isPointWithinTheWindow(item, window);
        });
    }

    isPolygonIntersects(secondLine) {
        let previousVertex = this._vertices.slice(-1)[0];

        return this._vertices.some((vertex) => {
            const line = MathService.initializeLine(previousVertex, vertex);

            previousVertex = vertex;

            return MathService.isLinesCross(line, secondLine);
        });
    }

    addIntersection(polygon) {
        if (this._intersections.indexOf(polygon) === -1) {
            this._intersections.push(polygon);
            this._isIntersected = true;
        }
    }

    deleteIntersection(polygon) {
        if (this._intersections.indexOf(polygon) !== -1) {
            this._intersections.splice(this._intersections.indexOf(polygon), 1);

            if (!this._intersections.length) {
                this._isIntersected = false;
            }
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

    getFillStyle() {
        if (this._isIntersected) {
            return "#FF0000";
        } else { 
            return "#000000";
        }
    }
};

export default Polygon;