var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Our user database
const db_user = {
  alice: '123',
  bob: '456',
  charlie: '789',
}

// Middleware for checking if user exists
const userChecker = (req, res, next) => {
  console.log(req.body)
  const username = req.body.username
  if (db_user.hasOwnProperty(username)) {
    next()
  } else {
    res.send('Username or Password invalid.')
  }
}

// Middleware for checking if password is correct
const passwordChecker = (req, res, next) => {
  const username = req.body.username
  const password = req.body.password
  if (db_user[username] === password) {
    next()
  } else {
    res.send('Username or password invalid.')
  }
}

//const IP = "127.0.0.1"
const PORT = 7777



app.use(cors())
// Configure express to use body-parser as middleware.
app.use(express.urlencoded({ extended: false })) // to support URL-encoded bodies
app.use(express.json()) // to support JSON-encoded bodies

// Configure express to use these 2 middleware for /login route only
app.use('/log', userChecker)
app.use('/log', passwordChecker)

// Create route /login for POST method
// we are waiting for a POST request with a body containing a json data
app.post('/log', (req, res) => {
  let username = req.body.username
  res.send({user: username, logged: true})
})

app.post('/register', (req, res) => {
  let username = req.body.username
  let email = req.body.email
  let password = req.body.password
  db_user[username] = {password, email}
  console.log(db_user)
  
  res.send("Registration success !")
})

app.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}`)
})

module.exports = app;
