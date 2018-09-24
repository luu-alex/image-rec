var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');
var multer = require('multer');
var Twit = require('twit');
var upload = multer({ dest : 'uploads/'});
//requiring routes
var watsonRoutes = require('./routes/watson_routes');
var clarifaiRoutes = require('./routes/clarifai');

var Clarifai = require('clarifai');
var clarifai  = new Clarifai.App({
  apiKey: '51cb209ff80d4ffaa967cc72a0e7f6de'
})


var T = new Twit({
  consumer_key: 'jN9ryw65BQ59uDCLKwCqV3LX8',
  consumer_secret: '9O0GufwFvOFy2ZILf08XvVLUuumnF5gzTnq6mHhMIA5xOD2crg',
  access_token: '1024747908-b5VfHboRGu3n9Pv0NfifyqHUNVqNCXXfNEnyKAy',
  access_token_secret: 'vcEz9EcMtJr7RKLqZ0sIcmfLP8JkQq4C9QW5TvwCImALW'
});

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text());
app.use("/watson",watsonRoutes)
app.use("/clarifai",clarifaiRoutes);

app.get("/", function(req,res){
  //https://api.twitter.com/1.1/search/tweets.json?q=%23superbowl&result_type=recent
  console.log()
  res.render("landing");
});
app.post('/twitter', function(req, res){
  T.get('search/tweets', { q: req.body.search }, function(err, data, response) {
    var photos = [];
    for (var i=0; i<data["statuses"].length;i++) {
      photos.push(data["statuses"][i]["user"]["profile_image_url"])
    }
    clarifai.models.predict(Clarifai.GENERAL_MODEL, photos).then(
      function(response){
        console.log(response['outputs'][0]['data']['concepts']);
      },
      function(err){
        console.log("error");
      }
    )
    var new_data=""
    for(var i = 0; i < data["statuses"].length;i++){
        new_data+=data["statuses"][i]["text"] + "\n\n";
    }
    res.send(new_data)
  });
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
