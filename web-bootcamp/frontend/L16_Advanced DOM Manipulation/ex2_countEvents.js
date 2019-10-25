var count=0
var tables=document.querySelectorAll("table")
for(i=0;i<tables.length;i++){
    console.log("it's table "+i);
    var table_lis=tables[i].querySelectorAll("tbody tr");
    count+=(table_lis.length-1)
    console.log("now has count"+count+" element");
}


// var tableOne_lis=document.querySelectorAll("table:nth-of-type(1) tbody tr")

// var count=0
// var tables=document.querySelectorAll("table")
// for(i=0;i<2;i++){
//     console.log("it's "+i+" turn");
//     var table_lis=tables[i].querySelectorAll("tbody tr");
//     for(ii=0;ii<table_lis.length;ii++){
//         console.log(ii);

//     }

// }
