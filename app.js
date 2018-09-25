var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');
var Twit = require('twit');
//requiring routes
var watsonRoutes = require('./routes/watson_routes');

var Clarifai = require('clarifai');
var clarifai  = new Clarifai.App({
  apiKey: "51cb209ff80d4ffaa967cc72a0e7f6de"
})

var toneAnalyzer = new ToneAnalyzerV3({
    'version_date': '2017-09-21',
    username: "e20cef90-d928-4529-8000-32e872436e3c",
    password: "jSDSFGAbtBp7"
});



var T = new Twit({
  consumer_key: 'GUWBt296Ge5DRVMEjelygP9Xp',
  consumer_secret: 'K3O78sWqPK8Fuzc7DQ5Xg0XfjhD8c4mAOlHor4rJVgYqZvZP3n',
  access_token: '1024747908-Fi5qubuwn2v4tDkm2nulNJCFnTGUXWLcA7pkM8b',
  access_token_secret: '8SnB3C22vq0HzQZPdq6vGQrujN8i1LePGvKN8hzk7KD0v'
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
    // var photos = [];
    // for (var i=0; i<Math.min(data["statuses"].length,3);i++) {
    //   photo = (data["statuses"][i]["user"]["profile_image_url"])
    //   clarifai.models.predict(Clarifai.GENERAL_MODEL, photo).then(
    //     function(response){
    //       console.log(response)
    //       // photos.push(response['outputs'][0]['data']['concepts']);
    //     },
    //     function(err){
    //       console.log("error");
    //     }
    //   )
    // }
    // console.log(photos);

    var toneParams = {
      'tone_input': { 'text': data["statuses"][0]["text"] },
      'content_type': 'application/json'
    };

    clarifai.models.predict(Clarifai.GENERAL_MODEL, data["statuses"][0]["user"]["profile_image_url"]).then(
      function(response){ //this is the clarifai response back
        // photos.push(response['outputs'][0]['data']['concepts']);
        toneAnalyzer.tone(toneParams, function (error, toneAnalysis) {
          if (error) {
            console.log(error);
            res.send(error);
          } else {
            console.log(toneAnalysis); //tone response
            console.log(response) //clarifai response
            // return_data.push({toneAnalysis: toneAnalysis})
          }
        });
      },
      function(err){
        console.log("error");
      }
    )


    var clean_data=[];
    var return_data=[];

    var tones = [];
    // for(var i = 0; i < Math.min(4, data["statuses"].length);i++){
    //     clean_data.push(data["statuses"][i]["text"] + "\n\n");
    //
    //     toneAnalyzer.tone(toneParams, function (error, toneAnalysis) {
    //       if (error) {
    //         console.log("error")
    //         console.log(error);
    //         res.send(error);
    //       } else {
    //         tones.push(toneAnalysis);
    //         // return_data.push({toneAnalysis: toneAnalysis})
    //       }
    //     });
    // }
    // console.log(return_data);
    // console.log(tones.length)
    // console.log(photos.length)
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
