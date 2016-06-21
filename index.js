// Create references for libraries
var express = require('express');
var http = require('http');
var firebase = require('firebase');

// Express Server Setup
var app = express();
var server = http.createServer(app);

//Autheniticate with firebase
firebase.initializeApp({
  serviceAccount: "firebase-credentials.json",
  databaseURL: "https://mutant-office-hours-5e622.firebaseio.com"
});

server.listen(3030, function() {
  console.log('listening on http://localhost:3030');
});
