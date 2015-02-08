$(document).ready(function () {

    // Constants
    var ERROR_MESSAGES = {
        NOT_SUPPORTED: "The angle is not supported yet."
      , NEGATIVE_ANGLE: "The angle is negative. Put a positive one less than 90 degrees."
      , INVALID_ANGLE: "The angle cannot be 90 degrees or greater."
    };

    // Globals
    var canvas, context
      , cWidth, cHeight
      , lineColor = "#2980b9"
      , r
      , marginLeft
      , xP, yP
      , xO, yO
      , variableInterval
      , delay
      ;

    // Utils
    /**
     * round
     * Rounds a number.
     *
     * @name round
     * @function
     * @param {Number} num The input number.
     * @param {Number} decimals How many decimals.
     * @return {Number} The rounded number.
     */
    function round(num, decimals) {
        return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
    }

    /**
     * setVariableInterval
     * Sets a variable interval.
     *
     * @name setVariableInterval
     * @function
     * @param {Function} callbackFunc The callback function.
     * @param {Number} timing The interval value.
     * @return {Object} The object containing the variable interval methods.
     */
    function setVariableInterval (callbackFunc, timing) {
        var variableInterval = {
            interval: timing,
            callback: callbackFunc,
            stopped: false,
            runLoop: function() {
                if (variableInterval.stopped) return;

                var result = variableInterval.callback.call(variableInterval);
                if (typeof result == 'number') {
                    if (result === 0) return;
                    variableInterval.interval = result;
                }

                variableInterval.loop();
            },
            stop: function() {
                this.stopped = true;
                window.clearTimeout(this.timeout);
            },
            start: function() {
                this.stopped = false;
                return this.loop();
            },
            loop: function() {
                this.timeout = window.setTimeout(this.runLoop, this.interval);
                return this;
            }
        };

        return variableInterval.start();
    }

    /**
     * circle
     * Draws a circle on the canvas.
     *
     * @name circle
     * @function
     * @param {Number} x The x value.
     * @param {Number} y The y value.
     * @param {Number} r The radius value.
     * @param {Number} w The line width.
     * @param {String} color The color.
     * @return {undefined}
     */
    function circle(x, y, r, w, color) {
        context.beginPath();
        context.arc(x, y, r, 0, 2 * Math.PI, false);
        context.lineWidth = w;
        context.strokeStyle = color;
        context.stroke();
    }

    /**
     * line
     * Draws a line on the canvas.
     *
     * @name line
     * @function
     * @param {Number} x1 The source `x` value.
     * @param {Number} y1 The source `y` value.
     * @param {Number} x2 The target `x` value.
     * @param {Number} y2 The target `y` value.
     * @param {Number} w The line width.
     * @param {String} color The color.
     * @return {undefined}
     */
    function line(x1, y1, x2, y2, w, color) {
        context.beginPath();
        context.lineWidth = w;
        context.strokeStyle = color;
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.stroke();
    }

    /**
     * canvasArrow
     * Draws an arrow on the canvas.
     *
     * @name canvasArrow
     * @function
     * @param {Object} context The canvas context.
     * @param {Number} fromx The source `x` value.
     * @param {Number} fromy The source `y` value.
     * @param {Number} tox The target `x` value.
     * @param {Number} toy The target `y` value.
     * @return {undefined}
     */
    function canvasArrow(context, fromx, fromy, tox, toy){
        context.beginPath();
        var headlen = 5;
        var angle = Math.atan2(toy - fromy, tox - fromx);

        line(fromx, fromy, tox, toy, 2, "#7f8c8d");
        line(tox, toy, tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6), 2, "#7f8c8d");
        line(tox, toy, tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6), 2, "#7f8c8d");
    }

    /**
     * init
     * This function is called to reinit the canvas.
     *
     * @name init
     * @function
     * @return {undefined}
     */
    function init() {

        if (variableInterval) {
            variableInterval.stop();
        }

        canvas = document.getElementById('myCanvas');
        context = canvas.getContext('2d');

        context.save();
        context.scale(1,-1);
        context.translate(300, -300);

        cWidth = canvas.width;
        cHeight = canvas.height;
        r = 200;
        marginLeft = -200;

        xP = marginLeft;
        yP = 0;

        xO = 0;
        yO = 0;

        // The arrows: Ox, Oy
        canvasArrow(context, -250, 0, 250, 0);
        canvasArrow(context, 0, -250, 0, 250);

        // The main circle
        circle(xO, yO, r, 2, '#34495e');

        // Centre of main circle
        circle(xO, yO, 2, 2, '#34495e');

        // The line from the left side
        line(-200, 200, -200, -200, 2, "#c0392b");
    }


    /**
     * draw
     * Starts drawing the things.
     *
     * @name draw
     * @function
     * @return {undefined}
     */
    function draw() {

        if (variableInterval) {
            variableInterval.stop();
        }

        var angle = parseFloat($("#angleValue").val())
          , err = badAngle(angle)
          , A = null
          ;

        if (err) {
            return showError(err);
        }

        if (angle < 0.5 && angle > 0) {

            A = getA(-10, -angle);

            line(A.x, A.y, -200, 0, 2, lineColor);
            line(A.x, -A.y, -200, 0, 2, lineColor);
            circle(A.x, A.y, 3, 3, lineColor);

            for (var i = 0; i < 200; i++) {
                circle(xO, yO, i, 1, lineColor);
            }
            return;
        }

        // Another hack.
        if (angle > 84.7) {
            angle = 84.7
        }

        // Draw the lines
        start(getA(-10, -angle), function () {
            start(getA(-10, angle));
        });
    }

    /**
     * handlers
     * This function appends the DOM handlers.
     *
     * @name handlers
     * @function
     * @return {undefined}
     */
    function handlers() {

        $("#angleValue").focus();

        // Keyboard shortcuts
        $(document).on("keydown", function(e) {

            // SHIFT ==> Draw
            if (e.keyCode === 16) {
                $("#drawButton").click();
            }

            // CTRL ==> Clear
            if (e.keyCode === 17) {
                $("#resetButton").click();
            }
        });

        // Draw
        $("#angleValue").on("keydown", function(evt) {
            if(evt.keyCode === 13) {
                $("#drawButton").click();
            }
        });

        // Reset button
        $("#resetButton").on("click", function() {
            $("#myCanvas").remove();
            $("article .container").append("<canvas id='myCanvas' width='600' height='600'></canvas>");
            init();
        });

        // Download button
        $(".btn-download").on("click", function() {
            var imageLink = canvas.toDataURL();
            window.open(imageLink);
        });

        // Draw button
        $("#drawButton").on("click", draw);
    }

    /**
     * getLimit
     * This is a **hack**. This roundes the angle in a format that is supported by the application.
     *
     * @name getLimit
     * @function
     * @param {Number} angle The angle that should be rounded.
     * @return {Number} A rounded angle that is supported by the application.
     */
    function getLimit(angle) {

        angle = Math.abs(angle);

        var data = [
            {
                "angles": [0, 6, 10, 18, 30, 36, 40, 45, 50, 60, 70, 54],
                "value": 20
            },
            {
                "angles": [2, 55, 58, 62, 63, 65],
                "value": 100
            },
            {
                "angles": [3, 42, 15],
                "value": 16
            },
            {
                "angles": [20, 22, 23, 29, 47, 51, 52, 57, 45.8],
                "value": 130
            },
            {
                "angles": [11, 48],
                "value": 80
            },
            {
                "angles": [7],
                "value": 151
            },
            {
                "angles": [5, 9],
                "value": 410
            },
            {
                "angles": [35, 49],
                "value": 76
            }
        ]

        for (var i in data) {
            if (data[i].angles.indexOf(angle) !== -1) {
                return data[i].value;
            }
        }

        return 1000;
    }

    /**
     * badAngle
     * Checks if the angle is supported.
     *
     * @name badAngle
     * @function
     * @param {Number} angle The angle that should be checked.
     * @return {null|String} An error (string) or `null`.
     */
    function badAngle(angle) {

        angle = Math.abs(angle);

        var angles = [1, 3, 75, 80, 81];

        for (var i = 0.5; i < 2; i += 0.01) {
            angles.push(round(i, 2));
        }

        for (var i = 2.01; i < 5.99; i += 0.01) {
            angles.push(round(i, 2));
        }

        if (angles.indexOf(angle) !== -1) {
            return ERROR_MESSAGES.NOT_SUPPORTED;
        }

        if (angle < 0) {
            return ERROR_MESSAGES.NEGATIVE_ANGLE;
        }

        if (angle >= 90) {
            return ERROR_MESSAGES.INVALID_ANGLE;
        }

        return null;
    }

    /**
     * showError
     * Shows an error message.
     *
     * @name showError
     * @function
     * @param {String} message The error message.
     * @return {undefined}
     */
    function showError(message) {
        alert(message);
    }

    /**
     * start
     * Draws the lines on the canvas.
     *
     * @name start
     * @function
     * @param {Point} point The current point.
     * @param {Function} callback The callback function.
     * @return {undefined}
     */
    function start(point, callback) {

        callback = callback || function () {};

        // Clear the interval
        if (variableInterval) {
            variableInterval.stop();
        }

        // First point
        var xA = parseFloat(point.x)
          , yA = parseFloat(point.y)
          , m = (yA / (200 + xA))
          , firstP = firstPoint(m, xA, yA)
          ;

        // Draw line
        line(xA, yA, firstP.x, firstP.y, 2, lineColor);

        // Update variables
        var A = {
                x: xP
              , y: yP
            }
          , B = firstP
          , C = {}
          , R = 200
          , t = 0
          , withTemp = 1000
          , temp = {
                x: A.x.toFixed(7)
              , y: A.y.toFixed(7)
            }
          , pointP = JSON.stringify(temp)
          , L = Math.sqrt(Math.pow((A.x - B.x), 2) + Math.pow((A.y - B.y), 2))
          ;

        variableInterval = setVariableInterval(function() {
            interval = this.interval;

            // Get the next point
            C = M(A, B, R, L);

            // Convert to string the next point
            temp = {
                x: C.x
              , y: C.y
            };

            var strC = JSON.stringify(temp);

            // If limit was setted verify if t is not higher than limit
            if (withTemp) {
                if (t > withTemp) {
                    callback();
                    variableInterval.stop();
                    return;
                }
            }

            // If the result doesn't contain code key, draw the line
            var drawValue = check(B, C, R);

            if (!drawValue.code) {
                line(B.x, B.y, C.x, C.y, 2, lineColor);
            }
            else {
                if (drawValue.code == 1) {
                    variableInterval.stop();
                    callback(drawValue.message);
                    return;
                }
            }

            // If point C is same with point P, SUCCESS! Stop it!
            if (strC == pointP) {
                variableInterval.stop();
                callback();
                return;
            }

            // Change the points
            A.x = B.x;
            A.y = B.y;
            B.x = C.x;
            B.y = C.y;

            t++;
        }, delay);


        // Point P
        circle(xP, yP, 2, 3, '#003300');
    }

    /**
     * THE MOST IMPORTANT FUNCTION.
     * It always returns the next point.
     *                             ------------
     * (xM(n - 1), yM(n - 1)) ---> |?    ?   ?|
     * (xM(n), yM(n))         ---> |     M    | ---> (xM(n + 1), yM(n + 1))
     * Radius                 ---> |?    ?   ?|
     * Length of segments     ---> ------------
     *
     * @param {Object} A: first point
     * @param {Object} B: second point
     * @param {Object} R: radius of big circle
     * @param {Object} L: length of segments
     */
    function M(A, B, R, L) {

        var xA = A.x, yA = A.y;
        var xB = B.x, yB = B.y;

        var Ls = Math.pow(L, 2);
        var Rs = Math.pow(R, 2);
        var k = 2 * Rs - Ls;

        var a = 4 * Math.pow(R, 2);
        var b = - 4 * k * yB;
        var c = Math.pow(k, 2) - Math.pow(R, 2) * 4 * Math.pow(xB, 2);

        var delta = Math.pow(b, 2) - 4 * a * c;

        var x = 0, y = 0;
        var FIXED = 20;

        if (xB != 0) {
            y = ((-b + Math.sqrt(delta)) / (2 * a)).toFixed(FIXED);
            x = ((k - 2 * y * yB) / (2 * xB)).toFixed(FIXED);

            // TODO: Is this the best method?
            var yR = Math.round(y * 100)/100;
            var xR = Math.round(x * 100)/100;
            var xAR = Math.round(xA * 100)/100;
            var yAR = Math.round(yA * 100)/100;

            if (yR == yAR && xR == xAR) {
                y = ((-b - Math.sqrt(delta)) / (2 * a)).toFixed(FIXED);
                x = ((k - 2 * y * yB) / (2 * xB)).toFixed(FIXED);
            }
        }
        else {
            // TODO: There can be other cases.
            if (round(xB, 0) == 0 && round(yB, 0) == 200) {
                x = 200;
                y = 0;
            }
            else {
                x = -200;
                y = 0;
            }
            // y = (k / (2 * yB)).toFixed(`1FIXED);
            // x = (Math.sqrt(Math.pow(R, 2) - Math.pow(k, 2) / (4 * R))).toFixed(FIXED);
        }

        // Return always float values
        x = parseFloat(x);
        y = parseFloat(y);

        return {
            "x": x,
            "y": y
        };
    }

    /**
     * The function that returns ONLY the first point.
     * @param {Object} m
     * @param {Object} x1
     * @param {Object} y1
     */
    function firstPoint(m, x1, y1) {
        var pT = 40000;

        var a = pT + 400 * x1 + x1 * x1 + y1 * y1;
        var b = 400 * y1 * y1;
        var c = pT * (y1 * y1 - pT - 400 * x1 - x1 * x1);

        var xM = (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a);

        if (xM == x1) {
            xM = (-b - Math.sqrt(b * b - 4 * a * c)) / (2 * a);
        }

        var yM = m * (200 + xM);

        return {
            "x":xM,
            "y":yM
        };
    }

    /*
        Function that returns a point giving the angle
                            |------|
        xA          ---->   |      |===> (xA, yA)
        angle (deg) ---->   |      |
                            |------|
    */
    function getA(xA, angle) {
        // 1 PI ........... 180 deg
        // x PI ........... angle deg

        var angleRad = (Math.PI * angle) / 180;
        var tg = Math.tan(angleRad);
        var yA = xA * tg;

        return {
            x: xA - 200
          , y: yA
        };
    }

    /*
        Verify if the numbers are correct.
        If not, return an false value.
    */
    function check(B, C, R) {

        var sum1 = Math.pow(B.x, 2) + Math.pow(B.y, 2);
        var sum2 = Math.pow(C.x, 2) + Math.pow(C.y, 2);

        var n1 = isNaN(sum1);
        var n2 = isNaN(sum2);

        if (n1 || n2) {
            return {
                "message": "There is a NaN.",
                "code": 1,
            };
        }

        // Again, not the best method.
        R = Math.pow(R, 2) + 3;

        if (!(sum1 <= R && sum2 <= R)) {
            return {
                "message": "Something is wrong. Sum1 or sum2 is higher than R^2.",
                "code": 2,
            };
        }

        // Default, return true
        return {
            "message": "That's correct. Let's draw the line!",
        };
    }

    init();
    $("html").hide().fadeIn(1000);
    handlers();
});
