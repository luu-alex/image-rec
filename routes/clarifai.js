var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var Clarifai = require('clarifai');
var clarifai  = new Clarifai.App({
  apiKey: '51cb209ff80d4ffaa967cc72a0e7f6de'
})

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.text());


router.post('/img-input', function(req, res){
  console.log(req.body.imageLink);
  clarifai.models.predict(Clarifai.GENERAL_MODEL, req.body.imageLink).then(
    function(response){
      res.send("success");
      console.log(response['outputs'][0]['data']['concepts']);
    },
    function(err){
      res.send("error");
    }
  )

})

module.exports = router;
