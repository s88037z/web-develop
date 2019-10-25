var express= require("express")
var app=express()
var bodyParser=require("body-parser")

app.use(bodyParser.urlencoded({extend:true}))
app.use(express.static("public"))
app.set("view engine","ejs")
var friends=["Amy","Luke","Kevin","Luic","Hulk"];



app.get("/",function(req,res){
	res.render("home")
})

app.get("/friends",function(req,res){
	res.render("friends",{friends:friends});
})


app.post("/addfriends",function(req,res){
	var newfriend=req.body.newfriend;
	friends.push(newfriend);
	res.redirect("/friends");
})


app.listen(3000,function(){
	console.log("Server listening in port 3000")
})