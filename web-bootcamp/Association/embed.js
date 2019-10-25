var mongoose=require("mongoose")

mongoose.connect("mongodb://localhost:27017/blog_demo", { useNewUrlParser: true ,useUnifiedTopology: true})



// post- title content

var postSchema = new mongoose.Schema({
	title:String,
	content:String,
})
var Post = mongoose.model("Post",postSchema)

// User-email,name
var userSchema = new mongoose.Schema({
	name:String,
	email:String,
	posts:[postSchema]
})
var User = mongoose.model("User",userSchema)



// // new user
// var newUser= new User({
// 	name:"Tim",
// 	email:"Tim@gmail.com",	
// })

// newUser.posts.push({
// 	title:"how to get a polyjuice  potion",
// 	content:"You can go to the potion class!",
// })
	
// newUser.save(function(err,user){
// 	if(err){console.log(err)}
// 	else{console.log(user)}
	
// })




// // new post
// var newPost= new Post({
// 	title:"Reflection of apples",
// 	content:"They are delicious!",	
// })

// newPost.save(function(err,user){
// 	if(err){console.log(err)}
// 	else{console.log(user)}
	
// })




// User.findOne({name:"Tim"},function(err,user){
// 	if(err){console.log(err)}
// 	else{
// 		user.posts.push({
// 		title:"3 place I wanna go",
// 		content:"Iceland,Iceland,Iceland!",
// 		});
// 		user.save(function(err,user){
// 			if(err){console.log(err)}
// 			else{console.log(user)}
// 			});
// 	}
// })


