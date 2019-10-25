var request = require('request');
request('https://jsonplaceholder.typicode.com/users/1', function (error, response, body) {
  // pry = require('pryjs')
  // eval(pry.it)
  console.error('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  var parseData= JSON.parse(body);
  console.log(parseData.name+" is living at");	
  console.log(parseData.address.city)  
  console.log("=================================");	
  console.log(`${parseData.name} is living at ${parseData.address.city}`);	
});