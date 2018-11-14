var express = require('express'); //npm install express
var app = express();
var cors = require('cors')
require('dotenv').config()

app.use(cors())

//Load the request module
var request = require('request'); //npm install request

//Lets configure and request

//accepts the redirect_uri in the form of http://localhost:8080/?code=blah
app.get('/oauth', function(req, res) {
    var auth_code = req.query.code;

    var success_body = "";
    var resp = request({
        url: 'https://oauth.ticketmaster.com/oauth/token', //URL to hit
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: {
            grant_type: 'authorization_code',
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            code: auth_code
        }
    }, function(error, response, body) {
        if (error) {
            console.log(error);
        } else {
            console.log(response.statusCode, body);
            success_body = JSON.parse(body);
            console.log(success_body.access_token);
            console.log(success_body.refresh_token);
            res.redirect("http://localhost:4200/?access_token="+success_body.access_token+"&refresh_token"+success_body.refresh_token);
        }
    });
});


app.get('/listEvents', function(req, res) {

    var keyword = req.query.keyword

    var resp = request({
        url: 'https://app.ticketmaster.com/discovery/v2/events.json?apikey='+process.env.CLIENT_ID+'&keyword='+keyword,
        method: 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }, function(error, response, body) {
        if (error) {
            console.log(error);
        } else {
            console.log(response.statusCode);
            res.json(response);
        }
    });
});

app.get('/getEventDetails', function(req, res) {

    var eventId = req.query.events

    var resp = request({
        url: 'https://app.ticketmaster.com/inventory-status/v1/availability?apikey='+process.env.CLIENT_ID+'&events='+eventId,
        method: 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }, function(error, response, body) {
        if (error) {
            console.log(error);
        } else {
            console.log(response.statusCode);
            res.json(response);
        }
    });
});

app.listen(8080, function() {
    console.log('Example app listening on port 8080!');
});
