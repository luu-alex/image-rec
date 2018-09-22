var express = require('express');
var app = express();
var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');
//requiring routes
var watsonRoutes = require('./routes/watson_routes')
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use("/watson", watsonRoutes)
app.get("/", function(req,res){
  res.render("landing")
})

app.listen(process.env.PORT||"3030", process.env.IP||"192.168.1.90", function(){
    console.log('server started!');
})
