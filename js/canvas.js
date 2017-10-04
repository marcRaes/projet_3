var md = false;
var canvas = document.getElementById("signature");
var context, posx, posy, mousePos, rect;

canvas.addEventListener("mousedown", down);
canvas.addEventListener("mouseup", toggledraw);
canvas.addEventListener("mousemove", 
function(evt){
    mousePos = getMousePos(canvas, evt);
    posx = mousePos.x;
    posy = mousePos.y;
    draw(canvas, posx, posy);
});

function down(){
    md = true;
    context.beginPath();
    context.moveTo(posx, posy);
}

function toggledraw(){
    md = false;
}
function getMousePos(canvas, evt){
    rect = canvas.getBoundingClientRect();
    return{
        x:evt.clientX - rect.left,
        y:evt.clientY - rect.top
    };
}

function draw(canvas, posx, posy){
    context = canvas.getContext("2d");
    context.lineWidth = 5;

    if(md){
        context.lineTo(posx, posy);
        context.stroke();
    }
}

var clear = document.getElementById("bouttonEffacer").addEventListener("click", function(){
    context.clearRect(0, 0, 800, 200);
});