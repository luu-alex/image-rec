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
  consumer_key: process.env.TWITCONAPIKEY,
  consumer_secret: process.env.TWITCONAPIKEYSECRET,
  access_token: process.env.TWITACCESSTOKEN,
  access_token_secret: process.env.TWITACCESSTOKENSECRET
})
T.get('search/tweets', { q: 'maga' }, function(err, data, response) {
    var photos = [];
    for (var i=0; i<data["statuses"].length;i++) {
      photos.push(data["statuses"][i]["user"]["profile_image_url"])
    }
    res.send(data["statuses"][0])

})
console.log(process.env.twitter_consumer_key);

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
      var new_data=[]
      var return_data=[]
      var toneAnalyzer = new ToneAnalyzerV3({
          'version_date': '2017-09-21',
          username: 'e20cef90-d928-4529-8000-32e872436e3c',
          password: 'jSDSFGAbtBp7'
      });
      for(var i = 0; i < data["statuses"].length;i++){
          new_data.push(data["statuses"][i]["text"] + "\n\n");
          var toneParams = {
            'tone_input': { 'text': data["statuses"][i]["text"] },
            'content_type': 'application/json'
          };
          toneAnalyzer.tone(toneParams, function (error, toneAnalysis) {
            if (error) {
              console.log("error")
              console.log(error);
              res.send(error);
            } else {
      //        console.log(JSON.stringify(toneAnalysis, null, 2));
              return_data.push({toneAnalysis})
            }
          });
      }

    res.send(return_data)
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
