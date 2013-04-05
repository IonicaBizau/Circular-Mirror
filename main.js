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

/**
 * THE MOST IMPORTANT FUNCTION. 
 * It always returns the next point.
 *                             ------------
 * (xM(n - 1), yM(n - 1)) ---> |?    ?   ?|
 * (xM(n), yM(n))         ---> |     M    | ---> (xM(n + 1), yM(n + 1))
 * Radius                 ---> |?    ?   ?|
 * Length of segments     ---> ------------
 * 
 * @param {Object} A
 * @param {Object} B
 * @param {Object} R
 * @param {Object} L
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

    if (xB !== 0) {
        y = ((-b + Math.sqrt(delta)) / (2 * a)).toFixed(FIXED);
        x = ((k - 2 * y * yB) / (2 * xB)).toFixed(FIXED);

        // TODO: Is this the best method?
        var yR = Math.round(y * 100)/100;
        var xR = Math.round(x * 100)/100;
        var xAR = Math.round(xA * 100)/100;
        var yAR = Math.round(yA * 100)/100;

        if (yR === yAR && xR === xAR) {
            y = ((-b - Math.sqrt(delta)) / (2 * a)).toFixed(FIXED);
            x = ((k - 2 * y * yB) / (2 * xB)).toFixed(FIXED);
        }
    }
    else {
        y = (k / (2 * yB)).toFixed(FIXED);
        x = (Math.sqrt(Math.pow(R, 2) - Math.pow(k, 2) / (4 * R))).toFixed(FIXED);
    }

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


// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
// Update the UI
// TODO: Give only the angle instead of points.
/**
 * Draw the lines
 * @param {Object} xA
 * @param {Object} yA
 */
function start(xA, yA) {
    xA = parseFloat(xA);
    yA = parseFloat(yA);
    
    var m = (yA / (200 + xA));

    var firstP = firstPoint(m, xA, yA);
    
    line(xA, yA, firstP.x, firstP.y, 2, lineColor);

    var A = {
        "x": xP,
        "y": yP
    };

    var pointP = JSON.stringify(A);

    // M, P, Q: the three points
    var A = A;
    var B = firstP;
    var C = {};

    var R = 200;

    var t = 0;
    var withTemp = true;

    var L = Math.sqrt(Math.pow((A.x - B.x), 2) + Math.pow((A.y - B.y), 2));
    
    while (/*(JSON.stringify(C) !== pointP) ||*/ (t < 20 && withTemp)) { 
        var C = M(A, B, R, L);

        if (C.x == "NaN" || C.y == "NaN") {
            console.log("x or y is NaN! Stopping... :(");
            return;
        }

        line(B.x, B.y, C.x, C.y, 2, lineColor);

        A.x = B.x;
        A.y = B.y;
        B.x = C.x;
        B.y = C.y;

        t++;
        console.log(t)
    }

    
    // Point P
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
