// ============================================================================
// Router defined for our basic routes.
//
// ============================================================================

// =======================
// Packages
// =======================
var express     = require('express');
var bcrypt      = require('bcrypt-nodejs'); // Encryption module

// Middleware
var tokenAuth   = require('../middleware/authenticate')

// Models
var User        = require('../models/user'); // get our mongoose model

// get an instance of the router for api routes
var router = express.Router();

// ====================
// Routes
// ====================
// GET http://ec2-52-88-233-238.us-west-2.compute.amazonaws.com:8080/
router.get('/', function(req, res) {
    res.render('index.html');
});

// GET http://ec2-52-88-233-238.us-west-2.compute.amazonaws.com:8080/about
router.get('/about', function(req, res) {
    res.render('about.html');
});

// GET http://ec2-52-88-233-238.us-west-2.compute.amazonaws.com:8080/register
router.get('/register', function(req, res) {
    res.render('register.html');
});

router.get('/addanimal', function(req, res) {
    res.render('addanimal.html');
});

router.get('/addweight', function(req, res) {
    res.render('addweight.html');
});

router.get('/viewanimals', function(req, res) {
    res.render('viewanimals.html');
});

router.get('/signin', function(req, res) {
	res.render('signin.html');
});

router.get('/index', function(req, res) {
    res.render('index.html');
});

router.get('/animal', function(req, res) {
	res.render('animal.html');
});

// Export for use in server.js
module.exports = router
