
var express = require('express');

var cors = require("cors");


var app = express();


// Our user database
const db_user = {
  alice: {username: 'alice', password: '123', email : 'alice@hotmail.com'}
}

// Middleware for checking if user exists
const userChecker = (req, res, next) => {
  console.log(req.body)
  const username = req.body.username
  if (db_user.hasOwnProperty(username)) {
    next()
  } else {
    res.send('Username  invalid.')
  }
}

// Middleware for checking if password is correct
const passwordChecker = (req, res, next) => {
  const username = req.body.username
  const password = req.body.password
  if (db_user[username].password === password) {
    next()
  } else {
    res.send(' Password invalid.')
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
  db_user[username] = {username, password, email}
  console.log(db_user)
  console.log(req.body)
  res.send("Registration success !")
})

app.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}`)
})

module.exports = app;
