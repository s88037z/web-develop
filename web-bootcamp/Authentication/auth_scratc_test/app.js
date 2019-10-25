const pug 			= require('pug'),
	  express		=require("express"),
	  bodyParser    =require("body-parser"),
	  mongoose		=require("mongoose"),
	  sessions		=require("client-sessions"),
	  bcrypt        =require("bcryptjs")
	  
let app=express()

mongoose.connect("mongodb://localhost:27017/ss-auth", { useNewUrlParser: true ,useUnifiedTopology: true})


let User= mongoose.model("user",new mongoose.Schema({
	firstname: 	{type:String,require:true},
	lastname:	{type:String,require:true},
	email:		{type:String,require:true,unique:true},
	password:	{type:String,require:true},
}))



app.set("view engine","pug")
app.use(bodyParser.urlencoded({extended:false}))

// how u setup a cookie for browers
app.use(sessions({
	cookieName:"session",
	secret:"dsfsfcxvejknjsfzfsdfvbvbtggs",
	duration:30*60*1000 //30min
}))



app.get("/",(req,res)=>{
	res.render('index')
});

app.get("/register",(req,res)=>{
	res.render('register')
});
app.post("/register",(req,res)=>{
	let hash=bcrypt.hashSync(req.body.password,14);
	req.body.password=hash
	let user= new User(req.body)
	user.save((err,user)=>{
		if(err){
			let error="Somthing wrong,please try again"
			if (err.code===11000){
				error="The email has repeated!"
			}
			return res.render("register",{error:error})
		}		  
		res.redirect("/dashboard")
			  
	})
	
});

app.get("/login",(req,res)=>{
	res.render('login')
});

app.post("/login",(req,res)=>{
	User.findOne({email:req.body.email},(err,findUser)=>{
		if(err||!findUser||!bcrypt.compareSync(req.body.password,findUser.password)){
			return	res.render("login",{error:"Incorrect email/password"})
		}
		//take the monoDB user's id and save it to req.seesion object,and automatically cause a set cookie response.
		req.session.userId = findUser._id

		res.redirect("/dashboard")
	})
});



app.get("/dashboard",(req,res,next)=>{
	if(!(req.session && req.session.userId)){
		return	res.redirect("/login")
	}
		
		
	User.findById(req.session.userId,(err,user)=>{
		if(err){return next(err)}
		if(!user){res.redirect("/login")}
		res.render('dashboard')
	})
			
});





app.listen(3000,function(){
	console.log("AuthDemo  Server listening in port 3000")
})