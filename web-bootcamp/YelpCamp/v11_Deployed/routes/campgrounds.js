const express			=require("express"),
	  router 			=express.Router(),
	  Campground 	 	=require("../models/campground"),
	  middleware        =require("../middleware")

// img upload setting :
//=====reference:=====
//https:github.com/expressjs/multer/blob/master/doc/README-zh-cn.md 
//https://www.npmjs.com/package/cloudinary)
//https://cloudinary.com/documentation/image_upload_api_reference#destroy_method
const multer = require('multer');
	//custome name for upload file
const storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
const imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
const upload = multer({ storage: storage, fileFilter: imageFilter})

const cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'dmtsneaoi', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});




// Geocoder setting
const NodeGeocoder = require('node-geocoder');
const options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
const geocoder = NodeGeocoder(options);


// INDEX
router.get("/",(req,res)=>{
	let noCamps;
	if(req.query.search){
		const regex = new RegExp(escapeRegExp(req.query.search), 'gi')
		Campground.find({name:regex},function(err,allCampgrounds){
		if(err){console.log(err)}
		else{
			if(allCampgrounds.length<1){
				let noCamps="Sorry, no campground matched the search,please try again!"
				return res.render("campgrounds/index",{
					campgrounds:allCampgrounds,page:'campgrounds',noCamps:noCamps})
				}
			res.render("campgrounds/index",{campgrounds:allCampgrounds,page:'campgrounds',noCamps:noCamps})}
		})	

	}else{
		// 	get all campground from db:
		Campground.find({},function(err,allCampgrounds){
		if(err){console.log(err)}
		else{
			res.render("campgrounds/index",{campgrounds:allCampgrounds,page:'campgrounds',noCamps:noCamps})}
		})	
	}  
});

// NEW
router.get("/new",middleware.isLoggedIn,(req,res)=>{
	res.render("campgrounds/new")
	
})


// // CREATE(geo)
// router.post("/",middleware.isLoggedIn,async (req,res)=>{
// 	// create a new campground and save it to data base
// 	try{
	
// 		try{
// 			var data= await geocoder.geocode(req.body.campground.location)
// 		}catch(err){
// 			console.log(err)
// 			req.flash('error', 'Invalid address');
// 			return res.redirect('back');
// 		}
// 		let lat = data[0].latitude;
// 		let lng = data[0].longitude;
// 		let location = data[0].formattedAddress;
// 		let newCampground=req.body.campground;			
// 		//add geocode to campground
// 		newCampground.location=location
// 		newCampground.lat=lat	
// 		newCampground.lng=lng	
// 		//add user data to the campground
// 		newCampground.author={
// 			id:req.user._id,
// 			username:req.user.username
// 		}
// 		let campground= await Campground.create(newCampground)
// 		// req.flash("success","Successfully Added Campground !")
// 		res.redirect("/campgrounds")

// 	}catch(err){
// 		req.flash("error","Some error occur");
// 		console.log(err);
// 		res.redirect("back")
// 	}
	
// })



// // CREATE(geo+ img uploade)
router.post("/",middleware.isLoggedIn,upload.single('image'),async (req,res)=>{
	// create a new campground and save it to data base
	// eval(require('locus'))
	try{
		
		try{
			var data= await geocoder.geocode(req.body.campground.location)
		}catch(err){
			console.log(err)
			req.flash('error', 'Invalid address');
			return res.redirect('back');
		}
		let result = await cloudinary.v2.uploader.upload(req.file.path)
		req.body.campground.image = result.secure_url
		req.body.campground.imageId =result.public_id
		let lat = data[0].latitude;
		let lng = data[0].longitude;
		let location = data[0].formattedAddress;
		let newCampground=req.body.campground;			
		//add geocode to campground
		newCampground.location=location
		newCampground.lat=lat	
		newCampground.lng=lng	
		//add user data to the campground
		newCampground.author={
			id:req.user._id,
			username:req.user.username
		}
		let campground= await Campground.create(newCampground)
		// req.flash("success","Successfully Added Campground !")
		res.redirect("/campgrounds")

	}catch(err){
		req.flash("error","Some error occur");
		console.log(err);
		res.redirect("back")
	}
	
})




// SHOW
router.get("/:id",(req,res)=>{
// 	find the campground with provided id
	Campground.findById(req.params.id).populate("comments").exec(function(err,findCampground){
// 			render the show page
			if(err||!findCampground){
				console.log(err);
				console.log(findCampground);
				req.flash("error","Campground not found")
				res.redirect("back")
			}else{
				res.render("campgrounds/show",{campground:findCampground})
			}
	})
		
});


// EDIT campground routes:
router.get("/:id/edit",middleware.checkCampgroundOwnership,(req,res)=>{
	Campground.findById(req.params.id,(err,foundCamp)=>{
		if(err){console.log(err);return res.redirect("back")}
			res.render("campgrounds/edit",{campground:foundCamp})
	})
})

// UPDATE campground routes(geo) :
// router.put("/:id", middleware.checkCampgroundOwnership, async(req, res)=>{
// 	try{
// 		let data = await geocoder.geocode(req.body.campground.location)
// 		req.body.campground.lat = data[0].latitude;
// 		req.body.campground.lng = data[0].longitude;
// 		req.body.campground.location = data[0].formattedAddress;
// 		let campground =await  Campground.findByIdAndUpdate(req.params.id, req.body.campground)
// 		req.flash("success","Successfully Updated!");
// 		res.redirect("/campgrounds/" + campground._id);
// 	}catch(err){
// 		req.flash("error","Some error occur");
// 		console.log(err);
// 		res.redirect("back")
// 	}		
// })


// UPDATE campground routes(geo+img upload) :
router.put("/:id", middleware.checkCampgroundOwnership,upload.single('image'),async(req, res)=>{
	try{
		let campground= await Campground.findById(req.params.id)
		// eval(require("locus"))
		if(campground && !!campground){
			if(req.file){
				await cloudinary.v2.uploader.destroy(campground.imageId);
				let result = await cloudinary.v2.uploader.upload(req.file.path)
				req.body.campground.image = result.secure_url
				req.body.campground.imageId =result.public_id
			}
			let data = await geocoder.geocode(req.body.campground.location)
			req.body.campground.lat = data[0].latitude;
			req.body.campground.lng = data[0].longitude;
			req.body.campground.location = data[0].formattedAddress;
			await Campground.findByIdAndUpdate(req.params.id,req.body.campground);
			req.flash("success","Successfully Updated!");
			res.redirect("/campgrounds/" + campground._id);
			
			
		}else{
			req.flash("error","campground not found!");
			res.redirect("back")
		}		
	}catch(err){
		req.flash("error","Some error occur");
		console.log(err);
		res.redirect("back")
	}		
})



// DESTORY campground routes(use pre-hook  to also delete comments) :
router.delete("/:id",middleware.checkCampgroundOwnership,async (req,res)=>{
	try{
		let campground = await Campground.findById(req.params.id)
		if(!campground){
				req.flash("error","can't find the campground");
				return(res.redirect("back"))
		}
		await cloudinary.v2.uploader.destroy(campground.imageId);
		await campground.remove();		
		req.flash("error","Deleted the Campground ")
		res.redirect("/campgrounds")
				
	}catch(err){
		console.log(err);
		req.flash("error","Some error occur");
		res.redirect("/campgrounds")
		
	}
})


function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

module.exports=router