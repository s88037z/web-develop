// var body= document.querySelector("body")
// var button= document.querySelector("button")
// var backgroundWhite= true

// button.addEventListener("click",function(){
//     if (backgroundWhite){
//         body.style.background="purple";
//         backgroundWhite=!backgroundWhite
//     }
//     else {
//         body.style.background="white";
//         backgroundWhite=!backgroundWhite
//     }

// })

// sloution.2

var body= document.querySelector("body")
var button= document.querySelector("button")
body.style.background="white"

button.addEventListener("click",function(){
    if (body.style.background==="white"){
        body.style.background="purple";
    }
    else {
        body.style.background="white";
    }

})
