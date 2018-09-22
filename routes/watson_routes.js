var express = require("express");
var router = express.Router();
var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');

router.post("/text-input", function(req, res){
    console.log(req.body.tone)
    var toneAnalyzer = new ToneAnalyzerV3({
        'version_date': '2017-09-21',
        username: 'e20cef90-d928-4529-8000-32e872436e3c',
        password: 'jSDSFGAbtBp7'
    });

    var text = 'Team, I know that times are tough! Product '
      + 'sales have been disappointing for the past three '
      + 'quarters. We have a competitive product, but we '
      + 'need to do a better job of selling it!'

    var toneParams = {
      'tone_input': { 'text': text },
      'content_type': 'application/json'
    };

    toneAnalyzer.tone(toneParams, function (error, toneAnalysis) {
      if (error) {
        console.log("error")
        console.log(error);
      } else { 
        console.log("hi this ran")
        console.log(JSON.stringify(toneAnalysis, null, 2));
      }
    });
    res.send("complete")
})

    
module.exports = router;
