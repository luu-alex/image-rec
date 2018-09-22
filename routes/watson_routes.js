var express = require("express");
var router = express.Router();
var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');

router.post("/text-input", function(req, res){
    var toneAnalyzer = new ToneAnalyzerV3({
        'version_date': '2017-09-21',
        username: 'e20cef90-d928-4529-8000-32e872436e3c',
        password: 'jSDSFGAbtBp7'
    });

    var text = req.body.tone;

    var toneParams = {
      'tone_input': { 'text': text },
      'content_type': 'application/json'
    };

    toneAnalyzer.tone(toneParams, function (error, toneAnalysis) {
      if (error) {
        console.log("error")
        console.log(error);
        res.send(error);
      } else { 
//        console.log(JSON.stringify(toneAnalysis, null, 2));
        res.send(JSON.stringify(toneAnalysis, null, 2));
      }
    });
    
})

    
module.exports = router;
