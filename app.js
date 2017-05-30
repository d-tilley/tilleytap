const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser= require('body-parser');

const app = express();

var db;

// Connect to the db
MongoClient.connect("mongodb://localhost:27017/tilleytap", function(err, database) {
    if (err) return console.log(err);
    
    db = database;
    
    app.listen(8080, function() {
      console.log('listening on 8080')
    });
});

app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res) {
    res.send('Hello World')
});

app.get('/test', function(req, res) {
    db.collection('test').find().toArray(function (err, result) {
        if (err) return console.log(err);
        
        res.json(result);
    });
});