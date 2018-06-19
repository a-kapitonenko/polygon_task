import Mouse from './mouse';
import SelectService from './select.service';
import * as PolygonService from './polygon.service';

window.onload = () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext('2d');
    const mouse = new Mouse(0 ,0);
    const selectService = new SelectService();

    canvas.setAttribute('height',window.innerHeight - 20);
    canvas.setAttribute('width',window.innerWidth - 20);
    
    const polygons = PolygonService.initializePolygons();

    PolygonService.drawPolygons(polygons, canvas, ctx);

    canvas.addEventListener('mousedown', (evt) => {
        mouse.x = evt.clientX;
        mouse.y = evt.clientY;

        polygons.some((item) => {
            if (item.isPointBelongsThePolygon(mouse.x, mouse.y, item)) {
                selectService.selectedItem = item;
            }
        });
    });

    canvas.addEventListener('mousemove', (evt) => {
        if (selectService.isItemSelected) {
            const dx = evt.clientX - mouse.x;
            const dy = evt.clientY - mouse.y;

            selectService.selectedItem.move(dx, dy);
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
