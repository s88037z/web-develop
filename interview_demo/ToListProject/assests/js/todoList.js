

// Check off todos by click
$("ul").on("click","li",function(){
    $(this).toggleClass("completed")
})

// delet by click <span>icon</span>
$("ul").on("click","li span",function(event){
    $(this).parent().fadeOut(500,function(){
        $(this).remove();
    });
    event.stopPropagation();
})


//type new Todos
$("input[type='text']").on("keypress",function(event){
    if(event.which===13){
        var todoText=$(this).val()
        // set input's value to empty
        $(this).val("");
        $("ul").append("<li><span><i class='fas fa-trash-alt'></i></span>"+todoText+"</li>")
    }    

})

// click "+" sign to add new 
$("#toggleBtn").on("click",function(){
    $("input").fadeToggle()


})