const PI                   = Math.PI,
      NUMBER_OF_POLYGON    = 6,
      MAX_NUMBER_OF_ANGLES = 7,
      length               = 100;   

function main() {
    var canvas   = document.getElementById("canvas"),
        ctx      = canvas.getContext('2d'),
        polygons = [],
        mouse = {
            x: 0,
            y: 0
        }
    canvas.setAttribute('height',window.innerHeight - 20);
    canvas.setAttribute('width',window.innerWidth - 20);
    polygons = initPolygon(NUMBER_OF_POLYGON, MAX_NUMBER_OF_ANGLES);
    colorDraw(polygons, canvas, ctx);
    canvas.addEventListener('mousedown', function(evt){
        mouse.x = evt.clientX;
        mouse.y = evt.clientY;
        polygons.forEach(function(item, i, arr){
            arr[i].selected = inPolygon(mouse.x, mouse.y, item);
        });
    });
    canvas.addEventListener('mousemove', function(evt){
        polygons.forEach(function(item, i, arr){
            if(item.selected){
                for (let j = 0; j < item.x.length; j++) {
                    item.x[j] += evt.clientX - mouse.x;
                    item.y[j] += evt.clientY - mouse.y;
                }
                mouse.x = evt.clientX;
                mouse.y = evt.clientY;
                colorDraw(polygons, canvas, ctx);
            }
        });
    });
    canvas.addEventListener('mouseup', function(evt){
        mouse.x = 0;
        mouse.y = 0;
        polygons.forEach(function(item, i, arr){
            if(item.selected){
                for(let j = 0; j < arr.length; j++){
                    if(i == j) continue
                    if(intOfPol(item, arr[j]) || overlappingOfPolygons(item, arr[j]) || overlappingOfPolygons(arr[j], item)){
                        if(item.intersected.indexOf(j) == -1){
                            item.intersected.push(j);
                            arr[j].intersected.push(i);
                        }
                    } else if(item.intersected.indexOf(j) >= 0){
                        arr[j].intersected.splice(arr[j].intersected.indexOf(i), 1);
                        item.intersected.splice(item.intersected.indexOf(j), 1);
                    }
                } 
            }
            flag = 0;
            item.selected = false;
        });
        colorDraw(polygons, canvas, ctx)
    });
}

function initPolygon(n, m) {
    polygons = [];
    firstAngle = -PI / 2;
    centerX = 50;
    centerY = 50;
    for (let i = 0; i < n; i++) {
        let radius = getRandomArbitrary(25, 40),
            numberOFAngles = getRandomArbitrary(3, m),
            x = [];
            y = [];

        if(i) centerY += length; 
        for (let j = 0; j < numberOFAngles; j++) {
            x[j] = Math.round(centerX + radius * Math.cos(firstAngle + (2 * PI * j)/(numberOFAngles)));
            y[j] = Math.round(centerY + radius * Math.sin(firstAngle + (2 * PI * j)/(numberOFAngles)));
        }
        polygons[i] = {
            radius: radius,
            x: x,
            y: y,
            intersected: [],
            selected: false
        }
    }
    return polygons;
}

function getRandomArbitrary(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function colorDraw(polygons, canvas, ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    polygons.forEach(function(item, i, arr) {
        ctx.fillStyle = "#000000"
        if(item.intersected.length) {
            ctx.fillStyle = "#FF0000"
        };
        ctx.beginPath();
        ctx.moveTo(item.x[0], item.y[0]);
        for(let i = 1; i < item.x.length; i++) {
            ctx.lineTo(item.x[i], item.y[i]);
        }
        ctx.fill();
    });
}

function inPolygon(x, y , polygon) {
    npol = polygon.x.length;
    j = npol - 1;
    var c = false;
    for (i = 0; i < npol;i++){
        if ((((polygon.y[i] <= y) && (y < polygon.y[j])) || ((polygon.y[j] <= y) && (y < polygon.y[i]))) &&
        (x > (polygon.x[j] - polygon.x[i]) * (y - polygon.y[i]) / (polygon.y[j] - polygon.y[i]) + polygon.x[i])) {
            c = !c
        }
        j = i;
    }
  return c;
}

function intOfPol(pol1, pol2) {
    let x = [],
        y = [];
    for(let i = 0; i < pol1.x.length; i++){
        if(i + 1 == pol1.x.length) {
            x[1] = pol1.x[0];
            y[1] = pol1.y[0];
        }
        else {
            x[1] = pol1.x[i + 1];
            y[1] = pol1.y[i + 1];
        }
        x[0] = pol1.x[i];
        y[0] = pol1.y[i]; 
        for(let j = 0; j < pol2.x.length; j++){
            if(j + 1 == pol2.x.length) {
                x[3] = pol2.x[0];
                y[3] = pol2.y[0];
            }
            else {
                x[3] = pol2.x[j + 1];
                y[3] = pol2.y[j + 1];
            }
            x[2] = pol2.x[j];
            y[2] = pol2.y[j];
            x, y = defEnds(x, y);
            if(crossLine(x, y)) return 1;
        }
    }
    return 0;
}

function defEnds(x, y){
    let x1, y1;
    for(let i = 0; i < x.length; i += 2){
        if (x[i] > x[i+1]){
            x1 = x[i+1];
            x[i+1] = x[i];
            x[i] = x1;     
            y1 = y[i+1];
            y[i+1] = y[i];
            y[i] = y1;     
        } else if(x[i] == x[i+1]){
            if(y[i] > y[i+1]){
                y1 = y[i+1];
                y[i+1] = y[i];
                y[i] = y1;   
            }
        }   
    }
    return x, y; 
}

function crossLine(x, y) {
    let k1, k2, b1, b2, x1, y1;
    if(x[1] == x[0] || x[3] == x[2]) return crossVerticalLine(x, y);
    if(y[1] == y[0]) k1 = 0
    else k1 = (y[1] - y[0]) / (x[1] - x[0]);
    if(y[2] == y[3]) k2 = 0
    else k2 = (y[3] - y[2]) / (x[3] - x[2]);
    if(k1 == k2) return false;
    b1 = y[0] - k1 * x[0];
    b2 = y[2] - k2 * x[2];
    x1 = Math.round((b2 - b1) / (k1 - k2));
    y1 = Math.round(k1 * x1 + b1);
    return ((x[0] <= x1) && (x1 <= x[1])) && ((x[2] <= x1) && (x1 <= x[3]))
}

function overlappingOfPolygons(pol1, pol2) {
    for(let i = 0; i < pol1.x.length; i++){
        if(!inPolygon(pol1.x[i], pol1.y[i], pol2)) return 0;
    }
    return 1;
}

function crossVerticalLine(x, y){
    let x1, y1, k, b;
    if(x[1] == x[0] && x[3] == x[2]) return false
    else if(x[1] == x[0]) {
        x1 = x[0];
        k = (y[3] - y[2]) / (x[3] - x[2]);
        b = y[2] - k * x[2]; 
    }
    else if(x[2] == x[3]){ 
        x1 = x[2]
        k = (y[1] - y[0]) / (x[1] - x[0]);
        b = y[0] - k * x[0]; 
    }
    y1 = Math.round(k * x1 + b);
    return ((y[0] <= y1) && (y1 <= y[1]) || (y[0] >= y1) && (y1 >= y[1])) && 
           ((y[2] <= y1) && (y1 <= y[3]) || (y[2] >= y1) && (y1 >= y[3])) &&
           ((x[0] <= x1) && (x1 <= x[1])) && ((x[2] <= x1) && (x1 <= x[3]))
}