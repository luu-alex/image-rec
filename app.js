var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');
//requiring routes
var watsonRoutes = require('./routes/watson_routes')
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use("/watson", watsonRoutes)

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get("/", function(req,res){
  res.render("landing");
})
app.post('/api/Upload', function(req, res){
  res.send(req.body.chat+" "+req.body.chat);

});

app.listen(process.env.PORT||"3030", process.env.IP||"127.0.0.1", function(){
    console.log('server started!');
})
