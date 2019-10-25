var faker = require('faker');


for(var i=0;i<10;i++){
	var product=faker.commerce.productName();
	var pricce=faker.commerce.price();
	console.log("product'name: "+product+"   price: "+pricce)
}
