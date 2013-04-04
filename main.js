/*
        //////////////////////////////////////////\
       ////  Author: Ionica Bizau            ////\/\
      ////  Copyright (C) 2012 Ionica BIzau ////\/\/\
     ////  GNU LICENSE                     ////\/\/\/
    //////////////////////////////////////////\/\/\/
    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\/\/
     \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\/
      -------------------------------------------
    ================================================
     T H E  G R E A T  C I R C U L A R  M I R R O R
    ================================================
    TODO: CLEAN THE CODE!!!!
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

/**
 * Init function
 */
function init() {
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

    // ... do stuff with the transformed origin
    // TODO: Do we need this?
    //context.restore();
}


$("document").ready(function() {
    console.clear();
    init();
    $("html").hide().fadeIn(800);
    // Keydown in textboxes
    $("#xValue").on("keydown", function(evt) {
        if(evt.keyCode === 13) {
            $("#drawButton").click();
        }
    });
    
    $("#yValue").on("keydown", function(evt) {
        if(evt.keyCode === 13) {
            $("#drawButton").click();
        }
    });
    
    // Click on reset button
    $("#resetButton").on("click", function() {
        $("#myCanvas").remove();
        $("center").append("<canvas id='myCanvas' width='600' height='600'></canvas>");
        init();
    });
    
    // Click on draw button
    $("#drawButton").on("click", function() {
        start($("#xValue").val(), $("#yValue").val());
    });
    
    // Click on random line button
    $("#randomLineButton").on("click", function() {
        $("#xValue").val(Math.floor(Math.random()*40));
        $("#yValue").val(200 + Math.floor(Math.random()*50));
        $("#drawButton").click();
    });
    
    $(".dropdown-menu").find("li").on("click", function() {
        if($(this).find("a").attr("data-color")) {
            lineColor = $(this).find("a").attr("data-color");
            $("#colorPicker").css("background", lineColor);
        }
        else { // random color;
            lineColor = "#" +(Math.random() * 0xFFFFFF << 0).toString(16);
            $("#colorPicker").css("background", lineColor);
        }
    });
    
    $("#randomColorLine").on("click", function() {
        lineColor = "#" +(Math.random() * 0xFFFFFF << 0).toString(16);
        $("#colorPicker").css("background", lineColor);
        $("#xValue").val(Math.floor(Math.random()*40));
        $("#yValue").val(200 + Math.floor(Math.random()*50));
        $("#drawButton").click();
    });
});


/*
    
                               ^ y
                               │
                 B(xB, yB)     │
                      ,,ggddY""│""Ybbgg,,
                 ,ag****       │       `""bg,
              ,gdP"*     **********        "Ybg, C(xC, yC)
            ,dP"  *            │   ***********"*b,
          ,dP"  *              │               "Yb,
         ,8"   *               │                 "8,
        ,8'  *                 │                  `8,
       ,8'  *                  │                   `8,
       d'  *                   │                    `b
       8 *                     │                     8
       8*                      │«------- R ---------»8     
  ─────*───────────────────────┼──────────────────────────────> x
      *8 A (xA, yA)            │ O (0, 0)            8
     * 8                       │                     8
    *  Y,                      │                    ,P
   *   `8,                     │                   ,8'
        `8,                    │                  ,8'
         `8a                   │                 a8'
          `Yba                 │               adP'
            "Yba               │             adY"
              `"Yba,           │         ,adP"'
                 `"Y8ba,       │     ,ad8P"'
                      ``""YYbaa│adPP""''
                               │
                               │

    ==========================================================
                    THE THEORY OF THIS CIRCLE
    ==========================================================
    One circle:
     - Radius: R
     - Center O(0, 0)

    3 points: A, B, C:
     - two known: A, B
     - one that we have to find it

    We know that they are point from the circle, so:

    xA^2 + yA^2 = xB^2 + yB^2 = xC^2 + yC^2 = R^2

    The length of AB is equal with BC and is L

    Let's say that xC is x, and yC is y. We have the following system of equations:

    /
    | x ^ 2 + y ^ 2 = R ^ 2 (1)
    | xB ^ 2 + yB ^ 2 = R ^ 2 (2)
    | (x - xB) ^ 2 + (y - yB) ^ 2 = L ^ 2 (3)
    \

    (1) the equation of circle with radius R and center in O(0, 0) for x, y
    (2) Same thing for xB, yB
    (3) Equation of circle with radius L and center in xB.

    ==========================================================
                               SOLUTION
    ==========================================================
    Finally we have:
        
        k = 2R^2 - L^2
        a = 4R^2
        b = -4kyB
        c = k^2 - R^2 * 4 * xB^2
        
        ------------------------

        delta = b ^ 2 - 4ac

        ------------------------
        ++++++++++++++++++++++++
        +    IF xB is not 0    +
        ++++++++++++++++++++++++
                     _______
             - b  ± √ delta
        y = ─────────────────────
                   2a

                 k - 2yyB
        x = ─────────────────────
                   2xB

        ------------------------
        ++++++++++++++++++++++++
        +       IF xB is 0     +
        ++++++++++++++++++++++++

                k
        y = ────────
               2yB
                 ____________
                /        k 
        x = \  / R^2 - ─────
             \/          4R

    ==========================================================
                          AND THAT'S IT!
    ==========================================================
*/

