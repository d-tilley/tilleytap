const express = require('express');
const app = express();

app.listen(8080, function() {
  console.log('listening on 8080')
})

app.get('/', function(req, res) {
  res.send('Hello World')
})