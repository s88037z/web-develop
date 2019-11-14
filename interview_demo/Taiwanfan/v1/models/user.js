let mongoose=require("mongoose"),
	passportLocalMongoose=require("passport-local-mongoose")

let userSchema = new mongoose.Schema({
	username:String,
	password:String,
	avatar:{type:String,default:"https://cdn.pixabay.com/photo/2016/11/22/12/24/camp-1849133_960_720.png"},
	email:{type:String,required:true},
	resetPasswordToken:String,
	resetPasswordExpires:Date,
	firstName:String,
	lastName:String,
	isAdmin:{type:Boolean,default:false},
	description:String,

})

userSchema.plugin(passportLocalMongoose)
module.exports = mongoose.model("user",userSchema)