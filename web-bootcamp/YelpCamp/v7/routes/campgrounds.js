const express			=require("express"),
	  router 			=express.Router(),
	  Campground 	 	=require("../models/campground")

// INDEX
router.get("/",(req,res)=>{
// 	get all campground from db:
	Campground.find({},function(err,allCampgrounds){
		if(err){console.log(err)}
		else{
			res.render("campgrounds/index",{campgrounds:allCampgrounds})}
		})
});

// NEW
router.get("/new",(req,res)=>{
	res.render("campgrounds/new")
	
})

// CREATE
router.post("/",(req,res)=>{
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
router.get("/:id",(req,res)=>{
// 	find the campground with provided id
	Campground.findById(req.params.id).populate("comments").exec(function(err,findCampground){
			if(err){console.log(err)}
// 			render the show page
			else{res.render("campgrounds/show",{campground:findCampground})}
	})
		
});


module.exports=router