var express = require('express');
var app = express();

//requiring routes


app.set('view engine', 'ejs');

app.get("/", function(req,res){
  res.render("landing")
})

app.listen(process.env.PORT||"3030", process.env.IP||"192.168.1.82", function(){
    console.log('server started!');
})
