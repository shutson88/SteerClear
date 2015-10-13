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

//api call to register a user
router.post('/register', function(req, res) {
    
	//TODO: check if each field exists before creating and saving object
	User({
		_id: req.body.username,
		password: bcrypt.hashSync(req.body.password),
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email
	}).save(function(err) {
		if(err) {
			if(err && err.code !== 11000) {
				console.log(err);
				res.json({success: false, message: "Another error occurred"});
			}
			if(err && err.code === 11000) {
				console.log(err);
				res.json({success: false, message: "Username/email already taken"});
			};
		} else {
			console.log(req.body.username + ' saved successfully');
			res.json({ success: true});
		}

	});

});

// Export for use in server.js
module.exports = router
