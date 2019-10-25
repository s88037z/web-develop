var p1But=document.querySelector("#p1")
var p2But=document.querySelector("#p2")
var reBut=document.querySelector("#reset")
var p1Display=document.querySelector("#p1Display")
var p2Display=document.querySelector("#p2Display")
var numInput=document.querySelector("input[type='number']")
var endPointDisplay=document.querySelector("#endPointDisplay")

var gameOver=false
var winiingScore=5


var p1Score=0
var p2Score=0

p1But.addEventListener("click",function(){
    if(!gameOver){
        p1Score++
        // console.log(p1Score,winiingScore)
        if(p1Score===winiingScore){gameOver=true;p1Display.classList.add("winner")}
        p1Display.textContent=p1Score
        }
})

p2But.addEventListener("click",function(){
    if(!gameOver){
        p2Score++
        if(p2Score===winiingScore){gameOver=true;p2Display.classList.add("winner")}
        p2Display.textContent=p2Score
        }
})

function reset(){
    gameOver=false
    p1Score=0
    p2Score=0
    p1Display.textContent=p1Score
    p2Display.textContent=p2Score
    p1Display.classList.remove("winner")
    p2Display.classList.remove("winner")
}



reBut.addEventListener("click",reset)


numInput.addEventListener("change",function(){
    winiingScore=Number(numInput.value);
    endPointDisplay.textContent=numInput.value;
    reset();
})