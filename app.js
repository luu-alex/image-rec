var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');
//requiring routes
var watsonRoutes = require('./routes/watson_routes')
app.set('view engine', 'ejs');
app.use(express.static('public'));


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.text())

app.use("/watson", watsonRoutes)

app.get("/", function(req,res){
  res.render("landing");
})

app.get("/home", function(req,res){
  res.render("home");
})
app.post('/api/Upload', function(req, res){
  console.log(req);
  console.log(typeof req.body.text);
  res.send(req.body.text);

});

app.listen(process.env.PORT||"3030", process.env.IP||"127.0.0.1", function(){
    console.log('server started!');
})
