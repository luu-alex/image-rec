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

var toneAnalyzer = new ToneAnalyzerV3({
        'version_date': '2017-09-21',
        username: process.env.WATSONUSERNAME,
        password: process.env.WATSONPASSWORD
    });


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
app.use(bodyParser.json());
app.use("/watson",watsonRoutes)

app.get("/", function(req,res){
  res.render("landing");
});

app.post('/twitter', function(req, res){
    console.log(req.body.search)
    T.get('search/tweets', { q: req.body.search }).then( function(data) {
        var photos = [];
        var tweet = [];
        for (i=0; i<3; i++) {
            photos.push(data["data"]["statuses"][i]["user"]["profile_image_url"])
            tweet.push(data["data"]["statuses"][i])
        }
        // console.log({photos,tweet})
        return [photos,tweet]
    }).then(async function(response){
        console.log("1st then");
        clarifyArray = [];
        for (i=0; i<response[0].length; i++) {
            await clarifai.models.predict(Clarifai.GENERAL_MODEL, response[0][i])
            .catch(function(err){
                console.log(err)
            }).then(
                function (clarify){
                    // console.log("clarify:\n"+clarify);
                    clarifyArray.push(clarify);
                    // res.send(clarify);
                    // photos.push(response['outputs'][0]['data']['concepts']);
                }
            )
        }
        return [clarifyArray,response[1]]
    }).then(function(resp) {
        console.log("2nd then");
        var tones = {};
        const tweets = resp[1];
        let finalArray = [];
        tweets.forEach((value) => {
            var toneParams = {
                'tone_input': { 'text': resp[1][i]["text"] },
                'content_type': 'application/json'
            };
            toneAnalyzer.tone(tonePsarams, asyncFunction(error,toneAnalysis).then(result) =>{
                if(error){
                    reject(error);
                } else{
                    return toneAnalysis;
                }
            });
        });
        const resolvedFinalArray = await Promise.all(finalArray); // resolving all promises
        return [resp[0],resolvedFinalArray];
        console.log("2nd then complete");
    }).then(function(final){
        console.log("final value:" +final[1]);
        res.send("success")
    })
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
