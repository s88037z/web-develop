var mongoose=require("mongoose")

mongoose.connect("mongodb://localhost:27017/blog_demo_2", { useNewUrlParser: true ,useUnifiedTopology: true})



// // post- title content

// var postSchema = new mongoose.Schema({
// 	title:String,
// 	content:String,
// })
// var Post = mongoose.model("Post",postSchema)

//  require modle from other jsfile
var Post= require("./models/post.js")


// User-email,name
// var userSchema = new mongoose.Schema({
// 	name:String,
// 	email:String,
// 	posts:[{
// 		type:mongoose.Schema.Types.ObjectId,
// 		ref:"Post"
		
// 	}]
// })
// var User = mongoose.model("User",userSchema)
var User= require("./models/user.js")



// ==create a demo user===
// User.create({
// 	name:"Tim",
// 	email:"Tim@gmail.com",	
// })


// == create a post & save it to the user====
// Post.create({
// 	title:"how to cook a burger part4!",
// 	content:"You can go to the cook class \"4\"!",
// },function(err,post){
// 	if(err){console.log(err)}
// 	else{
// 		User.findOne({email:"Tim@gmail.com"},function(err,foundUser){
// 			if(err){console.log(err)}
// 			else{foundUser.posts.push(post);
// 				 foundUser.save(function(err,data){
// 					 if(err){console.log(err)}
// 					 else{console.log(data)}
// 				 })
// 			}
// 		})
// 	}
// 	}
// )


// Mongoose's docs "populate" : https://mongoosejs.com/docs/populate.html
// User.findOne({email:"Tim@gmail.com"}).populate("posts").exec(function(err,user){
// 	if(err){console.log(err)}
// 	else{console.log(user)}
// })

