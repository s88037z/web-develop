var express=require("express"),
 	app=express(),
	bodyParser=require("body-parser"),
	mongoose=require("mongoose"),
	methodOverride=require("method-override"),
	expressSanitizer=require("express-sanitizer")


// App config
app.use(bodyParser.urlencoded({extend:true}))
app.set("view engine","ejs")
app.use(express.static("public"))
app.use(methodOverride("_method"))
app.use(expressSanitizer())

mongoose.connect("mongodb://localhost:27017/restful_blog_app", { useNewUrlParser: true ,useUnifiedTopology: true})




// mongoose/model config
var blogSchema=new mongoose.Schema({
	title:String,
	image:String,
	body: String,
	created:{ type: Date, default: Date.now }
})

var Blog = mongoose.model("Blog",blogSchema)



// add some test data
// Blog.create({
// 	title:"Test-blog",
// 	image:"https://images.unsplash.com/photo-1443834538943-ec15575fef27?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1052&q=80",
// 	body: "Goodbye Morning & Hello Night",
	
// })



// RESTful routes
app.get("/",(req,res)=>{
	res.redirect("/blogs")
});


// INDEX route
app.get("/blogs",(req,res)=>{
	Blog.find({},function(err,blogs){
		if(err){console.log("Error!");console.log(err)}
		else{
			res.render("index",{blogs:blogs})
		}	
	})
});


// NEW route
app.get("/blogs/new",(req,res)=>{
	res.render("new")
	
});

// CREATE route
app.post("/blogs",(req,res)=>{
	req.body.blog.body= req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog,function(err,newBlog){
		if(err){
				console.log(err);
				res.render("new");
			   }
		else{
			res.redirect("/blogs")
		}
	})
	
});

// SHOW route
app.get("/blogs/:id",(req,res)=>{
	Blog.findById(req.params.id,(err,findBlog)=>{
		if(err){console.log(err);res.redirect("index")}
		else{res.render("show",{blog:findBlog})}
	})

	
});
// EDIT route
app.get("/blogs/:id/edit",(req,res)=>{
	Blog.findById(req.params.id,(err,findBlog)=>{
		if(err){console.log(err);res.redirect("show",{blog:findBlog})}
		else{res.render("edit",{blog:findBlog})}
	})
});

// UPDATE route

app.put("/blogs/:id",(req,res)=>{
	req.body.blog.body= req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
		if(err){console.log(err);res.redirect("/blogs")}
		else{res.redirect("/blogs/"+req.params.id)}
	})
});


// DESTROY route
app.delete("/blogs/:id",(req,res)=>{
	Blog.findByIdAndRemove(req.params.id,(err)=>{
		if(err){console.log(err);res.redirect("/blogs")}
		else{res.redirect("/blogs")}
	})
	
	
	})


app.listen(3000,function(){
	console.log("Blog  Server listening in port 3000")
})