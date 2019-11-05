require('dotenv').config()
const express		=require("express"),
	  router 		=express.Router(),
	  passport    	=require("passport"),
	  User         	=require("../models/user"),
	  Campground   	=require("../models/campground"),
	  asyncPackage = require("async"),
	  nodemailer    =require("nodemailer"),
	  crypto        =require("crypto")



// landing page
router.get("/",(req,res)=>{
	res.render("landing")
});


// show register form:
router.get("/register",(req,res)=>{
	res.render("register",{page:'register'})
});
// register logic:
router.post("/register",(req,res)=>{
	let newUser= new User({
		username:req.body.username,
		email:req.body.email,
		firstName:req.body.fisrtName,
		lastName:req.body.lastName	
	});
	// eval(require('locus'));
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
	res.render("login",{page:'login'})
});

// login logic (test):
router.post("/login",passport.authenticate("local",{failureRedirect:"/login",failureFlash: true}),async (req,res)=>{
	try{
		req.flash("success",`Welcome to YelpCamp! ${req.user.username}`);
		if(req.user.isAdmin===true){req.flash("success","You are Adminer!")}
		res.redirect(req.session.returnTo || '/campgrounds')
		delete req.session.returnTo		
		// eval(require("locus"))
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




// user's profile route:
router.get("/users/:userId",async (req,res)=>{
	try{
		let user=await User.findById(req.params.userId)
		let campgrounds=await Campground.find().where("author.id",req.params.userId)
		res.render('users/show',{user:user,campgrounds:campgrounds});
				
	}catch(err){
		cosole.log(err)
		res.redirect("back")
	}	
});


// forgot route:
router.get("/forgot",(req,res)=>{
	res.render("forgot")
})

router.post('/forgot', async (req, res, next) =>{
	try{
		//find the user and set token
		let buf = await crypto.randomBytes(20)
		let token= buf.toString('hex')
		let user = await User.findOne({ email: req.body.email })
		if (!user) {
			  req.flash('error', 'No account with that email address exists.');
			  return res.redirect('/forgot');
			}
		user.resetPasswordToken = token;
		user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
		await user.save();

		//send email
		let smtpTransport = nodemailer.createTransport({
			service: 'Gmail', 
			auth: {
			  user: 's88037z@gmail.com',
			  pass: process.env.GMAILPW
			}
		  });
		let mailOptions = {
			to: user.email,
			from: 's88037z@gmail.com',
			subject: 'Yelpcamp Password Reset',
			text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
			  'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
			  'http://' + req.headers.host + '/reset/' + token + '\n\n' +
			  'If you did not request this, please ignore this email and your password will remain unchanged.\n'
		  };
		await smtpTransport.sendMail(mailOptions);
		console.log('mail sent');
		req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
		res.redirect('/forgot');
		
	 } catch(err){
		console.log(err)
		req.flash('error', 'some error occurs')
		res.redirect('/forgot')
	}
})
	


// reset route:
router.get('/reset/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('reset', {token: req.params.token});
  });
});

router.post('/reset/:token', async (req, res)=>{
	try{
		//check user's token
	let user = await User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now()}})
	// eval(require("locus"))
	if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
	// reset the password and login user
	if(req.body.password === req.body.confirm) {
		await user.setPassword(req.body.password) //passport-local-mongoose
		user.resetPasswordToken = undefined;
		user.resetPasswordExpires = undefined;
		await user.save()
		// eval(require("locus"))
		req.logIn(user,function(err){
			if(err){console.log(err)}
		})	
	}else {
            req.flash("error", "Passwords do not match.");
            return res.redirect('back');
        }		
	//send mail
	let smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 's88037z@gmail.com',
          pass: process.env.GMAILPW
        }
      });
    let mailOptions = {
        to: user.email,
        from: 's88037z@gmail.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
	await  smtpTransport.sendMail(mailOptions)
	req.flash('success', 'Success! Your password has been changed.');
	res.redirect('/campgrounds')
	}catch(err){
		console.log(err)
		req.flash('error', 'some error occurs')
		res.redirect('back')
	}	
})




module.exports=router