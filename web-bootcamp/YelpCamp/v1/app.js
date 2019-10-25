var express=require("express")
var app=express()
var bodyParser=require("body-parser")

app.use(bodyParser.urlencoded({extend:true}))
app.set("view engine","ejs")
app.use(express.static("public"))

var campgrounds=[
		{name:"LAKE TAHOE",img:"https://theplanetd.com/images/camping-in-california-sequioa.jpg"},
		{name:"REDWOOD NATIONAL AND STATE PARKS",img:"https://theplanetd.com/images/camping-in-california-redwoods.jpg"},
		{name:"BIG SUR",img:"https://theplanetd.com/images/camping-in-california-big-sur.jpg"},
		{name:"LAKE TAHOE",img:"https://theplanetd.com/images/camping-in-california-sequioa.jpg"},
		{name:"REDWOOD NATIONAL AND STATE PARKS",img:"https://theplanetd.com/images/camping-in-california-redwoods.jpg"},
		{name:"BIG SUR",img:"https://theplanetd.com/images/camping-in-california-big-sur.jpg"},
	
	
	
	
	]


app.get("/",(req,res)=>{
	res.render("landing")
});




app.get("/campgrounds",(req,res)=>{
	res.render("campgrounds",{campgrounds:campgrounds})
});

app.get("/campgrounds/new",(req,res)=>{
	res.render("new")
	
})

app.post("/campgrounds",(req,res)=>{
	var name=req.body.name
	var image=req.body.image
	campgrounds.push({name:name,img:image})
	console.log("=======================")
	res.redirect("/campgrounds")
})



app.listen(3000,function(){
	console.log("YelpCamp-v1  Server listening in port 3000")
})