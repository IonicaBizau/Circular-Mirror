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
    cWidth = canvas.width;
    cHeight = canvas.height;
    r = cWidth / 2 - 40;
    marginLeft = cWidth - r - cWidth / 2;

    xP = marginLeft;
    yP = cHeight / 2;
    
    xO = cWidth / 2;
    yO = cHeight / 2;
    
    // Axele de coodonate
    canvasArrow(context, 10, cHeight / 2, cWidth, cHeight / 2);
    canvasArrow(context, cWidth / 2, cHeight-10, cWidth / 2, 10);
        
    // Cercul principal
    circle(xO, yO, r, 1, '#003300');
    // Cercul din centru
    circle(xO, yO, 2, 3, '#003300');
    
    
    
    // Linia din stanga
    line(marginLeft, 10, marginLeft, cHeight-10, 0.5, "red");
}
    
// ~ ~ ~ ~ ~ ~ On load ... ~ ~ ~ ~ ~ ~ ~ ~
$("document").ready(function() {
    init();
    
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
        $("center").append("<canvas id='myCanvas' width='400' height='400'></canvas>");
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
    // Punctul M
    var yM = 0;
    var xM = 0;
    
    // Punctul A
    circle(xA, yA, 2, 3, lineColor);
    
    // Se cauta xM, yM
    for(var i = xP + 1; i <= xO + r; i += 0.1) {
        // Ecuatia dreptei AP
        var yM1 = (i - xP) * (yA - yP)/(xA - xP) + yP; 
        // Ecuatia cercului
        var yM2 = - (Math.sqrt(Math.pow(r, 2) - Math.pow((i - xO), 2)) - yO);
        
        if(Math.round(yM1) === Math.round(yM2)) {
            xM = i;
            yM = yM2;
            line(xA, yA, i, yM2, 1, lineColor);
        }
    }
    
    // Lungimea laturii din interior (distanta dintre P si M)
    var length;
    if(yM !== 0) { // diferit de 0
        length = Math.sqrt(Math.pow((xM - xP), 2) + Math.pow((yM - yP), 2));
        document.getElementById("length").innerHTML = "Lungimea laturii: " + length;
    }
    
    // Urmatoarea latura
    for(var i = xM + 1; i <= xO + r; i += 0.1) {
        // Folosim lungimea laturii (distanta dintre doua puncte)
        var yN = (Math.sqrt( - (Math.pow(length, 2) - Math.pow((i - xM), 2))) + yM); 
    
        // Lungime temp
        var dT  = Math.sqrt(Math.pow((i - xM), 2) + Math.pow((yN - yM), 2))
        
        // Ecuatia cercului
        var yN2 = - (Math.sqrt(Math.pow(r, 2) - Math.pow((i - xO), 2)) - yO);
        
        if(yN) {
            line(xM, yM, i, yN2, 2, lineColor);
            return;
        }
    }
    
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