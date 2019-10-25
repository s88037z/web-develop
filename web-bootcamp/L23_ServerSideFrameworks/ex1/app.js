var express = require("express")
var app=express()

app.listen(3000,function(){
	console.log("Server listening in port 3000")
})


app.get("/",function(req,res){
	res.send("Hi there,wellcome to my assignment")
})


app.get("/speak/:animals",function(req,res){
	res.send("The "+req.params.animals+" says "+animalsSound[req.params.animals])
	
})

// // solution code :
// app.get("/speak/:animals",function(req,res){
// 	var animal=req.params.animals.toLowerCase()
// 	res.send("The "+animal+" says "+animalsSound[animal])
	
// })

app.get("/repeat/:str/:strNum",function(req,res){
	var num= Number(req.params.strNum)
	var message =""
	for(var i =0;i<num;i++){
		message=message+req.params.str+" "
	}
	res.send(message)
	
})



app.get("*",function(req,res){
	res.send("Sorry,page not found ~QQ")
})
	


var animalsSound={
	pig:"Oink",
	cow:"Moo",
	dog:"Woof Woof"
}
