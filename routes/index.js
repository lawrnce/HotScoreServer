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
router.get('/api/hotscore', function(req, res) {

  var results = [];

  // Connect to db
  pg.connect(connectionString, function(err, client, done) {

    if (err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }

    // query db
    var query = client.query('SELECT array_to_json(array_agg(row_to_json(d))) FROM ( SELECT id, title FROM items ORDER BY score DESC)d');

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

  // Connect to db
  pg.connect(connectionString, function(err, client, done) {

    // Handle connection errors
    if (err) {
      done();
      console.log(err);
      return res.status(500).json({ success: false, data: err});
    }

    // Insert Data
    client.query("INSERT INTO items(title, age, likes, score) values($1, 1, 0, 0)", [data.title], function(err, result) {
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
  var data = {title: req.body.title, likes: req.body.likes, age: req.body.age}

  // Conncet to db
  pg.connect(connectionString, function(err, client, done) {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).send(json({ success: false, data: err}));
    }

    // Update Data
    client.query("UPDATE items SET title=($1), likes=($2), age=($3) WHERE id=($4)", [data.title, data.likes, data.age, id], function(err, result){
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
        return res.status(200).json(success: true);
      }
    });

  });
});

module.exports = router;
