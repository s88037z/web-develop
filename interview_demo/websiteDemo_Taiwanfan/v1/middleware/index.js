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
middlewareObj.checkCommentOwnership=async (req,res,next)=>{
	if(req.isAuthenticated()){
		try{
			let comment = await Comment.findById(req.params.comment_id);
			if(comment.author.id.equals(req.user._id)||req.user.isAdmin ){
				return next()
			}
			req.flash("error","抱歉，你沒有權限執行此操作");
			res.redirect("back")
		}catch(err){
			console.log(err);
			req.flash("error","發生錯誤");
			res.redirect("back")
		}   
	}
	else{
		req.flash('error','請先登入')
		res.redirect("back")
	}
}
// to check campground's owner
middlewareObj.checkCampgroundOwnership= async (req,res,next)=>{
	if(req.isAuthenticated()){
		try{
			let camp = await Campground.findById(req.params.id);
			if(camp.author.id.equals(req.user._id)||req.user.isAdmin){
				return next()
			}
			req.flash("error","抱歉，你沒有權限執行此操作")
			res.redirect("back")
		}catch(err){
			console.log(err);
			req.flash("error","發生錯誤")
			res.redirect("back")}   
	}else{
		req.flash("error","請先登入");
		res.redirect("back")
	}
}




module.exports=middlewareObj
