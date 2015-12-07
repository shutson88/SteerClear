// =======================
// get the packages we need ============
// =======================
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose'); // MongoDB connection module
var path 		= require('path');
var favicon 	= require('serve-favicon');
var config 		= require('./config'); // get our config file
var schedule 	= require('node-schedule'); // Used to run scheduled tasks

var crypto		= require('crypto');

// Models
var User        = require('./models/user'); // get our mongoose model

// =======================
// configuration =========
// =======================
var port = process.env.PORT || 8080; // used to create, sign, and verify tokens
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public/app'));
app.use(favicon(path.join(__dirname + '/public/images/favicon.ico')));
mongoose.connect(config.database); // connect to database
var db = mongoose.connection;
app.set('superSecret', config.secret); // secret variable


// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

// =======================
// Routers ===============
// =======================

// API ROUTES -------------------
// get an instance of the router for api routes
var apiRoutes = express.Router();

// address:port/api/*
var apiRoutes = require('./routes/apiRouter');
app.use('/api', apiRoutes);

app.get('/*', function(req, res, next) {
	res.sendFile(path.join(__dirname, '/public/app', 'index.html'));
});


app.get('/dashboard', function(req, res, next) {
	res.sendFile(path.join(__dirname, '/public/app', 'index.html'));
});

app.get('*', function(req, res, next) {
	res.sendFile(path.join(__dirname, '/public/app', 'index.html'));
});

// =======================
// Weekly notification purge
// =======================

schedule.scheduleJob({ hour: 0, minute: 30, dayOfWeek: 0 }, function(){ // Runs function at 12:30am every Sunday
	// Remove notifications older than a week
	var purgeDate = new Date();
	purgeDate.setDate(purgeDate.getDate() - 7);

	User.update(
		{ /* No parameters so it iterates through all */ },
		{ $pull: { notifications: { date: { "$lt": purgeDate } } } },
		{multi: true},
		function(err) {
			if(err) {
				console.log("ERROR removing notifications: " + err);
			} else {
				console.log("Deleted all week old notifications");
			}
		}
	);
});

// =======================
// start the server ======
// =======================
app.listen(port);
console.log('Server started');
