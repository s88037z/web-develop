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
			req.flash("error",err.message);
			return res.redirect("/register")
		}
		passport.authenticate("local")(req,res,()=>{
			req.flash("success",`Welcome to YelpCamp ${user.username}`);
			res.redirect("/campgrounds")
		})
	})
});

// show login form:
router.get("/login",(req,res)=>{
	res.render("login")
});

// login logic (test):
router.post("/login",passport.authenticate("local",{failureRedirect:"/login",failureFlash: true}),async (req,res)=>{
	try{
		req.flash("success",`Welcome to YelpCamp ${req.user.username}`);
		res.redirect(req.session.returnTo || '/campgrounds')
		delete req.session.returnTo		
	}catch(err){console.log(err);res.redirect('/campgrounds')}
	
	
})

// login logic (old):
// router.post("/login",
// 	passport.authenticate("local",{
// 		successRedirect:"/campgrounds",
// 		failureRedirect:"/login",
// 		})
// )

// logout logic:
router.get("/logout",(req,res)=>{
	req.flash('success',`Bye~Bye~${req.user.username}`);
	req.logout();
	delete req.session.returnTo	
  	res.redirect('/campgrounds');
});




module.exports=router