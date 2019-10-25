const express		 =require("express"),
	  router 		 =express.Router({mergeParams:true}),
	  Campground 	 =require("../models/campground"),
	  Comment		 =require("../models/comment"),
	  middleware     =require("../middleware")


// Comment-New
router.get("/new",middleware.isLoggedIn,(req,res)=>{
	Campground.findById(req.params.id).populate("comments").exec(function(err,findCampground){
		if(err){console.log(err)}
		else{res.render("comments/new",{campground:findCampground})}
	})	
})

// Comment-Create
router.post("/", middleware.isLoggedIn ,async (req,res)=>{
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
		// req.flash("success","Successfully Added Comment ")
		res.redirect(`/campgrounds/${campground._id}`)	
	}catch(err){
		req.flash("error","Some error occur");
		console.log(err);
		res.redirect("back")
	}

	
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

// Comment EDIT
router.get("/:comment_id/edit",middleware.checkCommentOwnerhip,async (req,res)=>{
	try{
		//make sure the campground's id is valid
		let campground= await Campground.findById(req.params.id)
		if(!campground){throw (new Error("Not valid campground"))}
		
		let comment= await Comment.findById(req.params.comment_id)
		res.render("comments/edit",{comment:comment,campgroundId:req.params.id})
	}catch(err){
		console.log(err);
		req.flash("error","Some error occur");
		res.redirect("back")
	}
})

// Comment UPDATE
router.put("/:comment_id",middleware.checkCommentOwnerhip,async (req,res)=>{
	try{
		await Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment);
		res.redirect(`/campgrounds/${req.params.id}`)
	}catch(err){
		console.log(err);
		req.flash("error","Some error occur");
		res.redirect("back")
	}
})

// Comment DESTORY
router.delete("/:comment_id",middleware.checkCommentOwnerhip,async (req,res)=>{
	try{
		await Comment.findByIdAndRemove(req.params.comment_id);
		req.flash("success","Successfully Deleted comment ")
		res.redirect(`/campgrounds/${req.params.id}`)
	}catch(err){console.log(err),res.redirect("back")}
})

module.exports=router
