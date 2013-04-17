/*
    ==================================================
    « T H E  G R E A T  C I R C U L A R  M I R R O R »
    ==================================================
    « Author: Ionica Bizau                           »
    « COPYRIGHT (C) 2013 IONICA BIZAU                »
    « UNDER GNU LICENSE                              »
    ==================================================
*/

// Canvas
var canvas, context;

// Variables
var cWidth, cHeight;
var lineColor = "blue";

// Radius
var r;
    
// Margin left
var marginLeft;

// Points
var xP, yP;
var xO, yO;

// Interval
var interval;

/**
 * Init function
 */
function init() {
    clearInterval(interval);

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
    circle(xO, yO, r, 1, '#003300');

    // Centre of main circle
    circle(xO, yO, 2, 3, '#003300');
    
    // The line from the left side
    line(-200, 200, -200, -200, 0.5, "red");
}


/*
    On window load:
     - init
     - set handlers
     - fadeIn
*/
$("document").ready(function() {
    init();
    $("html").hide().fadeIn(800);
    handlers();
});


/*
    Function that sets the handlers:
     - keydown in textboxes
     - click on the buttons
     - color picker
*/
function handlers() {

    $("#angleValue").focus();

    // Shortcuts for keyboard
    $(document).on("keydown", function(e) {
        console.log(e.keyCode);
        
        // SHIFT ==> Draw
        if (e.keyCode === 16) {    
            $("#drawButton").click();
        }

        // CTRL ==> Clear
        if (e.keyCode === 17) {
            $("#resetButton").click();
        }
    });

    // Keydown in textboxes
    $("#xValue").on("keydown", function(evt) {
        if(evt.keyCode === 13) {
            $("#drawButton").click();
        }
    });
    
    $("#angleValue").on("keydown", function(evt) {
        if(evt.keyCode === 13) {
            $("#drawButton").click();
        }
    });
    
    // Click on reset button
    $("#resetButton").on("click", function() {
        $("#myCanvas").remove();
        $("#container").append("<canvas id='myCanvas' width='600' height='600'></canvas>");
        init();
    });
    
    // Click on draw button
    $("#drawButton").on("click", function() {
        clearInterval(interval);
        var angle = parseFloat($("#angleValue").val());
        
        var err = badAngle(angle);
        if (err) {
            showError(err);
            return;
        }

        if (angle < 0.5 && angle !== 0) {
            
            var A = getA(parseFloat($("#xValue").val()) + 200, -angle);
            
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

        $("#limit").val(getLimit(angle)); 

        var A = getA(parseFloat($("#xValue").val()) + 200, -angle);

        start(A.x, A.y, function() {
            
            var A = getA(parseFloat($("#xValue").val()) + 200, angle);
            start(A.x, A.y, function() {
                console.log("Stopped...");
            });

            $("#yValue").val(A.y);
            $("#xValue").val(A.x);
        });
    });
    
    // Color picker 
    $(".dropdown-menu").find("li").on("click", function() {
        if($(this).find("a").attr("data-color")) {
            lineColor = $(this).find("a").attr("data-color");
            $("#colorPicker").css("background", lineColor);
            clearInterval(interval);
        }
        else { // random color;
            lineColor = "#" +(Math.random() * 0xFFFFFF << 0).toString(16);
            $("#colorPicker").css("background", lineColor);
            clearInterval(interval);
        }
    });
}

/*
    Set limit
    Temp function, just a hack
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
            "angles": [3, 42],
            "value": 16
        },
        {
            "angles": [20, 22, 23, 29, 47, 51, 52, 57],
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

function badAngle(angle, callback) {
    angle = Math.abs(angle);

    var angles = [1, 3, 75];

    for (var i = 1; i < 2; i += 0.01) {
        angles.push(i);
    }

    if (angles.indexOf(angle) !== -1) {
        return "The angle is not supported yet.";
    }

    if (angle < 0) {
        return "The angle is negative. Put a positive one less than 90 degrees.";
    }

    if (angle >= 90) {
        return "The angle cannot be 90 degrees or greather.";
    }

    return null;
}

/*
    Bootstrap modal error
*/
function showError(message) {
    $("#error-message").text(message);
    $("#modal-error").modal("show");
}

/**
 * Drawing the lines in <canvas>
 * When finished the callback is called.
 *
 * @param {Object} xA
 * @param {Object} yA
 * @param {Object} callback
 */
function start(xA, yA, callback) {
    // Clear the interval
    clearInterval(interval);

    // First point
    xA = parseFloat(xA);
    yA = parseFloat(yA);
    
    // The slope of AB
    var m = (yA / (200 + xA));

    // First point that is found
    var firstP = firstPoint(m, xA, yA);
    
    // Draw line
    line(xA, yA, firstP.x, firstP.y, 2, lineColor);

    // Point A becomes P.
    var A = {
        "x": xP,
        "y": yP
    };

    // A, B, C: the three points
    var A = A;
    var B = firstP;
    var C = {};

    // Radius
    var R = 200;

    // Counter
    var t = 0;

    // Limit
    var withTemp = parseInt($("#limit").val()) || 0;

    var temp = {
        "x": A.x.toFixed(7),
        "y": A.y.toFixed(7)
    };

    // Convert to string point P: "{ "x": "-200.0000000", "y": "0.0000000" }"
    var pointP = JSON.stringify(temp);
    
    // Length of segment
    var L = Math.sqrt(Math.pow((A.x - B.x), 2) + Math.pow((A.y - B.y), 2));
    
    // Delay of timer (interval)
    var delay = 0; // TODO: Maybe a UI textbox where this can be setted?

    // Start the timer
    interval = window.setInterval(function() {
        // Get the next point
        var C = M(A, B, R, L);

        // Convert to string the next point
        temp = {
            "x": round(C.x, 7).toFixed(7),
            "y": round(C.y, 7).toFixed(7)
        };

        var strC = JSON.stringify(temp);

        // If limit was setted verify if t is not higher than limit
        if (withTemp) {
            if (t > withTemp) {
                console.log("t stopped the script.");
                callback();
                clearInterval(interval);
                return;
            }
        }

        // If the result doesn't contain code key, draw the line
        var drawValue = draw(B, C, R);

        if (!drawValue.code) {
            line(B.x, B.y, C.x, C.y, 2, lineColor);
        }
        else {
            if (drawValue.code == 1) {
                clearInterval(interval);
                callback(drawValue.message);
                return;
            }
        }

        // If point C is same with point P, SUCCESS! Stop it!
        if (strC == pointP) {
            console.log("Same point! Yeah! :-)");
            clearInterval(interval);
            callback();
            return;
        }

        // Change the points
        A.x = B.x;
        A.y = B.y;
        B.x = C.x;
        B.y = C.y;

        t++;
        console.log(t);

    }, delay);

    
    // Point P
    circle(xP, yP, 2, 3, '#003300');
}

/* 
    ===========================================
                   BASIC FUNCTIONS
    ===========================================
*/

// Round
function round(num, decimals) {
    return Math.round(num*Math.pow(10,decimals))/Math.pow(10,decimals);
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

    var ROUND = 2;
    // TODO: round?
    return {
        "x": round(xA - 200, ROUND),
        "y": round(yA, ROUND)
    };
}

/*
    Verify if the numbers are correct.
    If not, return an false value.
*/
function draw(B, C, R) {
     
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

    if (!(round(sum1, 0) <= R && round(sum2, 0) <= R)) {
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

/* 
    ===========================================
                <CANVAS> FUNCTIONS
    ===========================================
*/

// Circle
function circle(x, y, r, w, color) {
    context.beginPath();
    context.arc(x, y, r, 0, 2 * Math.PI, false);
    context.lineWidth = w;
    context.strokeStyle = color;
    context.stroke();
}

// Line
function line(x1, y1, x2, y2, w, color) {
    context.beginPath();
    context.lineWidth = w;
    context.strokeStyle = color;  
    context.moveTo(x1,y1);
    context.lineTo(x2,y2);
    context.stroke();
}
    
// Draw Arrow
function canvasArrow(context, fromx, fromy, tox, toy){
    context.beginPath();
    var headlen = 10;
    var angle = Math.atan2(toy-fromy,tox-fromx);
    context.moveTo(fromx, fromy);
    context.lineTo(tox, toy);
    context.lineTo(tox-headlen*Math.cos(angle-Math.PI/6),toy-headlen*Math.sin(angle-Math.PI/6));
    context.moveTo(tox, toy);
    context.lineTo(tox-headlen*Math.cos(angle+Math.PI/6),toy-headlen*Math.sin(angle+Math.PI/6));
    context.stroke();
}
