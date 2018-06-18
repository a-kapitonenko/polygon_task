import MathService from "./math.service";
import Polygon from "./polygon";

var config = require('./config.json');

class PolygonService {
    static initializePolygons() {
        let polygons = [],
            centerX = config.polygon.firstPoint.X,
            centerY = config.polygon.firstPoint.Y,
            numberOfPolygons = config.polygon.numberOfPolygons,
            minNumberOfVertices = config.polygon.vertices.minNumber,
            maxNumberOfVertices = config.polygon.vertices.maxNumber,
            centerSpacing = config.polygon.centerSpacing;
        for (let i = 0; i < numberOfPolygons; i++) {
            let radius = MathService.getRandomArbitrary(config.polygon.radius.min, config.polygon.radius.max),
                numberOfVertices = MathService.getRandomArbitrary(minNumberOfVertices, maxNumberOfVertices);
                if(i)
                    centerY += centerSpacing; 
            let polygon = new Polygon(centerX, centerY, radius, numberOfVertices);
            polygon.initialize();
            polygons.push(polygon);
        }
        return polygons;
    }
    static drawPolygons(polygons, canvas, ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        polygons.forEach((item) => {
            item.draw(ctx);
        });
    }
    static intersectionOfPolygons(polygons, selectedItem) {
        polygons.forEach((item, i, arr) => {
            if(selectedItem !== item) {
                if(PolygonService.isPolygonsIntersects(selectedItem, item) || PolygonService.isPolygonsOverlapping(selectedItem, item)) {
                    selectedItem.addIntersection(i);
                    item.addIntersection(arr.indexOf(selectedItem));
                } else {
                    selectedItem.deleteIntersection(i);
                    item.deleteIntersection(arr.indexOf(selectedItem));
                }
            }
        });
    }
    static isPolygonsIntersects(firstPolygon, secondPolygon) {
        let previousVertex = secondPolygon.vertices.length - 1;
        return secondPolygon.vertices.some((item, i, arr) => {
            let line = [];
            line.push(arr[previousVertex]);
            line.push(item);
            if (firstPolygon.isPolygonIntersects(line))
                return true;
            previousVertex = i;
        });
    }
    static isPolygonsOverlapping(firstPolygon, secondPolygon) {
        let isfirstPolygonInSecondPolygon, isSecondPolygonInFirstPolygon;
        isfirstPolygonInSecondPolygon = firstPolygon.vertices.some((item, i, arr) => {
            return secondPolygon.isPointInPolygon(item.x, item.y);
        });
        isSecondPolygonInFirstPolygon = secondPolygon.vertices.some((item, i, arr) => {
            return firstPolygon.isPointInPolygon(item.x, item.y);
        });
        return isfirstPolygonInSecondPolygon || isSecondPolygonInFirstPolygon;
    }
    static movePolygon(polygon, dx, dy) {
        polygon.move(dx, dy);
    }
}

export default PolygonService;