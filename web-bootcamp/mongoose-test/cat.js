var mongoose = require("mongoose")
mongoose.connect("mongodb://localhost:27017/cat_app", { useNewUrlParser: true ,useUnifiedTopology: true})

var catSchema= new mongoose.Schema({
	name:String,
	age:Number,
	temperament:String,
	
})

var Cat=mongoose.model("cat",catSchema)

// // add a new cat
// var george=new Cat({
// 	name:"Mrs.Norris",
// 	age:7,
// 	temperament:"Evil",
// })

// george.save((err,cat)=>{
// 	if(err){console.log("Somthing go wrong!")}
// 	else{console.log("We save a cat!");
// 		 console.log(cat);
// 		}
	
// 	})


// another way to add a cat data
// Cat.create({
// 	name:"Snow White",
// 	age:17,
// 	temperament:"Bland",
// },function(err,cat){
// 	if(err){console.log("Somthing go wrong!")}
// 	else{console.log("We save a cat!");
// 		 console.log(cat);}
// })


// retrieve data from DB
Cat.find({},(err,cats)=>{
	if(err){console.log("Having a error!");
		    console.log(err)
		   }
	else{console.log("All cats :");
		 console.log(cats)
		}
})

// 