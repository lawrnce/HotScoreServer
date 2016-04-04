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

module.exports = router;
