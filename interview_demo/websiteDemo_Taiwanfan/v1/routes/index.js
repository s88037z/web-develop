require('dotenv').config()
const express		=require("express"),
	  router 		=express.Router(),
	  passport    	=require("passport"),
	  User         	=require("../models/user"),
	  Campground   	=require("../models/campground"),
	  asyncPackage = require("async"),
	  nodemailer    =require("nodemailer"),
	  crypto        =require("crypto"),
	  middleware    =require("../middleware")	


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

// user profile  edit route:
router.get("/users/:userId/edit",middleware.isLoggedIn,async (req,res)=>{
	
	try{
		if(req.user.id===req.params.userId){
			let user=await User.findById(req.params.userId)
			res.render('users/edit',{user:user});
	   
	   }else{
		   req.flash("error","抱歉,你無權執行此操作")
		   res.redirect("back")
	   }
		
				
	}catch(err){
		cosole.log(err)
		res.redirect("back")
	}	
});

// user profile update route:
router.put("/users/:userId",middleware.isLoggedIn,async (req,res)=>{
	try{
		if(req.user.id===req.params.userId){
			let user=await User.findByIdAndUpdate(req.params.userId,req.body.user);
			let campgrounds=await Campground.find().where("author.id",req.params.userId)
			// eval(require("locus"))
			res.redirect(`/users/${req.params.userId}`);
	   
	   }else{
		   req.flash("error","抱歉,你無權執行此操作")
		   res.redirect("back")
	   }
		
		
	}catch(err){
		req.flash("error","發生內部錯誤")
		cosole.log(err)
		res.redirect("back")
	}
})

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
			subject: 'TaiwanFan 密碼重設',
			text: '您好，您已申請TaiwanFan會員的密碼重設。\n\n' +
			  '請點擊以下連結，並完成重設密碼的步驟:\n\n' +
			  'http://' + req.headers.host + '/reset/' + token + '\n\n' +
			  '如果您並沒有作此申請，請忽略此信件。您的密碼並不會更改\n'
		  };
		await smtpTransport.sendMail(mailOptions);
		console.log('mail sent');
		req.flash('success', '已發送認證信件到信箱: ' + user.email + '。請收信並完成信件指示，以完成密碼變更。');
		res.redirect('/forgot');
		
	 } catch(err){
		console.log(err)
		req.flash('error', '內部發生錯誤')
		res.redirect('/forgot')
	}
})
	


// reset route:
router.get('/reset/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', '認證信件時效已過期');
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
          req.flash('error', '認證信件時效已過期');
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
            req.flash("error", "密碼不相符");
            return res.redirect('返回');
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
        subject: '您的密碼已經變更',
        text: '您好,\n\n' +
          'TaiwanFan通知您，您的帳號: ' + user.email + ' ，密碼已經變更.\n'
      };
	await  smtpTransport.sendMail(mailOptions)
	req.flash('success', '成功! 您的密碼已經變更');
	res.redirect('/campgrounds')
	}catch(err){
		console.log(err)
		req.flash('error', '內部錯誤發生')
		res.redirect('back')
	}	
})




module.exports=router