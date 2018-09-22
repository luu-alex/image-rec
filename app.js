var express = require('express');
var app = express();

//requiring routes


app.set('view engine', 'ejs');
app.use(express.static('public'));
app.get("/", function(req,res){
  res.render("landing")
})

app.listen(process.env.PORT||"3030", process.env.IP||"127.0.0.1", function(){
    console.log('server started!');
})
