var express = require('express');
var app = express();
var bodyParser = require('body-parser');

//requiring routes


app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get("/", function(req,res){
  res.render("landing");
})
app.post('/api/Upload', function(req, res){
  res.send(req.body.chat+" "+req.body.chat);

});


app.listen(process.env.PORT||"3030", process.env.IP||"192.168.0.24", function(){
    console.log('server started!');
})
