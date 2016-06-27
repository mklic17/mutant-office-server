// Create references for libraries
var express = require('express');
var http = require('http');
var firebase = require('firebase');
var twilio = require('twilio');
var dotenv = require('dotenv');
var mailgun = require('mailgun-js');

// Express Server Setup
var app = express();
var server = http.createServer(app);
dotenv.load();


//Autheniticate with firebase
firebase.initializeApp({
  serviceAccount: "firebase-credentials.json",
  databaseURL: "https://mutant-office-hours-5e622.firebaseio.com"
});

var rootRef = firebase.database().ref();

// Autheniticate with twilio
var twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// authentication with mailgun-js
var mailgunClient = mailgun({apiKey: process.env.MAILGUN_KEY, domain: process.env.MAILGUN_DOMAIN});

//listen for new tests being added
var textsRef = rootRef.child('text');

textsRef.on('child_added', function(snapshot) {
  var text = snapshot.val();
  twilioClient.messages.create({
    body: text.name + ', I am available to see you now. Please come to my office so we can discuss:  ' + text.topic + '.',
    to: text.phoneNumber,  // Text this number
    from: process.env.TWILIO_PHONE // From a valid Twilio number
    }, function(err, message) {
        if(err) {
          console.log(err.message);
        }
    });
});


//listen for new emails
var emailsRef = rootRef.child('emails');
emailsRef.on('child_added', function(snapshot){
  var email = snapshot.val();

  var emailData = {
   from: '<postmaster@' + process.env.MAILGUN_DOMAIN +'>',
   to: email.emailAddress,
   subject: 'Welcome',
   text: 'Mutant Office Hours, it is nice.'
 };

  mailgunClient.messages().send(emailData, function(error, body) {
    console.log(body);
    if (error) {
      console.log(error);
    }
  });
});


server.listen(3030, function() {
  console.log('listening on http://localhost:3030');
});
