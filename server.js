// const mysql = require('mysql');
const express = require("express");
const session = require('express-session');
const path = require('path');
const https = require("https");

const app = express();
const port = 443;
// Requiring file system to use local files
const fs = require("fs");

// const connection = mysql.createConnection({
//   host     : '208.113.245.153',
//   user     : 'ezgto',
//   password : '#2563eb1991',
//   database : 'ezgto_db'
// });

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  express.static(path.join(__dirname, './dist'))
);

app.get('/', function(request, response) {
  // If the user is loggedin
  if (request.session.loggedin) {
    // Output username
    response.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
    response.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    response.sendFile(path.join(__dirname + '/dist/home.html'));
  } else {
    // Not logged in
    response.sendFile(path.join(__dirname + '/dist/login.html'));
  }
});
app.post('/auth', function(request, response) {
  // Capture the input fields
  let username = request.body.username;
  let password = request.body.password;
  // Ensure the input fields exists and are not empty
  if (username && password) {
    // Execute SQL query that'll select the account from the database based on the specified username and password
    // connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
    //   // If there is an issue with the query, output the error
    //   if (error) throw error;
    //   // If the account exists
    //   if (results.length > 0) {
    //     // Authenticate the user
    //     request.session.loggedin = true;
    //     request.session.username = username;
    //     // Redirect to home page
    //     response.redirect('/');
    //   } else {
    //     response.send('Incorrect Username and/or Password!');
    //   }     
    //   response.end();
    // });
    request.session.loggedin = true;
    response.redirect('/');
    response.end();
  } else {
    response.send('Please enter Username and Password!');
    response.end();
  }
});
app.get('/logout', function(request, response){
    request.session.destroy();
    response.redirect("/");
});

const options = {
  ca: fs.readFileSync("fullchain.pem"),
  key: fs.readFileSync("privkey.pem"),
  cert: fs.readFileSync("cert.pem"),
};
  
// Creating https server by passing
// options and app object
https.createServer(options, app)
.listen(port, function (req, res) {
  console.log(`Listening at http://localhost:${port}`);
});