var	mongoose	=require("mongoose"),
	Campground  = require("./models/campground"),
	Comment		= require("./models/comment")



var datas=[
	{	name:"Sky Night Camp",
		image:"https://cdn.pixabay.com/photo/2016/01/19/16/48/teepee-1149402_1280.jpg",
		description:"Starry, starry night Paint your palette blue and grey Look out on a summer's day With eyes that know the darkness in my soul",		
	},
	{	name:"Valley Camp",
		image:"https://cdn.pixabay.com/photo/2016/11/22/23/08/adventure-1851092_1280.jpg",
		description:"Climbed a mountain and I turned around And I saw my reflection in the snow covered hills 'Til the landslide brought me down",	
		
	},
	{	name:"Wild Camp",
		image:"https://cdn.pixabay.com/photo/2017/08/17/08/08/camp-2650359_1280.jpg",
		description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",	
		
	}
]

// METHOD:1
// function seedDB(){
//    //Remove all campgrounds
//    Campground.remove({}, function(err){
//         if(err){
//             console.log(err);
//         }
//         console.log("removed campgrounds!");
//         Comment.remove({}, function(err) {
//             if(err){
//                 console.log(err);
//             }
//             console.log("removed comments!");
//              //add a few campgrounds
//             datas.forEach(function(seed){
//                 Campground.create(seed, function(err, campground){
//                     if(err){
//                         console.log(err)
//                     } else {
//                         console.log("added a campground");
//                         //create a comment
//                         Comment.create(
//                             {
//                                 text: "This place is great, but I wish there was internet",
//                                 author: "Homer"
//                             }, function(err, comment){
//                                 if(err){
//                                     console.log(err);
//                                 } else {
//                                     campground.comments.push(comment);
//                                     campground.save();
//                                     console.log("Created new comment");
//                                 }
//                             });
//                     }
//                 });
//             });
//         });
//     }); 
// }

// METHOD 2 :Old version
// function seedDB(){
// // 	Remove all campgrounds
// 	Campground.remove({},function(err){
// 		if(err){console.log(err)}
// 		else{
// 			console.log("Remove campgrounds")
// 			// add few campgrounds
// 			datas.forEach(function(seed){
// 				Campground.create(seed,function(err,campground){
// 					if(err){console.log(err)}
// 					else{
// 						console.log("add a campground");
//  						//create a comment and save it to the campground
// 						Comment.create({
// 							text:"this place is great! fresh air!",
// 							author:"Alex"
// 						},function(err,comment){
// 							if(err){console.log(err)}
// 							else{
// 								campground.comment.push(comment);
// 								campground.save(function(err,comment){
// 									if(err){console.log(err)}
// 									else{console.log("Create a new comment & save it to campgrounds")}
									
// 								})
// 							}
// 						})
// 					}
// 				})
// 			})
// 		}
// 	})
		
// }






// METHOD 3 : Mordern way >>Refactor Callbacks with Async + Await
async function seedDB(){
	try{
		await Campground.remove({})
		console.log("campground remove")
		await Comment.remove({})
		console.log("comment remove")
		for(const data of datas ){
			let campground = await Campground.create(data);
			console.log("a campground created");
			let comment = await Comment.create({
				text:"this place is great! fresh air!",
				author:"Alex"
			})
			console.log("a comment created");
			campground.comments.push(comment);
			campground.save();
			console.log("comment add to a campground");
		}			
	}catch(err){console.log(err)}
}




module.exports = seedDB ;
