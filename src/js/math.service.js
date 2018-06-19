export function getRandomArbitrary(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

export function isLinesCross(fistLine, secondLine) {
    if (fistLine[1].x === fistLine[0].x || secondLine[1].x === secondLine[0].x) {
        return isVerticalLineCross(fistLine, secondLine);
    }

    const slopeFirstLine = getSlope(fistLine);
    const slopeSecondLine = getSlope(secondLine);

    if (slopeFirstLine === slopeSecondLine) {
        return false;
    }

    const coeffFirstLine = getCoeffLine(fistLine, slopeFirstLine);
    const coeffSecondLine = getCoeffLine(secondLine, slopeSecondLine);

    const x = Math.round((coeffSecondLine - coeffFirstLine) / (slopeFirstLine - slopeSecondLine));
    const y = Math.round(slopeFirstLine * x + coeffFirstLine);

    return isPointBelongsLine(x, y, fistLine) && isPointBelongsLine(x, y, secondLine);
}

export function isVerticalLineCross(fistLine, secondLine) {
    let x, slope, coeffLine;

    if (fistLine[1].x === fistLine[0].x && secondLine[1].x === secondLine[0].x) {
        return false;
    } else if (fistLine[0].x === fistLine[1].x) {
        x = fistLine[0].x;
        slope = getSlope(secondLine);
        coeffLine = getCoeffLine(secondLine, slope);
    } else if (secondLine[0].x === secondLine[1].x){
        x = secondLine[0].x;
        slope = getSlope(fistLine);
        coeffLine = getCoeffLine(fistLine, slope);
    }

    const y = Math.round(slope * x + coeffLine);

    return isPointBelongsLine(x, y, fistLine) && isPointBelongsLine(x, y, secondLine);
}

export function getSlope(line) {
    if (line[1].x === line[0].y) {
        return 0;
    }
    return (line[1].y - line[0].y) / (line[1].x - line[0].x);
}

export function getCoeffLine(line, slope) {
    return line[0].y - slope * line[0].x;
}

export function isPointBelongsLine(x, y, line) {
    return isXBelongsLine(x, line) && isYBelongsLine(y, line);
}

export function isXBelongsLine (x, line) {
    return (line[0].x <= x) && (x <= line[1].x) || (line[1].x <= x  )&& (x <= line[0].x);
}

export function isYBelongsLine (y, line) {
    return (line[0].y <= y) && (y <= line[1].y) || (line[1].y <= y ) && (y <= line[0].y);
}

export function initializeLine(firstVertex, secondVertex) {
    const line = [];

    line.push(firstVertex);
    line.push(secondVertex);

    return line;
}

export function isPointWithinTheBorder(x, y, line) {
    return x > (line[0].x - line[1].x) * (y - line[1].y) / (line[0].y - line[1].y) + line[1].x;
}

export function isPointWithinTheWindow(point, window) { 
    return point < window[0] && point < window[1] && point > window[2] && point > window[3];
}

export function initializeRectangle(firstVertex, secondVertex, thirdVertex, fourthVertex) {
    const rectangle = [];

    rectangle.push(firstVertex);
    rectangle.push(secondVertex);
    rectangle.push(thirdVertex);
    rectangle.push(fourthVertex);

    return rectangle;
}