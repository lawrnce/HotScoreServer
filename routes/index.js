var express = require('express');
var router = express.Router();
var pg = require('pg');
var path = require('path')
var connectionString = require(path.join(__dirname, '../', 'config'));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Get items by popularity
router.get('/api/hotscore/:filter', function(req, res) {

  var results = [];

  // Get filter type
  var id = req.params.filter;

  // Connect to db
  pg.connect(connectionString, function(err, client, done) {

    if (err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }

    // Deterime filter
    var queryString;
    if (id == 'popular') {

      queryString = 'SELECT id, title, likes, date, score FROM items ORDER BY score DESC;';

    } else if (id == 'recent') {

      queryString = 'SELECT id, title, likes, date, score FROM items ORDER BY id DESC;';

    } else {
      return res.status(404).json({success: false, message: 'not found'});
    }

    // query db
    var query = client.query(queryString);

    // Emit row
    query.on('row', function(row) {
      results.push(row);
    });

    // Emit end
    query.on('end', function(row) {
      done();
      return res.json(results);
    });
  });
});

// Create item
router.post('/api/hotscore', function(req, res) {

  // Get data
  var data = {title: req.body.title};
  var date = parseInt(new Date().getTime() / 1000);

  // Connect to db
  pg.connect(connectionString, function(err, client, done) {

    // Handle connection errors
    if (err) {
      done();
      console.log(err);
      return res.status(500).json({ success: false, data: err});
    }

    // Insert Data
    client.query("INSERT INTO items(title, date, likes, score) values($1, $2, 0, 0)", [data.title, date], function(err, result) {
      if (err) {
        return res.status(500).json({success: false, data: err});
      } else {
        return res.status(200).json({success: true});
      }
    });

  });
});

// Update Item
router.put('/api/hotscore/:hotscore_id', function(req, res) {

  // Get data
  var id = req.params.hotscore_id;
  var data = {likes: req.body.likes}

  // Conncet to db
  pg.connect(connectionString, function(err, client, done) {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).send(json({ success: false, data: err}));
    }

    // Update Data
    client.query("UPDATE items SET likes=($1) WHERE id=($2)", [data.likes, id], function(err, result){
      if (err) {
        return res.status(500).json({success: false, data: err});
      } else {
        return res.status(200).json({success: true});
      }
    });

  });
});

// Delete
router.delete('/api/v1/todos/:todo_id', function(req, res) {

  // Get data
  var id = req.params.todo_id;

  // Connect to db
  pg.connect(connectionString, function(err, client, done) {
    // Handle connection errors
    if (err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }

    // Delete Data
    client.query("DELETE FROM items WHERE id=($1)", [id], function(err, result) {
      if (err) {
        return res.status(500).json({success: false, data: err});
      } else  {
        return res.status(200).json({success: true});
      }
    });

  });
});

module.exports = router;
