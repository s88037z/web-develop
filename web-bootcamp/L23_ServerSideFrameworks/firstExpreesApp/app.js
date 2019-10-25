var express =require("express");
var app=express();


// "/" =>"Hello"
app.get("/",function(req,res){
	res.send("Hello there")
	
})

// "/goodbye" =>"bye!"
app.get("/goodbye",function(req,res){
	res.send("bye~bye~")
	
})

// "/dogs" => "meow!~"
app.get("/dogs",function(req,res){
	console.log("someone made a '/dogs' request")
	res.send("Meow~")
	
})
// route pattern
app.get("/r/:category/comments/:id/:title",function(req,res){
	console.log(req.params);
	var categ=req.params.category
	var id=req.params.id
	var title=req.params.title
	res.send("wellcome to "+categ+", ur id is "+id+" and the title is"+title)
})


// star route matcher
app.get("*",function(req,res){
	
	res.send("it's a star route!")
})

// tell express to listen for request(start server)
app.listen(3000, function () {
  console.log("Server listening on port 3000");
});