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
    res.render('signin.html');
});

// GET http://ec2-52-88-233-238.us-west-2.compute.amazonaws.com:8080/about
router.get('/about', function(req, res) {
    res.render('about.html');
});

// GET http://ec2-52-88-233-238.us-west-2.compute.amazonaws.com:8080/register
router.get('/register', function(req, res) {
    res.render('register.html'); // TODO: Add Register.html to views folder
});

// POST http://ec2-52-88-233-238.us-west-2.compute.amazonaws.com:8080/register
router.post('/register', function(req, res) {
    // TODO: Create user and add to database from what is passed back to the server
});

// router.get('/setup', function(req, res) {
//
//   // create a sample user
//   var jeremy = new User({
//     name: 'Jeremy',
//     password: bcrypt.hashSync('password'), // Encrypts password for storage in database
//   });
//
//   // save the sample user
//   jeremy.save(function(err) {
//     if (err) throw err;
//
//     console.log(jeremy.name + ' saved successfully');
//     res.json({ success: true });
//   });
// });

// Export for use in server.js
module.exports = router
