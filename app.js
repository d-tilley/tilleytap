const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser= require('body-parser');

const app = express();

var db;

// Initialize route listener on port 3000
app.listen(3000, function () {
    console.log('listening on 3000');
});

// Connect to the db
MongoClient.connect("mongodb://localhost:27017/tilleytap", function (err, database) {
    if (err) return console.log(err);
    
    db = database;
});

// Parse incoming http request query parmams
app.use(bodyParser.urlencoded({extended: true}));

/*************************
 * API Route Definitions *
 *************************/ 

// Base test route
app.get('/', function (req, res) {
    res.send('Hello World');
});

// Get all beer objects
app.get('/beers', function (request, response) {
    db.collection('beers').find().toArray(function (err, result) {
        response.json(err ? {error: true} : result);
    });
});

// Add a new beer object
app.post('/beers', function (request, response) {
    db.collection('beers').insert({
        name: request.body.name,
        style: request.body.style,
        abv: request.body.abv,
        desc: request.body.desc
    }, function (err, result) {
        response.json(err ? {error: true} : result);
    });
});

// Update an existing beer object
app.put('/beers', function (request, response) {
    db.collection('beers').update({
        _id: request.body.id
    }, {
        $set: {
            name: request.body.name,
            style: request.body.style,
            abv: request.body.abv,
            desc: request.body.desc
        }
    }, {
        safe: true,
        multi: false
    }, function (err, result) {
        response.json((err || result !== 1) ? {error: true} : result);
    });
});

// Get all brewery objects
app.get('/breweries', function (request, response) {
    db.collection('breweries').find().toArray(function (err, result) {
        response.json(err ? {error: true} : result);
    });
});

// Add a new brewery object
app.post('/breweries', function (request, response) {
    db.collection('breweries').insert({
        name: request.body.name,
        url: request.body.url,
        beers: []
    }, function (err, result) {
        response.json(err ? {error: true} : result);
    });
});

// Update an existing brewery object
app.put('/breweries', function (request, response) {
    db.collection('breweries').update({
        _id: request.body.id
    }, {
        $set: {
            name: request.body.name,
            url: request.body.url,
            beers: request.body.beers //Should be an array of Object Ids
        }
    }, {
        safe: true,
        multi: false
    }, function (err, result) {
        response.json((err || result !== 1) ? {error: true} : result);
    });
});

// Get on tap object
app.get('/onTap', function (request, response) {
    db.collection('onTap').find().toArray(function (err, result) {
        response.json(err ? {error: true} : result);
    });
});

// Update on tap object
app.put('/onTap', function (request, response) {
    db.collection('onTap').update({
        _id: request.body.id
    }, {
        $set: {
            beer: request.body.beer,
            empty_weight: request.body.empty_weight,
            capacity: request.body.capacity
        }
    }, {
        safe: true,
        multi: false
    }, function (err, result) {
        response.json((err || result !== 1) ? {error: true} : result);
    });
});

// Update the weight of the on tap object
app.put('/onTapWeight', function (request, response) {
    db.collection('onTap').update({
        _id: request.body.id
    }, {
        $set: {
            weight: request.body.weight,
        }
    }, {
        safe: true,
        multi: false
    }, function (err, result) {
        response.json((err || result !== 1) ? {error: true} : result);
    });
});
