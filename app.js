var express = require('express');
var app = express();

//requiring routes
var websiteRoutes = require('./routes/website')


app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use('/', websiteRoutes);

app.listen(process.env.PORT||"3030", process.env.IP||"127.0.0.1", function(){
    console.log('server started!');
})
