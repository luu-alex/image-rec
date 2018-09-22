var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');
var multer = require('multer');
var upload = multer({ dest : 'uploads/'})
//requiring routes
var watsonRoutes = require('./routes/watson_routes')

const Clarifai = require('clarifai');

const clarifai  = new Clarifai.App({
  apiKey: '51cb209ff80d4ffaa967cc72a0e7f6de'
})

app.set('view engine', 'ejs');
app.use(express.static('public'));


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.text())

app.use("/watson", watsonRoutes)

app.get("/", function(req,res){
  res.render("landing");
})
app.post('/clarifai/img-input', function(req, res){
  clarifai.models.predict(Clarifai.GENERAL_MODEL, req.body.link).then(
    function(response){
      res.send("success");
    },
    function(err){
      res.send("error");
    }
  )

})

app.post('/api/Upload', upload.single('avatar'), function(req, res){
  console.log(req.file);
  console.log(req.body.text);
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
