var console;

$(document).ready(function(){
    console = {
        log: function(message) {
            $("#console").append(message + "\n");
        }
    }
    console.log("Test...");
    
    var M1 = {
        x: -200,
        y: 0
    };
    
    var l = 346.3;
    
    var M2 = M(l, M1);
    
    console.log(M2);
});

function M(l, mN) {
    var x1 = mN.x;
    var y1 = mN.y;
    
    // Coeficientii
    var a = 16 * Math.pow(10, 4);
    var b = 4 * (y1 * Math.pow(l, 2) - 8 * Math.pow(10, 4) * y1);
    var c = - 64 * Math.pow(10, 8) + Math.pow(l, 4) - 16 * Math.pow(10, 4) * Math.pow(l, 2) - 16 * Math.pow(10, 4) * x1;
    
    console.log("a = " + a + " b = " + b + " c = " + c)
    
    // Delta
    var delta = Math.pow(b, 2) - 4 * a * c;
    console.log(delta);
    
    
    var y21 = (-b + Math.sqrt(delta)) / (2 * a);
    var y22 = (-b - Math.sqrt(delta)) / (2 * a);
    
    return y21 + " " + y22;
}
