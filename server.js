
// BASE SETUP
// =====================================

// Call the packages -------------------
var express = require('express'); // call express
var app = express(); //define our app using express
var bodyParser = require('body-parser'); // get body-parser
var morgan = require('morgan'); // used to see requests
var mongoose = require('mongoose'); // for working w/ our mongo database
var config = require('./config'); // our config file
var path = require('path'); // node module required to pass HTML files
var apiRoutes = require('./app/routes/api.routes')(app, express); // all of our routes will be prefixed with /api

// APP CONFIGURATION --------------------
// use the body parser so we can grab information from POST requests
app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json());

// configure our app to handle CORS requests
app.use(function( req, res, next ) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
    next();
});

// log all requests to the console
app.use(morgan('dev'));

// connect to our database
mongoose.connect(config.database);

// set static file location
// used for requests that our frontend will make
app.use(express.static(__dirname + '/public'));

// ROUTES FOR OUR API =====================
// ========================================

// API ROUTES -----------------------------
app.use('/api', apiRoutes);

/*
MAIN CATCHALL ROUTE --------------------------------------------------
Node routes will take place here and then any request sent to
a route that isn’t handled by Node should be taken care of by Angular.
This is where a catchall route comes in handy. Any route not handled
by Node will be passed to Angular.
----------------------------------------------------------------------
*/
app.get('/', function( req, res ) {
    res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

// START THE SERVER
//==========================================
app.listen(config.port);
console.log('Magic happens on port ' + config.port);

