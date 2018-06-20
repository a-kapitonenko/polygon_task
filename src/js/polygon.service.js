import * as MathService from "./math.service";
import Polygon from "./polygon";

var config = require('../config.json');
   
export function initializePolygons() {
    const polygons = [];
    const numberOfPolygons = config.polygon.numberOfPolygons;
    const minNumberOfVertices = config.polygon.vertices.minNumber;
    const maxNumberOfVertices = config.polygon.vertices.maxNumber;
    const centerSpacing = config.polygon.centerSpacing;

    const centerX = config.polygon.firstPoint.X;
    let centerY = config.polygon.firstPoint.Y;

    for (let i = 0; i < numberOfPolygons; i++) {
        const radius = MathService.getRandomArbitrary(config.polygon.radius.min, config.polygon.radius.max);
        const numberOfVertices = MathService.getRandomArbitrary(minNumberOfVertices, maxNumberOfVertices);
        const polygon = new Polygon(centerX, centerY, radius, numberOfVertices);

        polygons.push(polygon);
        centerY += centerSpacing; 
    }

    return polygons;
}

export function drawPolygons(polygons, canvas, ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    polygons.forEach((item) => {
        item.draw(ctx);
    });
}

export function intersectionOfPolygons(polygons, selectedItem) {
    polygons.forEach((item) => {
        if (selectedItem !== item) {
            if (isPolygonsIntersects(selectedItem, item) || isPolygonsOverlapping(selectedItem, item)) {
                selectedItem.addIntersection(item);
                item.addIntersection(selectedItem);
            } else {
                selectedItem.deleteIntersection(item);
                item.deleteIntersection(selectedItem);
            }
        }
    });
}

export function isPolygonsIntersects(firstPolygon, secondPolygon) {
    if(firstPolygon.isPolygonWindowIntersects(secondPolygon)) {
        let previousVertex = secondPolygon.vertices.slice(-1)[0];

        return secondPolygon.vertices.some((vertex) => {
            const line = MathService.initializeLine(previousVertex, vertex);

            previousVertex = vertex;

            return firstPolygon.isPolygonIntersects(line);
        });
    }
}

export function isPolygonsOverlapping(firstPolygon, secondPolygon) {
    const isfirstPolygonBelongsSecondPolygon = firstPolygon.vertices.some((item) => {
        return secondPolygon.isPointBelongsThePolygon(item.x, item.y);
    });

    const isSecondPolygonBelongsFirstPolygon = secondPolygon.vertices.some((item) => {
        return firstPolygon.isPointBelongsThePolygon(item.x, item.y);
    });

    return isfirstPolygonBelongsSecondPolygon || isSecondPolygonBelongsFirstPolygon;
}