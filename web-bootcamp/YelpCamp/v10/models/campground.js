const mongoose=require("mongoose"),
	  Comment =require("./comment")

const campgroundSchema = new mongoose.Schema({
	name:String,
	image:String,
	description:String,
	comments:[
		{
			type:mongoose.Schema.Types.ObjectId,
			ref:"Comment",
		}
	],
	author:{
		id:{
			type:mongoose.Schema.Types.ObjectId,
			ref:"User"
		},
		username:String
	}
})

//Delete associated comment when it remove , refernce doc :https://mongoosedoc.top/docs/middleware.html
campgroundSchema.pre('remove', async function(next) {
	try{
		await Comment.deleteMany({
			_id: {
				$in: this.comments
			}
		});

		
	}catch(err){console.log(err)}

});

module.exports = mongoose.model("Campground",campgroundSchema)