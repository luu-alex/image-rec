var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');
var Twit = require('twit');
//requiring routes
var watsonRoutes = require('./routes/watson_routes');

var Clarifai = require('clarifai');
var clarifai  = new Clarifai.App({
  apiKey: process.env.CLARIFAIAPIKEY
})


var T = new Twit({
  consumer_key: process.env.TWITCONAPIKEY,
  consumer_secret: process.env.TWITCONAPIKEYSECRET,
  access_token: process.env.TWITACCESSTOKEN,
  access_token_secret: process.env.TWITACCESSTOKENSECRET
});

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text());
app.use("/watson",watsonRoutes)

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

    var clean_data=[];
    var return_data=[];
    var toneAnalyzer = new ToneAnalyzerV3({
        'version_date': '2017-09-21',
        username: process.env.WATSONUSERNAME,
        password: process.env.WATSONPASSWORD
    });

    for(var i = 0; i < data["statuses"].length;i++){
        clean_data.push(data["statuses"][i]["text"] + "\n\n");
        var toneParams = {
          'tone_input': { 'text': clean_data[i] },
          'content_type': 'application/json'
        };
        toneAnalyzer.tone(toneParams, function (error, toneAnalysis) {
          if (error) {
            console.log("error")
            console.log(error);
            res.send(error);
          } else {
           console.log(JSON.stringify(toneAnalysis, null, 2));
            // return_data.push({toneAnalysis: toneAnalysis})
          }
        });
    }
    // console.log(return_data);
    res.send("success")
  });
})

app.get("/home", function(req,res){
  res.render("home");
})

app.get("/testing", function(req,res){
  res.render("results");
})

app.post('/api/Upload', function(req, res){
  console.log(req);
  console.log(typeof req.body.text);
  res.send(req.body.text);

});

app.listen(process.env.PORT||"3030", process.env.IP||"127.0.0.1", function(){
    console.log('server started!');
})
