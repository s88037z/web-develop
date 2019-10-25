const Campground 	 =require("../models/campground"),
	  Comment		 =require("../models/comment")



// all middleware go here

const middlewareObj={}

// to check login or not
middlewareObj.isLoggedIn=(req,res,next)=>{
	if(req.isAuthenticated()){return next()};
	req.session.returnTo = req.originalUrl;
	req.flash('error','Please Login First')
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
			req.flash("error","Sorry You don't have the permission to do that");
			res.redirect("back")
		}catch(err){
			console.log(err);
			req.flash("error","Some error occur");
			res.redirect("back")
		}   
	}
	else{
		req.flash('error','Please Login First')
		res.redirect("back")
	}
}
// to check campground's owner
middlewareObj.checkCampgroundOwnerhip= async (req,res,next)=>{
	if(req.isAuthenticated()){
		try{
			let camp = await Campground.findById(req.params.id);
			if(camp.author.id.equals(req.user._id)){
				return next()
			}
			req.flash("error","Sorry You don't have the permission to do that")
			res.redirect("back")
		}catch(err){
			console.log(err);
			req.flash("error","Some error occur")
			res.redirect("back")}   
	}else{
		req.flash("error","Please Login to do that");
		res.redirect("back")
	}
}
module.exports=middlewareObj