/**
 * THE MOST IMPORTANT FUNCTION. 
 * It always returns the next point.
 *                             ------------
 * (xM(n - 1), yM(n - 1)) ---> |?    ?   ?|
 * (xM(n), yM(n))         ---> |     M    | ---> (xM(n + 1), yM(n + 1))
 * Radius                 ---> |?    ?   ?|
 *                             ------------
 * 
 * @param {Object} A
 * @param {Object} B
 * @param {Object} R
 */
function M(A, B, R) {  

    var xA = A.x, yA = A.y;
    var xB = B.x, yB = B.y;

    var L = Math.sqrt(Math.pow((xA - xB), 2) + Math.pow((yA - yB), 2));

    var Ls = Math.pow(L, 2);
    var Rs = Math.pow(R, 2);
    var k = 2 * Rs - Ls;

    var a = 4 * Math.pow(R, 2);
    var b = - 4 * k * yB;
    var c = Math.pow(k, 2) - Math.pow(R, 2) * 4 * Math.pow(xB, 2);

    var delta = Math.pow(b, 2) - 4 * a * c;

    var x = 0, y = 0;

    if (xB !== 0) {
        y = (-b + Math.sqrt(delta)) / (2 * a);
        x = (k - 2 * y * yB) / (2 * xB);

        if (y === yA && x === xA) {
            y = (-b - Math.sqrt(delta)) / (2 * a);
            x = (k - 2 * y * yB) / (2 * xB);
        }
    }
    else {
        y = k / (2 * yB);
        x = Math.sqrt(Math.pow(R, 2) - Math.pow(k, 2) / (4 * R));
    }
   
    console.log(x, y);

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
    
    // Coeficientii
    var a = pT + 400 * x1 + x1 * x1 + y1 * y1;
    var b = 400 * y1 * y1;
    var c = pT * (y1 * y1 - pT - 400 * x1 - x1 * x1);
                                
    // Calcularea lui x1, x2
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


// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
// Update the UI
// TODO: Give only the angle instead of points.
/**
 * Draw the lines
 * @param {Object} xA
 * @param {Object} yA
 */
function start(xA, yA) {
    xA = parseInt(xA);
    yA = parseInt(yA);
    
    var m = (yA / (200 + xA));

    var firstP = firstPoint(m, xA, yA);
    
    line(xA, yA, firstP.x, firstP.y, 2, lineColor);

    var A = {
        "x": xP,
        "y": yP
    };

    var B = firstP;
    var R = 200;

    var nextPoint = M(A, B, R);
    line(B.x, B.y, nextPoint.x, nextPoint.y, 2, lineColor);
    
    // Cercul din stanga (P)
    circle(xP, yP, 2, 3, '#003300');
}

// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
// BASIC FUNCTIONS
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
