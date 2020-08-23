'use strict';
var express = require('express');
var mongo = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://127.0.0.1:27017/';
var Twit = require('twit')
var router = express.Router();

var T = new Twit({
    consumer_key: 'OyWguSn7Kv063tjWWoMjoVmiu',
    consumer_secret: 'DBcSLELXYqWyQbRTVBcEz1kE2A9p275Y5mCu9R2ua3rIcQlkdD',
    access_token: '999979742454525952-HAxuVKIf4eqDGVW9i2o5zquAhpc6B3Q',
    access_token_secret: 'c6Y9GgydO4P6mwk852HcI34wMfzSwlNEUNmaK61G9MBlY',
    //timeout_ms: 60 * 1000,  // optional HTTP request timeout to apply to all requests.
})

/* GET users listing. */
router.get('/', function (req, res) {
    res.send('respond with a resource');
});
router.get('/hello', (req, res) => {
    res.send({ express: 'Hello From Express' });
}); 
router.get('/hello1', (req, res) => {
    res.send({ express: 'Hello From Express',name: 'Faisal' });
}); 


router.get('/tweet', (req, res) => {
    var myArray = ['Test', 'again Test', 'Final test ','Hurry completed!!!!!! ',]

    for (var i = 0; i < 50; i++) {
        var sss = makeid();
        T.post('statuses/update', { status: sss + ' hello, its me!!! Treanding  #test #testTweet' }, function (err, data, response) {
            res.send({ tweet: "ho gya" });
        })
    }
     
    
    
  

    //var ddd;
    //T.get('search/tweets', { q: 'Pakistan', count: 1 }, function (err, data, response) {
    //    res.send(data.statuses[0].text);
    //})
   
}); 
function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 50; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}




////mongo
router.get('/getdata', function (req, res, next) {

    mongo.connect(url, function (err, db) {
        var dbo = db.db("test");
        dbo.collection('abc').find().toArray(function (err, results) {
            //console.log(results)
            res.send(results);
        })
    });
});











module.exports = router;
