function DrawApp() {
    const self = this;
    const drawCanvas = document.getElementById('myCanvas');
    const context = drawCanvas.getContext('2d');

    let strokeColor = "#000";
    let isDrawing = false;
    let drawMode = 1;

    const colorOptions = [
        { strokeColor: "#FF0000" },
        { strokeColor: "#0026FF" },
        { strokeColor: "#007F0E" },
        { strokeColor: "#FFD800" },
        { strokeColor: "#000000" },
        { strokeColor: "#7F0000" },
        { strokeColor: "#7F006E" },
        { strokeColor: "#FF00DC" },
        { strokeColor: "#00FFFF" },
        { strokeColor: "#808080" }];

    self.initiate = function () {
        // add event listeners
        drawCanvas.addEventListener('mousedown', e => {
            x = e.offsetX;  // e.pageX - this.offsetLeft;
            y = e.offsetY;  // e.pageY - this.offsetTop;
            isDrawing = true;
            drawMode = getDrawMode();
        });

        drawCanvas.addEventListener('mousemove', e => {
            if (isDrawing) {
                draw(x, y, e.offsetX, e.offsetY);
                x = e.offsetX;
                y = e.offsetY;
            }
        });

        drawCanvas.addEventListener('mouseup', e => {
            isDrawing = false;
        });

        drawCanvas.addEventListener('mouseleave', e => {
            isDrawing = false;
        });

        //canvas.addEventListener('mousemove', function (evt) {
        //    var mousePos = getMousePos(canvas, evt);
        //    var div = document.getElementById('coordinates');
        //    div.innerText = 'X: ' + (mousePos.x - 250) + '; Y: ' + (mousePos.y - 250);
        //}, false);
        //drawAxis();

        document.getElementById("clearBtn").addEventListener('click', e => {
            clearCanvas();
        });

        //downloadLnk.addEventListener('click', download, false);
    };

    function selectColor() {
        clearCanvas();
        //drawAxis();
    };

    function drawAxis() {
        context.fillStyle = "#FFFFFF";
        context.fillRect(0, 0, drawCanvas.width, drawCanvas.height);
        context.beginPath();
        context.moveTo(250, 0);
        context.lineTo(250, 500);
        context.moveTo(0, 250);
        context.lineTo(500, 250);
        context.lineWidth = 1;
        context.stroke();
        return false;
    };
    
    function clearCanvas() {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        //drawAxis();
    };

    function drawLine(x1, y1, x2, y2) {
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.closePath();
        context.stroke();        
    }

    function draw(x1, y1, x2, y2) {
        context.lineJoin = "round";
        context.lineWidth = 2;
        context.strokeStyle = strokeColor;
        drawLine(x1, y1, x2, y2);

        // draw other lines
        switch (drawMode) {
            case "1":
                break;
            case "2":
                drawLine(x1, y1 + (250 - y1) * 2, x2, y2 + (250 - y2) * 2);
                break;
            case "3":
                drawLine(x1 + (250 - x1) * 2, y1, x2 + (250 - x2) * 2, y2);
                break;
            case "4":
                drawMode4(x1, y1, x2, y2);
                break;
            case "5":
                drawMode5(x1, y1, x2, y2);
                break;
            case "6":
                drawMode6(x1, y1, x2, y2);
                break;
            default:
                break;
        }
    }

    function drawMode4(x1, y1, x2, y2) {
        let x1Mod = x1 + (250 - x1) * 2;
        let y1Mod = y1 + (250 - y1) * 2;
        let x2Mod = x2 + (250 - x2) * 2;
        let y2Mod = y2 + (250 - y2) * 2;

        drawLine(y1, x1Mod, y2, x2Mod);
        drawLine(y1Mod, x1, y2Mod, x2);
        drawLine(x1Mod, y1Mod, x2Mod, y2Mod);
    }

    function drawMode5(x1, y1, x2, y2) {
        let x1Mod = x1 + (250 - x1) * 2;
        let y1Mod = y1 + (250 - y1) * 2;
        let x2Mod = x2 + (250 - x2) * 2;
        let y2Mod = y2 + (250 - y2) * 2;

        drawLine(x1Mod, y1, x2Mod, y2);
        drawLine(x1, y1Mod, x2, y2Mod);
        drawLine(x1Mod, y1Mod, x2Mod, y2Mod);
    }

    function drawMode6(x1, y1, x2, y2) {
        // we imagine the center of coordinates is at (250; 250)
        // move the center of coordinates to (0; 0) - for calculations
        x1 = x1 - 250;
        y1 = y1 - 250;
        x2 = x2 - 250;
        y2 = y2 - 250;

        // radius (distance from center of rotation to a point)
        let r1 = Math.sqrt(x1 * x1 + y1 * y1);
        let r2 = Math.sqrt(x2 * x2 + y2 * y2);

        // angles in degrees
        let a1 = radiansToDegrees(radiansFromCoord(x1, y1));
        let a2 = radiansToDegrees(radiansFromCoord(x2, y2));

        a1 += 45;
        a2 += 45;

        for (let i = 0; i < 7; i++) {

            let u1 = degreesToRadians(a1);
            let u2 = degreesToRadians(a2);

            let newX1 = Math.round(getX(r1, u1) + 250);
            let newY1 = Math.round(getY(r1, u1) + 250);
            let newX2 = Math.round(getX(r2, u2) + 250);
            let newY2 = Math.round(getY(r2, u2) + 250);

            drawLine(newX1, newY1, newX2, newY2);
            a1 += 45;
            a2 += 45;
        }
    }

    function getDrawMode() {
        var radios = document.getElementsByName('drawMode');
        for (var i = 0; i < radios.length; i++) {
            if (radios[i].checked) {
                return radios[i].value;
            }
        }
    }

    function getX (r, u) {        
        return r * Math.cos(u);
    }

    function getY (r, u) {       
        return r * Math.sin(u);
    }

    function degreesToRadians(a) {
        return a * Math.PI / 180;
    }

    function radiansToDegrees(radians) {
        return radians * 180 / Math.PI;
    }

    function radiansFromCoord(x, y) {
        return Math.atan2(y, x);
    }
}

var da = new DrawApp();
da.initiate();