const express		=require("express"),
	  router 		=express.Router(),
	  passport    	=require("passport"),
	  User         	=require("../models/user")

// landing page
router.get("/",(req,res)=>{
	res.render("landing")
});


// show register form:
router.get("/register",(req,res)=>{
	res.render("register")
});
// register logic:
router.post("/register",(req,res)=>{
	let newUser= new User({username:req.body.username});
	User.register(newUser,req.body.password,(err,user)=>{
		if(err){
			console.log(err);
			return res.redirect("/register")
		}
		passport.authenticate("local")(req,res,()=>{
			res.redirect("/campgrounds")
		})
	})
});

// show login form:
router.get("/login",(req,res)=>{
	res.render("login")
});

// login logic:
router.post("/login",passport.authenticate("local",{
	successRedirect:"/campgrounds",
	failureRedirect:"/login",
}));


// logout logic:
router.get("/logout",(req,res)=>{
	req.logout();
  	res.redirect('/campgrounds');
});


// define a middleware to dectect login or not
function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){return next()};
	res.redirect("/login")
}

module.exports=router