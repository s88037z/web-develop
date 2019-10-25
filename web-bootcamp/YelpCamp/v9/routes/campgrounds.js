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
router.get("/new",isLoggedIn,(req,res)=>{
	res.render("campgrounds/new")
	
})

// CREATE
router.post("/",isLoggedIn,async (req,res)=>{
	// create a new campground and save it to data base
	try{
		let newCampground=req.body.campground;
		//add user data to the campground
		newCampground.author={
			id:req.user._id,
			username:req.user.username
		}
		let campground= await Campground.create(newCampground)
		res.redirect("/campgrounds")
	}catch(err){console.log(err)}
	
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

// Define a middleware to dectect login or not
function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){return next()};
	res.redirect("/login")
}


module.exports=router