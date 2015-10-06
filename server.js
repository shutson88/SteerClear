// =======================
// get the packages we need ============
// =======================
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose'); // MongoDB connection module

var config = require('./config'); // get our config file



// =======================
// configuration =========
// =======================
var port = process.env.PORT || 8080; // used to create, sign, and verify tokens
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

mongoose.connect(config.database); // connect to database
var db = mongoose.connection;
app.set('superSecret', config.secret); // secret variable

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

//Serve up public files
app.use(express.static('public'));

// =======================
// Routers ===============
// =======================

// address:port/*
var basicRoutes = require('./routes/basicRouter');
app.use('/', basicRoutes);

// API ROUTES -------------------
// get an instance of the router for api routes
var apiRoutes = express.Router();

// address:port/api/*
var apiRoutes = require('./routes/apiRouter');
app.use('/api', apiRoutes);

// =======================
// start the server ======
// =======================
app.listen(port);
console.log('Server started');
