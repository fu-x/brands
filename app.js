const express = require('express')
const app = express()
var bodyParser = require('body-parser') 
var router = require('./router')

 // parse application/x-www-form-urlencoded  
app.use(bodyParser.urlencoded({ extended: false }))    
 // parse application/json  
app.use(bodyParser.json())


app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

app.use(router);

app.listen(3000, () => console.log('Example app listening on port 3000!'))