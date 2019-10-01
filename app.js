var express = require('express');
var bodyParser = require('body-parser');
var dot = require('dotenv');
var indexRouter = require('./routes')

var app = express();
dot.config()

app.set('views', __dirname+'/views');
app.set('view engine', 'ejs');
app.set('html', require('ejs').renderfile);
app.use(bodyParser.urlencoded({extended:false}));
app.use('/',indexRouter)

var port = 3000;
app.listen(port, ()=>{
    console.log(`Server is started : http://localhost:${port}`);

});
