var express		=require("express"),
 	app			=express(),
	bodyParser	=require("body-parser"),
	mongoose	=require("mongoose"),
	passport    =require("passport"),
	LocalStrategy= require("passport-local"),
	passportLocalMongoose=require("passport-local-mongoose"),
	User         =require("./models/user.js")

mongoose.connect("mongodb://localhost:27017/auth_demo", { useNewUrlParser: true ,useUnifiedTopology: true})
app.set("view engine","ejs")

app.use(bodyParser.urlencoded({extended:true}))
app.use(require("express-session")({
	secret:"these are some strings that u can make ur own to encode and decode the information of session",
	resave:false,
	saveUninitialized:false,
}))


app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())



// Routes


app.get("/secret",isLoggedIn,(req,res)=>{
	res.render("secret")
});




app.get("/",(req,res)=>{
	res.render("home")
});

// Auth Route

// show a form
app.get("/register",(req,res)=>{
	res.render("register")
});
// handling user sign up
app.post("/register",(req,res)=>{
	User.register(new User({username:req.body.username}),req.body.password,(err,user)=>{
		if(err){console.log(err);return res.render("register")};
		passport.authenticate("local")(req,res,function(){
			res.redirect("/secret")
		})
	})
});




// LOGIN Route:
// LOGIN Form
app.get("/login",(req,res)=>{
	res.render("login")
});

// LOGIN logic:
app.post("/login",passport.authenticate("local",{
	successRedirect:"/secret",
	failureRedirect:"/login"
}),(req,res)=>{
});

// LOGOUT 
app.get("/logout",(req,res)=>{
	req.logout();
	res.redirect('/')
});



function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next()
	}
	res.redirect('/login')
}


app.listen(3000,function(){
	console.log("AuthDemo  Server listening in port 3000")
})