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
var Weight 		= require('../models/weight');
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
    _id: req.body.username.toLowerCase()
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

// TODO: Remove before deployment
// FOR DEV USE ONLY!
router.get('/users', function(req, res) {
    var users = User.find(function(err, animals) {
		res.json(animals);
	});
})

// route middleware to verify a token
router.use(tokenAuth);

// route to add an animal (GET http://localhost:8080/api/addanimal)
router.post('/addanimal', function(req, res) {
    User.findOne({
		_id: req.body.managedBy.toLowerCase()
	}, function(err, user) {
		if (!user) {
			res.json({success: false, message: "User does not exist"});
		} else {
			//TODO: check if each field exists before creating and saving object
			
			
			Animal({
				_id: req.body.id,
				managedBy: req.body.managedBy.toLowerCase(),
				name: req.body.name,
				type: req.body.type,
				breed: req.body.breed
			}).save(function(err) {
				if(err) {
					if(err && err.code !== 11000) {
						res.json({success: false, message: "Another error occurred"});
					}
					if(err && err.code === 11000) {
						res.json({success: false, message: "Duplicate animal"});
					}
				} else {
					console.log(req.body.name + ' saved successfully');
					res.json({ success: true });
				}
			});			
			
			
		}
		
	});
	

});

router.post('/checktoken', function(req, res) {
	res.json({success: true});

});

router.post('/viewweights', function(req, res) {
  console.log("Viewing weights for " + req.body.id);
});

router.get('/viewanimal', function(req, res) {
	console.log("Viewing animal " + req.body.id);
	var animal = Animal.find({ id: req.body.id }, function(err, animal) {
		res.json(animal);
	});
});

router.post('/addweight', function(req, res) {
    Animal.findOne({
		_id: req.body.id.toLowerCase()
	}, function(err, animal) {
		if (!animal) {
			res.json({success: false, message: "Animal does not exist"});
		} else {
			//TODO: check if each field exists before creating and saving object
			
			
			Weight({
				id: req.body.id,
				weight: req.body.weight,
				date: req.body.date
			}).save(function(err) {
				if(err) {
					if(err && err.code !== 11000) {
						res.json({success: false, message: "Another error occurred"});
					}
					if(err && err.code === 11000) { //TODO: shouldn't need this
						res.json({success: false, message: "Duplicate found?"});
					}
				} else {
					console.log('weight saved successfully');
					res.json({ success: true });
				}
			});			
			
			
		}
		
	});
});


router.post('/viewanimals', function(req, res) {
	console.log("Viewing animals for " + req.decoded._id);
	var animals = Animal.find({ managedBy: req.decoded._id }, function(err, animals) {
		res.json(animals);
	});

});

router.post('/viewweights', function(req, res) {
	console.log("Viewing weights for " + req.decoded.id);
	var weights = Weight.find({ id: req.decoded.id }, function(err, weights) {
		res.json(weights);
	});

});

// Export for use in server.js
module.exports = router
