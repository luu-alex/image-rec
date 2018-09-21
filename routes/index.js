var express = require("express");
var router = express.Router();


router.get("/", function(req, res){
    res.render("index.ejs");
});
router.post("upload", function(req, res){

  res.render("");
})

module.exports = router;
