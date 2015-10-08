// ============================================================================
// Router defined for our API.
//
// ============================================================================

// =======================
// Packages
// =======================
var express     = require('express');
var app         = express();
var bcrypt      = require('bcrypt-nodejs'); // Encryption module
var jwt         = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config      = require('../config'); // get our config file

app.set('superSecret', config.secret); // secret variable

// Middleware
var tokenAuth   = require('../middleware/authenticate')

// Models
var User        = require('../models/user'); // get our mongoose model
var Animal 		= require('../models/animal');
// get an instance of the router for api routes
var router = express.Router();

// ====================
// Routes
// ====================

// route to show a random message (GET http://localhost:8080/api/)
router.get('/', function(req, res) {
  res.json({ message: 'Welcome to the coolest API on earth!' });
});

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
router.post('/authenticate', function(req, res) {

  // find the user
  User.findOne({
    username: req.body.username
  }, function(err, user) {

    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {

      // check if password matches
      if (!bcrypt.compareSync(req.body.password, user.password)) { // Checks given password with stored encrypted oneS
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {

        // if user is found and password is right
        // create a token
        var token = jwt.sign(user, app.get('superSecret'), {
          expiresInMinutes: 1440 // expires in 24 hours
        });

        // return the information including token as JSON
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
      }

    }

  });
});

// route middleware to verify a token
router.use(tokenAuth);

// route to add an animal (GET http://localhost:8080/api/addanimal)
router.post('/addanimal', function(req, res) {
    Animal({
		id: req.body.id,
		managedBy: req.body.managedBy,
		name: req.body.name,
		type: req.body.type,
		breed: req.body.breed,
		date: req.body.date,
		latestWeight: req.body.latestWeight
	}).save(function(err) {
		if(err) throw err;
		console.log(req.body.name + ' saved successfully');
		res.json({ success: true});
	});
	

	
    //res.json({success: false});

});

router.get('/checktoken', function(req, res) {

  res.json({success: true});

});


router.post('/viewanimals', function(req, res) {
	console.log("Viewing animals for " + req.decoded.username);
	var animals = Animal.find({ managedBy: req.decoded.username }, function(err, animals) {
		res.json(animals);
	});
  
});

// Export for use in server.js
module.exports = router
