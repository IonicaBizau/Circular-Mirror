/*
        //////////////////////////////////////////\
       ////  Author: Ionica Bizau            ////\/\
      ////  Copyright (C) 2012 Ionica BIzau ////\/\/\
     ////  GNU LICENSE                     ////\/\/\/
    //////////////////////////////////////////\/\/\/
    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\/\/
     \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\/
      -------------------------------------------
*/

// Canvas
var canvas, context;

// Variables
var cWidth, cHeight;
var lineColor = "blue";

// Raza
var r;
    
// Margin left
var marginLeft;

// Points
var xP, yP;
var xO, yO;

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
    
    // Axele de coodonate
    canvasArrow(context, -250, 0, 250, 0);
    canvasArrow(context, 0, -250, 0, 250);
        
    // Cercul principal
    circle(xO, yO, r, 1, '#003300');
    // Cercul din centru
    circle(xO, yO, 2, 3, '#003300');
    
    // Linia din stanga
    line(-200, 200, -200, -200, 0.5, "red");
    // ... do stuff with the transformed origin
    //context.restore();
}


/**
 *             |-------------------------|
 *    R -----> | *********************** | 
 *    L -----> | *********************** | ------> M(x, y)
 * (x, y) ---> | *********************** |
 * (x1, y1) -> | *********************** |
 *             |-------------------------| 
 */

/*
 * Get the next point of intersection with circle
 * @param {Object} M1
 * @param {Object} M2
 * @param {Object} R
 * @param {Object} L
 */
function M(M1, M2, R, L) {  
    // Initialize variables: a, b, x, y;
    var a = M1.x, b = M1.y;
    
    var x = 0, y = 0;
    var x1 = M2.x, y1 = M2.y;

    // If b is 0, and a is NOT 0
    if (b === 0 && a !== 0) {
        //     a^2 - L^2 + R^22
        // x = ---------------
        //          2*a
         
        x = (Math.pow(a, 2) - Math.pow(L, 2) + Math.pow(R, 2)) / (2 * a);

        //           ___________________________
        //          /       (a^2 - L^2 + R^2)
        // y =  \  /  R^2 - -------------------
        //       \/               4 * a^2

        y = Math.sqrt(Math.pow(R, 2) - Math.pow((Math.pow(a, 2) - Math.pow(L, 2) + Math.pow(R, 2)), 2)/(4 * Math.pow(a, 2)));

        if (y === y1) {
             
            //            ___________________________
            //           /       (a^2 - L^2 + R^2)^2
            // y = - \  /  R^2 - -------------------
            //        \/               4 * a^2

            y =  - y;
        }
    }
    else {
        // If a^2 + b^2 is NOT 0 <=> a, b can't be 0 in same time
        // Also, b is not 0
        if (Math.pow(a, 2) + Math.pow(b, 2) !== 0) {
             //                                  _______________________________________________________________________________________________________
             //            1        (           /                                                                                                                                )
             // x = -------------- (  a^3 - \  /  (-b^2 (a^4 + 2a^2*b^2 - 2a^2*L^2 - 2a^2*R^2 + b ^ 4 - 2b^2 * L^2 - 2b^2*R^2 + L^4 - 2L^2*R^2 + R^4 ))  + a*b^2 - a*L^2 + a*R^2  )
             //      2(a^2 + b^2)   (        \/                                                                                                                                  )
             //
             
             x = (1 / (2 * (Math.pow(a, 2) + Math.pow(b, 2)))) 
                                   * (Math.pow(a, 3) - Math.sqrt(-Math.pow(b, 2) * (a^4 + 2a^2*b^2 - 2a^2*L^2 - 2a^2*R^2 + b ^ 4 - 2b^2 * L^2 - 2b^2*R^2 + L^4 - 2L^2*R^2 + R^4 )
        }
    }
    
    return {
        "x": x,
        "y": y
    };
}

// ~ ~ ~ ~ ~ ~ On load ... ~ ~ ~ ~ ~ ~ ~ ~
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
        update($("#xValue").val(), $("#yValue").val());
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

// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
// Update the UI
function update(xA, yA) {
    xA = parseInt(xA);
    yA = parseInt(yA);
    
    // Punctul M
    var yM = 0;
    var xM = 0;
    
    // Punctul A
    circle(xA, yA, 2, 3, lineColor);    
    
    var m = (yA / (200 + xA));
    var pM = M(m, xA, yA);
    
    var alfa = Math.atan(m) * 180 / Math.PI;
    var beta = - 180 + 3 * alfa;
    
    var xM = pM.x, yM = pM.y;
    line(xA, yA, xM, yM, 2, lineColor);
    
    console.log(beta);
    
    m = Math.tan(beta * Math.PI/180);
    
    console.log("tgABeta: " + m);
    
    var pM2 = M(m, xM, yM);
    xA = xM;
    yA = yM;
    
    xM = -pM2.x;
    yM = pM2.y;
    
    console.log(xA);
    
    line(xA, yA, xM, yM, 2, lineColor);

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
