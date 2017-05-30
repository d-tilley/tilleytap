const express = require('express');
const bodyParser= require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.listen(8080, function() {
  console.log('listening on 8080')
});

app.get('/', function(req, res) {
  res.send('Hello World')
});