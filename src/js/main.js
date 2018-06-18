import Polygon from './polygon';
import SelectService from './select.service';
import PolygonService from './polygon.service';

window.onload = () => {
    let canvas = document.getElementById("canvas"),
        ctx = canvas.getContext('2d'),
        mouse = { x: 0, y: 0 },
        selectService = new SelectService();
    canvas.setAttribute('height',window.innerHeight - 20);
    canvas.setAttribute('width',window.innerWidth - 20);
    let polygons = PolygonService.initializePolygons();
    PolygonService.drawPolygons(polygons, canvas, ctx);

    canvas.addEventListener('mousedown', (evt) => {
        mouse.x = evt.clientX;
        mouse.y = evt.clientY;
        polygons.forEach((item) => {
            if(item.isPointInPolygon(mouse.x, mouse.y, item))
                selectService.selectedItem = item;
        });
    });

    canvas.addEventListener('mousemove', (evt) => {
        if(selectService.isItemSelected){
            let indexOfSelectedItem = polygons.indexOf(selectService.selectedItem),
                item = polygons[indexOfSelectedItem],
                dx = evt.clientX - mouse.x,
                dy = evt.clientY - mouse.y;
            PolygonService.movePolygon(item, dx, dy);
            mouse.x = evt.clientX;
            mouse.y = evt.clientY;
            PolygonService.drawPolygons(polygons, canvas, ctx);
        }
    });

    canvas.addEventListener('mouseup', () => {
        mouse.x = 0;
        mouse.y = 0;
        if(selectService.isItemSelected){
            let indexOfSelectedItem = polygons.indexOf(selectService.selectedItem),
                selectedItem = polygons[indexOfSelectedItem];
            PolygonService.intersectionOfPolygons(polygons, selectedItem);
            selectService.deleteSelectedItem();
            PolygonService.drawPolygons(polygons, canvas, ctx);
        }
    });
}
