var express= require("express")
var app=express()


app.use(express.static("public"))
app.set("view engine","ejs")



app.get("/",function(req,res){
	res.render("home")
})

app.get("/fallinlovewith/:thing",function(req,res){
	var thing=req.params.thing
	res.render("love",{thingVar:thing})
})

app.get("/posts",function(req,res){
	var posts=[
		{title:"post one",author:"Amy"}mk,
		{title:"post two",author:"Ben"},
		{title:"post three",author:"Carrie"},
		{title:"post four",author:"David"},
	]
	res.render("post",{posts:posts});
	
})

app.listen(3000,function(){
	console.log("Server listening in port 3000")
})