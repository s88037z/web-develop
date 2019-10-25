function average(arr){
	var sum=null
	for(var i =0;i<arr.length;i++){
		sum+=arr[i]
	}
	
	return Math.round(sum/arr.length)
	
}

var scores1=[90,98,89,100,100,86,94];
average(scores1)



var scores2=[40,65,77,82,80,54,73,63,95,49]
average(scores2)
console.log(average(scores1))
console.log(average(scores2))