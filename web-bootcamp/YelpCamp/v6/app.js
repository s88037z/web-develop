var express		 =require("express"),
 	app			 =express(),
	bodyParser	 =require("body-parser"),
	mongoose	 =require("mongoose"),
	Campground 	 =require("./models/campground"),
	Comment		 =require("./models/comment"),
	User         =require("./models/user"),
	seedDB		 =require("./seed"),
	passport     =require("passport"),
	LocalStrategy=require("passport-local")

mongoose.connect("mongodb://localhost:27017/yelp_camp_v6", { useNewUrlParser: true ,useUnifiedTopology: true})

app.use(bodyParser.urlencoded({extended:true}))
app.set("view engine","ejs")
app.use(express.static(__dirname+"/public"))


seedDB()



// Passport configuration
app.use(require("express-session")({
		secret:"there are some secret words for cookies",
		resave:false,
		saveUninitialized:false,
		}))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next)=>{
	res.locals.currentUser=req.user;
	next();
})

// Routes
app.get("/",(req,res)=>{
	res.render("landing")
});



// INDEX
app.get("/campgrounds",(req,res)=>{
// 	get all campground from db:
	console.log(res.locals)
	Campground.find({},function(err,allCampgrounds){
		if(err){console.log(err)}
		else{
			res.render("campgrounds/index",{campgrounds:allCampgrounds})}
		})
});

// NEW
app.get("/campgrounds/new",(req,res)=>{
	res.render("campgrounds/new")
	
})

// CREATE
app.post("/campgrounds",(req,res)=>{
	var name=req.body.name
	var image=req.body.image
	var desc=req.body.description
	var newCampground={name:name,image:image,description:desc}

	// create a new campground and save it to data base
	Campground.create(newCampground,
		function(err,campground){
			if(err){console.log(err)}
			else{res.redirect("/campgrounds")}
		})
 })

// SHOW
app.get("/campgrounds/:id",(req,res)=>{
// 	find the campground with provided id
	Campground.findById(req.params.id).populate("comments").exec(function(err,findCampground){
			if(err){console.log(err)}
// 			render the show page
			else{res.render("campgrounds/show",{campground:findCampground})}
	})
		
});
// ===============================
// Comments Routes
// ===============================
// Comment-New
app.get("/campgrounds/:id/comments/new",isLoggedIn,(req,res)=>{
	Campground.findById(req.params.id).populate("comments").exec(function(err,findCampground){
		if(err){console.log(err)}
		else{res.render("comments/new",{campground:findCampground})}
	})	
})

// Comment-Create
app.post("/campgrounds/:id/comments", isLoggedIn ,async (req,res)=>{
	try{
		let comment = await Comment.create(req.body.comment);
		let campground = await Campground.findById(req.params.id);
		campground.comments.push(comment);
		campground.save();
		res.redirect("/campgrounds/"+campground._id)	
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
	// 				findCampground.comments.push(comment);
	// 				findCampground.save();
	// 				res.redirect("/campgrounds/"+findCampground._id)
	// 			}	
	// 		});

	// 	}
	// })	
	
 	
})

// ===============================
// Auth Routes
// ===============================
// show register form:
app.get("/register",(req,res)=>{
	res.render("register")
});
// register logic:
app.post("/register",(req,res)=>{
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
app.get("/login",(req,res)=>{
	res.render("login")
});

// login logic:
app.post("/login",passport.authenticate("local",{
	successRedirect:"/campgrounds",
	failureRedirect:"/login",
}));


// logout logic:
app.get("/logout",(req,res)=>{
	req.logout();
  	res.redirect('/campgrounds');
});


// define a middleware to dectect login or not
function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){return next()};
	res.redirect("/login")
}

app.listen(3000,function(){
	console.log("YelpCamp  Server listening in port 3000")
})