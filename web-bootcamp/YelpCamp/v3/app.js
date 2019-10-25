var express=require("express"),
 	app=express(),
	bodyParser=require("body-parser"),
	mongoose=require("mongoose"),
	Campground = require("./models/campground"),
	seedDB=require("./seed")

mongoose.connect("mongodb://localhost:27017/yelp_camp_v3", { useNewUrlParser: true ,useUnifiedTopology: true})

app.use(bodyParser.urlencoded({extend:true}))
app.set("view engine","ejs")
app.use(express.static("public"))


seedDB()





app.get("/",(req,res)=>{
	res.render("landing")
});



// INDEX
app.get("/campgrounds",(req,res)=>{
// 	get all campground from db:
	Campground.find({},function(err,allCampgrounds){
		if(err){console.log(err)}
		else{
			res.render("index",{campgrounds:allCampgrounds})}
		})
});

// NEW
app.get("/campgrounds/new",(req,res)=>{
	res.render("new")
	
})

// CREATE
app.post("/campgrounds",(req,res)=>{
	var name=req.body.name
	var image=req.body.image
	var desc=req.body.description
	var newCampground={name:name,image:image,description:desc}

	// create a new campground and save it to data base
	Campground.create(newCampground,
		function(err,campground){
			if(err){console.log(err)}
			else{res.redirect("/campgrounds")}
		})
 })

// SHOW
app.get("/campgrounds/:id",(req,res)=>{
// 	find the campground with provided id
	Campground.findById(req.params.id).populate("comments").exec(function(err,findCampground){
			if(err){console.log(err)}
// 			render the show page
			else{res.render("show",{campground:findCampground})}
	})
		
});




app.listen(3000,function(){
	console.log("YelpCamp-v2  Server listening in port 3000")
})