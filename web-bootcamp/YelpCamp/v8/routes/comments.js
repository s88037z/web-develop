const express		 =require("express"),
	  router 		 =express.Router({mergeParams:true}),
	  Campground 	 =require("../models/campground"),
	  Comment		 =require("../models/comment")


// Comment-New
router.get("/new",isLoggedIn,(req,res)=>{
	Campground.findById(req.params.id).populate("comments").exec(function(err,findCampground){
		if(err){console.log(err)}
		else{res.render("comments/new",{campground:findCampground})}
	})	
})

// Comment-Create
router.post("/", isLoggedIn ,async (req,res)=>{
	try{
		let comment = await Comment.create(req.body.comment);
		let campground = await Campground.findById(req.params.id);
		//add user(username & id) to comment ,and save the comment
		comment.author.id=req.user._id;
		comment.author.username=req.user.username;
		comment.save();
		//add the comment to campground &save campground
		campground.comments.push(comment);
		campground.save();

		res.redirect(`/campgrounds/${campground._id}`)	
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
	// 				//add user(username & id) to comment ,and save the comment
	// 				comment.author.id=req.user._id;
	// 				comment.author.username=req.user.username
	// 				comment.save();
	// 				//add the comment to campground &save it
	// 				findCampground.comments.push(comment);
	// 				findCampground.save();
	// 				res.redirect("/campgrounds/"+findCampground._id)
	// 			}	
	// 		});

	// 	}
	// })	
})

// define a middleware to dectect login or not
function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){return next()};
	res.redirect("/login")
}

module.exports=router
