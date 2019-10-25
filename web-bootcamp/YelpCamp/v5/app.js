var express		=require("express"),
 	app			=express(),
	bodyParser	=require("body-parser"),
	mongoose	=require("mongoose"),
	Campground 	=require("./models/campground"),
	Comment		=require("./models/comment"),
	seedDB		=require("./seed")

mongoose.connect("mongodb://localhost:27017/yelp_camp_v5", { useNewUrlParser: true ,useUnifiedTopology: true})

app.use(bodyParser.urlencoded({extended:true}))
app.set("view engine","ejs")
app.use(express.static(__dirname+"/public"))


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
			res.render("campgrounds/index",{campgrounds:allCampgrounds})}
		})
});

// NEW
app.get("/campgrounds/new",(req,res)=>{
	res.render("campgrounds/new")
	
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
			else{res.render("campgrounds/show",{campground:findCampground})}
	})
		
});
// ===============================
// Comments Routes
// ===============================
// Comment-New
app.get("/campgrounds/:id/comments/new",(req,res)=>{
	Campground.findById(req.params.id).populate("comments").exec(function(err,findCampground){
		if(err){console.log(err)}
		else{res.render("comments/new",{campground:findCampground})}
	})	
})

// Comment-Create
app.post("/campgrounds/:id/comments",async (req,res)=>{
	try{
		let comment = await Comment.create(req.body.comment);
		let campground = await Campground.findById(req.params.id);
		campground.comments.push(comment);
		campground.save();
		res.redirect("/campgrounds/"+campground._id)	
	}catch(err){console.log(err)}

	
	// Colt's version:	
	// Campground.findById(req.params.id,function(err,findCampground){
	// 	if(err){
	// 		console.log(err);
	// 		res.redirect("/campgrounds");
	// 	}else{
	// 		Comment.create(req.body.comment,function(err,comment){
	// 			if(err){console.log(err);}
	// 			else{
	// 				findCampground.comments.push(comment);
	// 				findCampground.save();
	// 				res.redirect("/campgrounds/"+findCampground._id)
	// 			}	
	// 		});

	// 	}
	// })	
	
 	
})




app.listen(3000,function(){
	console.log("YelpCamp-v2  Server listening in port 3000")
})