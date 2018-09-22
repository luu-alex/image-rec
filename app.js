var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
//requiring routes


app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.text())

app.get("/", function(req,res){
  res.render("landing");
})
app.post('/api/Upload', function(req, res){
  console.log(req);
  console.log(typeof req.body.text);
  res.send(req.body.text);

});


app.listen(process.env.PORT||"3030", process.env.IP||"192.168.0.24", function(){
    console.log('server started!');
})
