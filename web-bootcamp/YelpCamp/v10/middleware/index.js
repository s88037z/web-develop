const Campground 	 =require("../models/campground"),
	  Comment		 =require("../models/comment")



// all middleware go here

const middlewareObj={}

// to check login or not
middlewareObj.isLoggedIn=(req,res,next)=>{
	if(req.isAuthenticated()){return next()};
	req.session.returnTo = req.originalUrl
	res.redirect("/login")
}
// to check comment's owner
middlewareObj.checkCommentOwnerhip=async (req,res,next)=>{
	if(req.isAuthenticated()){
		try{
			let comment = await Comment.findById(req.params.comment_id);
			if(comment.author.id.equals(req.user._id)){
				return next()
			}
			res.redirect("back")
		}catch(err){console.log(err);res.redirect("back")}   
	}
	else{res.redirect("back")}
}
// to check campground's owner
middlewareObj.checkCampgroundOwnerhip= async (req,res,next)=>{
	if(req.isAuthenticated()){
		try{
			let camp = await Campground.findById(req.params.id);
			if(camp.author.id.equals(req.user._id)){
				return next()
			}
			res.redirect("back")
		}catch(err){console.log(err);res.redirect("back")}   
	}
	else{res.redirect("back")}
}
module.exports=middlewareObj
