var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var CronJob = require('cron').CronJob;
var pg = require('pg');
var connectionString = require(path.join(__dirname, 'config'));

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// For demo purposes the score will be updated every second.
// In production apps this should be less frequent.
new CronJob('* * * * * *', function() {

  // Connect to DB
  pg.connect(connectionString, function(err, client, done) {

    // Handle error
    if (err) {
      done();
      console.log(err);
      return;
    }

    var queryString = 'UPDATE items SET score = (hot_score(likes, date));';

    // query db
    var query = client.query(queryString);

    // Emit end
    query.on('end', function(row) {
      done();
      return;
    });

  });
}, null, true, 'America/Los_Angeles');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
