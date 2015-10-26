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
var AnimalType  = require('../models/type');
// get an instance of the router for api routes
var router = express.Router();

// ===================================================
// Open Routes
// ===================================================

// route to show a random message
router.get('/', function(req, res) {
	res.json({ message: 'Welcome to the API for SteerCleere!' });
});

// Registers a user
router.post('/user', function(req, res) {




	//TODO: check if each field exists before creating and saving object
	User({
		_id: req.body.username,
		password: bcrypt.hashSync(req.body.password),
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		email: req.body.email
	}).save(function(err) {
		if(err) {
			//Invalid email detected
			if(err.errors && err.errors.email &&  err.errors.email.properties.path === "email"){
				res.json({success: false, message: "Email is not valid"});
			}
			else if(err && err.code !== 11000) {
				res.json({success: false, message: "Another error occurred"});
			}
			else if(err && err.code === 11000) {
				console.log(err);
				res.json({success: false, message: "Username/email already taken"});
			};
		} else {
			console.log(req.body.username + ' saved successfully');
			res.json({ success: true});
		}
	});
});

// Route to authenticate a user
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
				var token = jwt.sign({user: user}, app.get('superSecret'), {
					expiresInMinutes: 1440 // expires in 24 hours
				});

				// return the information including token as JSON
				res.json({
					success: true,
					message: 'Enjoy your token!',
					token: token,
					username: user._id,
					fname: user.first_name,
					lname: user.last_name,
					email: user.email
				});
			}
		}
	});
});

// TODO: Remove before deployment
// FOR DEV USE ONLY!
router.get('/users', function(req, res) {
	var users = User.find(function(err, users) {
		res.json(users);
	});
})

// ===================================================
// Middleware token check
// ===================================================

// route middleware to verify a token
router.use(tokenAuth);

// ===================================================
// Authorized API Routes
// ===================================================



// Test function to test if token authentication worked
router.post('/checktoken', function(req, res) {
	res.json({success: true});
});

// ==================
// User
// ==================

// Gets users information
router.get('/users/:username', function(req, res) {
	console.log("Viewing user " + req.params.username);
	var user = User.findOne({ _id: req.params.username }, function(err, user) {
		res.json(user);
	});
});

// ==================
// Animals
// ==================

// Gets information for all animals belonging to a user
router.get('/animals', function(req, res) {
	console.log("Viewing animals for " + req.decoded.user._id);
	Animal.find({ managedBy: req.decoded.user._id }, function(err, animals) {
		res.json(animals);
	});
});

// Gets information for  specific animal
router.get('/animals/:id', function(req, res) {
	var animal_id = req.params.id;

	console.log("Viewing animal: " + animal_id);
	var animal = Animal.findOne({ _id: animal_id }, function(err, animal) {
		if(animal && animal.managedBy === req.decoded.user._id){
			res.json(animal);
		}
		else{
			res.json({success: false, message: 'You do not have access to this animal.'});
		}
	});
});

router.delete('/animals/:id', function(req, res) {
	console.log("removing " + req.params.id + " from user");
	var animal_id = req.params.id;
	
	Animal.findOne({ _id: animal_id }, function(err, animal) {
		
		if(animal && animal.managedBy === req.decoded.user._id) {
			console.log("updating animal");
			animal.managedBy = "nobody";
			console.log(animal.managedBy);
			animal.save(function(err) {
				if (err) { 
					console.log(err); 
					res.json({success: false});
				} else {
					res.json({succeess: true});
				}
				
			});
			
			
		} else {
			//console.log(animal.managedBy);
			res.json({success: false, message: 'You do not have access to this animal.'});
		}
		
		
	});
	
	
});

// Add animal for user
router.post('/animals', function(req, res) {

	//TODO: check if each field exists before creating and saving object

	console.log(req.body.id);
	console.log(req.decoded.user._id);
	console.log(req.body.name);
	console.log(req.body.type);
	console.log(req.body.breed);

	Animal.findOne({_id: req.body.id}, function(err, animal) {
		if(animal) {
			animal.managedBy = req.decoded.user._id;
			animal.save(function(err) {
				if (err) { 
					console.log(err); 
					res.json({success: false});
				} else {
					res.json({succeess: true});
				}
				
			});
			
		} else {
			
			Animal({
				_id: req.body.id,
				managedBy: req.decoded.user._id,
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
		
		
	})
	
});

// ==================
// Weights
// ==================

// View all the weights for a single animal
router.get('/weights', function(req, res) {
	console.log("Getting weights for animal: " +  req.headers['id']);
	Weight.find({id: req.headers['id']}, function(err, weights) {
		res.json(weights);
	});
});

// View all the weights for a single animal
router.get('/weights/:id', function(req, res) {

	var animal_id = req.params.id;

	console.log("Viewing weights for animal: " + animal_id);
	var animal = Weight.find({ id: animal_id }, function(err, weights) {
		res.json(weights);

	});
});

// Add a weight for a specific animal
router.post('/weights', function(req, res) {
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

router.post('/weights/:id', function(req, res) {
	var animal_id = req.params.id;
	console.log("date: "+req.body.date);
	Animal.findOne({
		_id: animal_id
	}, function(err, animal) {
		if (!animal) {
			res.json({success: false, message: "Animal "+animal_id+" does not exist"});
		} else {
			//TODO: check if each field exists before creating and saving object

			Weight({
				id: animal_id,
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

// ==================
// Breeds
// ==================

// Get all the animal types
router.get('/breeds', function(req, res) {
	console.log("Sending types");
	AnimalType.find({}, function(err, types) {
		if(err) {
			console.log(err);
			res.json({success: false, message: "An error occurred"});
		} else {
			console.log(types);
			res.json({ success: true, types: types});
		}
	});
});

// Add a type and/or breed to the databse
router.post('/breeds', function(req, res) {

	// Finds and updates existing model in collection or creates one if it doesn't exist
	// Can have duplicate breeds in each animal type
	AnimalType.findOneAndUpdate(
		{type: req.body.type},
		{$addToSet: { breeds: {breed: req.body.breed}}},
		{safe: true, upsert: true, new : true},
		function(err, model) {
			if(err) {
				console.log(err);
				res.json({success: false, message: "An error occurred"});
			} else {
				console.log("{" + req.body.type + ", " + req.body.breed + "}" + " saved successfully");
				res.json({ success: true });
			}

		}
	);
});

// Export for use in server.js
module.exports = router
