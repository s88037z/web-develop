// space is important! it's "rgb(255, 0, 0)" not"rgb(255,0,0)"
var squresOfLeve=6
var colors=[];
var pickedColor;

var resetBut=document.querySelector("#reset")
var squares=document.querySelectorAll(".square");
var colorDisplay=document.querySelector("#colorDisplay")
var messageDisplay=document.querySelector("#message")
var h1=document.querySelector("h1")
var easyBtn=document.querySelector("#easyBtn")
var hardBtn=document.querySelector("#hardBtn")
var modeButtons= document.querySelectorAll(".mode")


init()

function init(){
    // setup mode button's listener
    for(i=0;i<modeButtons.length;i++){
        modeButtons[i].addEventListener("click",function(){
            modeButtons[0].classList.remove("selected");
            modeButtons[1].classList.remove("selected");
            this.classList.add("selected");
            this.textContent==="Easy" ? squresOfLeve=3 : squresOfLeve=6;
            reset()
        })
    };

    //setup squres's interaction
    for(var i =0;i<squares.length;i++){
        // add click listeners to squares
        squares[i].addEventListener("click",function(){
            if(this.style.backgroundColor!==pickedColor){
                this.style.backgroundColor="#232323"
                messageDisplay.textContent="Try again!"
            }
            // when win the game(pick the right one)
            else{
                messageDisplay.textContent="Correct!"
                changeColor(pickedColor)
                h1.style.backgroundColor=pickedColor
                // change the resetbut's text of"play again"
                resetBut.textContent="Play Again"
            }
        })
    }
    reset()
}






// resetbutton's interaction
resetBut.addEventListener("click",function(){
    reset()

    })




// easy&hard-level toggle- with class="mode" 
for(i=0;i<modeButtons.length;i++){
    modeButtons[i].addEventListener("click",function(){
        modeButtons[0].classList.remove("selected");
        modeButtons[1].classList.remove("selected");
        this.classList.add("selected");
        this.textContent==="Easy" ? squresOfLeve=3 : squresOfLeve=6;
        reset()
    })
}





function reset(){
    // generate all new colors
    colors=generateRandomColors(squresOfLeve);
    // pick a new random coloe  and assigment to display
     pickedColor=pickColor();
     colorDisplay.textContent=pickedColor;
    //renew the squres's colors by level
     for(var i =0;i<squares.length;i++){
        if (colors[i]){
        squares[i].style.display="block"
        squares[i].style.backgroundColor=colors[i];
        }
        else {squares[i].style.display="none"}
    }
    // reset the title's background
    h1.style.backgroundColor="steelblue"
    // reset this button'name
    resetBut.textContent="New Colors"
    // reset message's display
    messageDisplay.textContent=""

}
    



function pickColor(){
    var random=Math.floor(Math.random()*colors.length)
    return colors[random]
}


function generateRandomColors(num){
    // make random-arrays of colors
    var arr=[]
    for(var i=0;i<num;i++){
        arr.push(randomColor())
    }
    return arr
}

function randomColor(){
    var r=Math.floor(Math.random()*256)
    var g=Math.floor(Math.random()*256)
    var b=Math.floor(Math.random()*256)
    return  "rgb("+r+", "+g+", "+b+")"
    
}



function changeColor(color){
// loop through all the squres,change colors to the matched one
    for(var i =0;i<squares.length;i++){
        squares[i].style.backgroundColor=color
    }
}
