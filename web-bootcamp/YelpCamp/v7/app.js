const express		 =require("express"),
 	app			 =express(),
	bodyParser	 =require("body-parser"),
	mongoose	 =require("mongoose"),
	Campground 	 =require("./models/campground"),
	Comment		 =require("./models/comment"),
	User         =require("./models/user"),
	seedDB		 =require("./seed"),
	passport     =require("passport"),
	LocalStrategy=require("passport-local")

// requring Routes
const campgroundRoutes =require("./routes/campgrounds.js"),
	  commentRoutes    =require("./routes/comments.js"),
	  authRoutes       =require("./routes/index.js")


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

app.use(authRoutes)
app.use("/campgrounds",campgroundRoutes)
app.use("/campgrounds/:id/comments",commentRoutes)


app.listen(3000,function(){
	console.log("YelpCamp  Server listening in port 3000")
})