const express = require('express')
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const app = express()
app.get('/', (req, res) => res.send('Quran BOT Migrated to Keyob!'));


var Twit = require('twit')
const request = require('request');
var T = new Twit({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
})

var stream = T.stream('statuses/filter', { track: ['@QuranThis'] });
stream.on('tweet', tweetEvent);

function tweetEvent(tweet) {

  // Who sent the tweet?
  var name = tweet.user.screen_name;
  // What is the text?
  var txt = tweet.text;
  var word = txt.split(' ')
  var verse = word[3]
  //console.log(verse);

  request(`http://api.alquran.cloud/v1/ayah/${verse}/en.pickthall`, function (err, res, body) {
    body = JSON.parse(body);
    console.log(body.data.text);
    // the status update or tweet ID in which we will reply


    var nameID = tweet.id_str;
    // var sentence = body.data.text
    var reply = `@${name} ${verse} says: ${body.data.text}`;
    var params = {
      status: reply, in_reply_to_status_id: nameID
    };
    if (body.data.text !== undefined) {
      T.post('statuses/update', params, function (err, data, response) {
        if (err !== undefined) {
          console.log(err);
        } else {
          console.log('Tweeted: ' + params.status);
        }
      })
    } else {

    }
  });

};


app.listen(PORT, () =>
  console.log(`Your Quran Bot app is now deployed on Koyeb ${PORT}!`)
);
