class MathService {
    static getRandomArbitrary(min, max) {
        return Math.round(Math.random() * (max - min) + min);
    }
    static isLinesCross(fistLine, secondLine) {
        let slopeFirstLine, slopeSecondLine, coeffFirstLine, coeffSecondLine, x, y;
        if(fistLine[1].x === fistLine[0].x || secondLine[1].x === secondLine[0].x) 
            return MathService.isVerticalLineCross(fistLine, secondLine);
        slopeFirstLine = MathService.slope(fistLine);
        slopeSecondLine = MathService.slope(secondLine);
        if(slopeFirstLine === slopeSecondLine)
            return false;
        coeffFirstLine = MathService.coeffLine(fistLine, slopeFirstLine);
        coeffSecondLine = MathService.coeffLine(secondLine, slopeSecondLine);
        x = Math.round((coeffSecondLine - coeffFirstLine) / (slopeFirstLine - slopeSecondLine));
        y = Math.round(slopeFirstLine * x + coeffFirstLine);
        return MathService.isPointBelongsLine(x, y, fistLine) && MathService.isPointBelongsLine(x, y, secondLine)
    }
    static isVerticalLineCross(fistLine, secondLine) {
        let x, y, slope, coeffLine;
        if(fistLine[1].x === fistLine[0].x && secondLine[1].x === secondLine[0].x) 
            return false;
        else if(fistLine[0].x === fistLine[1].x){
            x = fistLine[0].x;
            slope = MathService.slope(secondLine);
            coeffLine = MathService.coeffLine(secondLine, slope);
        } else if(secondLine[0].x === secondLine[1].x){
            x = secondLine[0].x;
            slope = MathService.slope(fistLine);
            coeffLine = MathService.coeffLine(fistLine, slope);
        }
        y = Math.round(slope * x + coeffLine);
        return MathService.isPointBelongsLine(x, y, fistLine) && MathService.isPointBelongsLine(x, y, secondLine)
    }
    static slope(line) {
        let slope;
        if(line[1].x === line[0].y) 
            slope = 0;
        else 
            slope = (line[1].y - line[0].y) / (line[1].x - line[0].x);
        return slope;
    }
    static coeffLine(line, slope){
        return line[0].y - slope * line[0].x;
    }
    static isPointBelongsLine(x, y, line) {
        let isXBelongsLine =  MathService.isXBelongsLine(x, line),
            isYBelongsLine =  MathService.isYBelongsLine(y, line);
        return isXBelongsLine && isYBelongsLine;
    }
    static isXBelongsLine (x, line) {
        return (line[0].x <= x) && (x <= line[1].x) || (line[1].x <= x  )&& (x <= line[0].x);
    }
    static isYBelongsLine (y, line) {
        return (line[0].y <= y) && (y <= line[1].y) || (line[1].y <= y ) && (y <= line[0].y);
    }
    static initializeLine(firstVertex, secondVertex) {
        let line = [];
        line.push(firstVertex);
        line.push(secondVertex);
        return line;
    }
    static isPointWithinTheBorder(x, y, line) {
        return x > (line[0].x - line[1].x) * (y - line[1].y) / (line[0].y - line[1].y) + line[1].x;
    }
    static isPointWithinTheWindow(point, window) { 
        return point < window[0] && point < window[1] && point > window[2] && point > window[3];
    }
    static initializeRectangle(firstVertex, secondVertex, thirdVertex, fourthVertex) {
        let rectangle = [];
        rectangle.push(firstVertex);
        rectangle.push(secondVertex);
        rectangle.push(thirdVertex);
        rectangle.push(fourthVertex);
        return rectangle;
    }
}

export default MathService;