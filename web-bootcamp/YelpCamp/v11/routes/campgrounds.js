const express			=require("express"),
	  router 			=express.Router(),
	  Campground 	 	=require("../models/campground"),
	  middleware        =require("../middleware")
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
router.get("/new",middleware.isLoggedIn,(req,res)=>{
	res.render("campgrounds/new")
	
})

// CREATE
router.post("/",middleware.isLoggedIn,async (req,res)=>{
	// create a new campground and save it to data base
	try{
		let newCampground=req.body.campground;
		//add user data to the campground
		newCampground.author={
			id:req.user._id,
			username:req.user.username
		}
		let campground= await Campground.create(newCampground)
		// req.flash("success","Successfully Added Campground !")
		res.redirect("/campgrounds")
	}catch(err){
		req.flash("error","Some error occur");
		console.log(err)
	}
	
})

// SHOW
router.get("/:id",(req,res)=>{
// 	find the campground with provided id
	Campground.findById(req.params.id).populate("comments").exec(function(err,findCampground){
// 			render the show page
			if(err||!findCampground){
				console.log(err);
				console.log(findCampground);
				req.flash("error","Campground not found")
				res.redirect("back")
			}else{
				res.render("campgrounds/show",{campground:findCampground})
			}
	})
		
});


// EDIT campground routes:
router.get("/:id/edit",middleware.checkCampgroundOwnerhip,(req,res)=>{
	Campground.findById(req.params.id,(err,foundCamp)=>{
		if(err){console.log(err);return res.redirect("back")}
			res.render("campgrounds/edit",{campground:foundCamp})
	})
})
// UPDATE campground routes:
router.put("/:id",middleware.checkCampgroundOwnerhip,(req,res)=>{
	Campground.findByIdAndUpdate(req.params.id,req.body.campground,(err,foundCamp)=>{
		if(err){
			console.log(err);
			req.flash("error","Some error occur");
			res.redirect("/campgrounds");
		}else{
			// req.flash("success","Successfully Editted Campground ");
			res.redirect(`/campgrounds/${req.params.id}`)
		}
	})
})

// DESTORY campground routes(use pre-hook  to also delete comments) :
router.delete("/:id",middleware.checkCampgroundOwnerhip,(req,res)=>{
	Campground.findById(req.params.id,(err,campground)=>{
		if(err){
			console.log(err);
			req.flash("error","Some error occur");
			res.redirect("/campgrounds")
		}else{
			campground.remove((err)=>{
				if(err){console.log(err)
				}else{
					req.flash("success","Successfully Deleted Campground ")
					res.redirect("/campgrounds")
				}
			})
		}
	})
})


module.exports=router