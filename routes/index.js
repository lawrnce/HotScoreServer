var express = require('express');
var router = express.Router();
var pg = require('pg');
var path = require('path')
var connectionString = require(path.join(__dirname, '../', 'config'));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Create item
router.post('/api/hotscore', function(req, res) {

  var results = [];

  // Grab data from http request
  var data = {title: req.body.title};

  // Get a Postgres client from connection pool
  pg.connect(connectionString, function(err, client, done) {

    // Handle connection errors
    if (err) {
      done();
      console.log(err);
      return res.status(500).json({ success: false, data: err});
    }

    // SQL Query > Insert Data
    client.query("INSERT INTO items(title, age, likes, score) values($1, 1, 0, 0)", [data.title], function(err, result) {
      if (err) {
        return res.status(500).json({success: false, err});
      } else {
        return res.status(200).json({success: true});
      }
    });

  });
});

// Update Item
router.put('/api/hotscore/:hotscore_id', function(req, res) {

  var results = [];

  // Grab data from the URL parameters
  var id = req.params.hotscore_id;

  // Grab data from http request
  var data = {title: req.body.title, likes: req.body.likes, age: req.body.age}

  // Get a Postgres client from the conenction pool
  pg.connect(connectionString, function(err, client, done) {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).send(json({ success: false, data: err}));
    }

    // SQL Query > Update Data
    client.query("UPDATE items SET title=($1), likes=($2), age=($3) WHERE id=($4)", [data.title, data.likes, data.age, id], function(err, result){
      if (err) {
        return res.status(500).json({success: false, err});
      } else {
        return res.status(200).json({success: true});
      }
    });

  });
});


module.exports = router;
