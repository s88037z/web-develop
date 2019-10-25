var express=require("express")
var app=express()
var request = require('request');
// var bodyParser=require("body-parser")

app.set("view engine","ejs")
// app.use(bodyParser.urlencoded({extend:true}))


app.get("/",(req,res)=>{
	res.render("search")
});


app.get("/results",function(req,res){
	var query =req.query.movieKeyWord
	var url =`http://www.omdbapi.com/?apikey=thewdb&s=${query}`

	request(url, function (error, toresponse, body) {
		if(!error&&response.statusCode===200){
		  var data= JSON.parse(body);	// 	  console.log(url)
		  res.render("results",{data:data});
		}
	});
	
})





app.listen(3000,function(){
	console.log("Movie app's Server listening in port 3000")
})