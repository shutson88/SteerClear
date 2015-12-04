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
var nodemailer 	= require('nodemailer');
var os 			= require('os');
//var async 		= require('async');


var transporter = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: config.emailUser,
		pass: config.emailPassword
	}
});

app.set('superSecret', config.secret); // secret variable
app.set('resetSecret', config.resetSecret);
// Middleware
var tokenAuth   = require('../middleware/authenticate')

// Models
var User        = require('../models/user'); // get our mongoose model
var Animal 		= require('../models/animal');
var Weight 		= require('../models/weight');
var AnimalType  = require('../models/type');
// get an instance of the router for api routes
var router = express.Router();



var verifyPermission = function(sourceID, destID, callback) {
	if(sourceID == destID) {
		callback(true);
	} else {
		console.log("Checking if " + sourceID + " is managed by " + destID);


		User.findOne({ _id: destID, observing: {"$in" : [{username: sourceID}]}}, function(err, user) {
			if(user) {
				callback(true);
			} else if(!user) {
				callback(false);
			}
		});
	}
}
var verifyAdmin = function(code) {
	if(code == 123456) { //perform some check on the code to verify it
		return true;
	} else {
		return false
	}

};




// Sends notifications to all of your observers
// To be called in every api function that needs to send a notification
var sendNotifications = function(message, sender_id) {

	User.findOne({ _id: sender_id }, function(err, user) {

		if(user) {
			for(var i = 0; i < user.observedBy.length; i++) {
				// console.log(sender_id + ' is observed by ' + user.observedBy[i].username);
				var username = user.observedBy[i].username;
				User.update(
					{ _id: user.observedBy[i].username },
					{ $addToSet: { notifications: {
						date: new Date(),
						read: false,
						message: message, // TODO: pull message from request
						sender: sender_id }}},
					{ safe: true, upsert: true, new : true },
					function(err) {
						if(err) console.log(err);
					}
				);
			}
		}
	});
}

// ===================================================
// Open Routes
// ===================================================

// route to show a random message
router.get('/', function(req, res) {
	res.json({ message: 'Welcome to the API for SteerCleere!' });
});

// Registers a user
router.post('/user', function(req, res) {


	var managedBy = "nobody";
	if(req.body.managedBy) {
		managedBy = req.body.managedBy;
	}
	var isAdmin = false;
	if(verifyAdmin(req.body.admin_code) === true) {
		isAdmin = true;

	} else {
		isAdmin = false;
	}

	//TODO: check if each field exists before creating and saving object
	User({
		_id: req.body.username,
		password: bcrypt.hashSync(req.body.password),
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		managedBy: managedBy,
		email: req.body.email,
		admin: isAdmin
	}).save(function(err) {
		if(err) {
			console.log(err);
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
					email: user.email,
					admin: user.admin
				});
			}
		}
	});
});

// Password reset
router.put('/passreset/', function(req, res) {
	if(req.body.resetToken) {
		if(req.body.resetNewPassword) {
			User.findOne({resetPasswordToken: req.body.resetToken}, function(err, user) {
				if(user) {
					user.resetPasswordToken = "";
					user.resetPasswordExpires = new Date();

					user.password = bcrypt.hashSync(req.body.resetNewPassword);
					user.save(function(err) {
						if(err) {
							res.json({success: false, message: "Password reset failed"});
						} else {
							res.json({success: true, message: "Password reset successfully"});
						}
					});

				}


			});

		}
	} else {
		var token;
		User.findOne({email: req.body.email}, function(err, user) {
			if(user) {
				token = jwt.sign({user: user._id}, app.get('resetSecret'), {
					expiresInMinutes: 60 // expires in 1 hours
				});

				user.resetPasswordToken = token;
				var expDate = new Date();
				user.resetPasswordExpires = expDate.setMinutes(expDate.getMinutes() + 60);
				user.save(function(err) {
					if(err) {
						res.json({success: false, message: "Password reset initiation failed"});
					} else {
						res.json({success: true, message: "Password reset initiated"});
					}
				});
			} else {
				res.json({success: false, message: "No user found with that email"});
			}


			var resetUrl = "http://" + req.get('host') + "/manage/" + token;


			var mailOptions = {
				from: 'No Reply <' + config. emailUser + '>',
				to: req.body.email,
				subject: 'Password reset',
				html: '<a href="' + resetUrl + '">reset password</a>'

			};

			transporter.sendMail(mailOptions, function(err, info) {
				if(err) {
					console.log(err);
				} else {
					console.log("message sent");
				}
			});
		});


	}

});

// TODO: Remove, only for dev purposes
router.get('/all', function(req, res) {
	User.find({},function(err, users) {
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
	sendNotifications(req.decoded.user.first_name + ' ' + req.decoded.user.last_name + ' just checked their token!', req.decoded.user._id);
	res.json({success: true});
});

// ==================
// User
// ==================

// Gets users information
router.get('/user/', function(req, res) {
	//console.log("Viewing user " + req.decoded.user._id);
	var user = User.findOne({ _id: req.decoded.user._id }, function(err, user) {
		res.json(user);
	});
});

// Gets users observed by user
router.get('/users/', function(req, res) {
	//console.log("Viewing youth you are observing");

	User.findOne({ _id: req.decoded.user._id }, function(err, user) {

		//console.log(user);

		var observed = [];

		var nUsersToAdd = user.observing.length;
		if(nUsersToAdd == 0) {
			res.json([]);

		} else {

			var callback = function() {
				nUsersToAdd -= 1;
				if(nUsersToAdd <= 0) {
					res.json(observed);
				}

			}

			for(var i = 0; i < user.observing.length; i++) {
				User.findOne({_id: user.observing[i].username}, function(err, user) {
					//console.log(user);
					observed.push(user);
					callback();

				});
			}
		}
	});
});

// Update information for user
router.put('/user/', function(req, res) {

	if(req.body.currentPassword && req.body.newPassword) {

		if(bcrypt.compareSync(req.body.currentPassword, req.decoded.user.password)) {
			User.findOne({_id: req.decoded.user._id}, function(err, user) {
				if(user) {
					user.password = bcrypt.hashSync(req.body.newPassword);
					user.save(function(err) {
						if(err) {
							res.json({success: false, message: "Password update failed"});
						} else {
							res.json({success: true, message: "Password updated successfully"});
						}
					});
				} else {
					res.json({success: false, message: "User not found"});
				}


			});

		} else {
			res.json({success: false, message: "The password you entered is not correct"});
		}


	}


});

// Adds/removes an observer for a user
router.put('/users/', function(req, res) {
	//console.log("Updating user " + req.decoded.user._id);
	var stopObserving = false;
	if(req.body.stop == true) {
		stopObserving = true;

	} else {
		stopObserving = false;
	}

	var message = {};
	nUsersToUpdate = 2;
	var callback = function() {
		nUsersToUpdate -= 1;
		if(nUsersToUpdate <= 0) {
			if(message.observedBy.success == false || message.observing.success == false) {
				res.json({success: false, message: "Failed to add observer"});
			} else {
				if(stopObserving) {
					res.json({success: true, message: "Observer removed successfully"});
				} else {
					res.json({success: true, message: "Observer added successfully"});
				}

			}

		}

	}
	User.findOne({_id: req.body.id}, function(err, user) {
		if(user) {
			var updateMe = {};
			var updateOther = {};
			if(stopObserving == true) {
				updateOther = {$pull: {observedBy: {username: req.decoded.user._id},
				observing: {username: req.decoded.user._id}}};
				updateMe = {$pull: {observing: {username: req.body.id},
				observedBy: {username: req.body.id}}};
			} else {
				updateMe = {$addToSet: {observedBy: {username: req.body.id}}};
				updateOther = {$addToSet: {observing: {username: req.decoded.user._id}}};
			}
			User.findOneAndUpdate(
				{ _id: req.decoded.user._id},
				updateMe,
				{safe: true, upsert: true, new: true},
				function(err, user) {
					if (err) {
						message.observedBy = {success: false};
					} else {
						message.observedBy = {success: true};
					}
					callback();
				}
			);
			User.findOneAndUpdate(
				{ _id: req.body.id},
				updateOther,
				{safe: true, upsert: true, new: true},
				function(err, user) {

					if (err) {

						message.observing = {success: false};
					} else {
						message.observing = {success: true};
					}
					callback();
				}

			);
		} else {
			res.json({success: false, message: req.body.id + " not found"});
		}
	});
});

// ==================
// Animals
// ==================

// Gets information for ALL animals belonging to a user
router.get('/animals/:id', function(req, res) {
	if(!req.params.id) {
		res.json({success: false, message: "You did not send a user id"});
	} else {
		verifyPermission(req.params.id, req.decoded.user._id, function(status) {
			if(status === true) {
				Animal.find({ managedBy: req.params.id }, function(err, animals) {
				res.json({success: true, message: "Successfully sending animals", data: animals});
			});
			} else {
				res.json({success: false, message: "You do not have permission to access this user's animals"});
			}


		});

	}


});

// Gets information for ONE animal
router.get('/animal/:id', function(req, res) {
	if(!req.params.id) {
		res.json({success: false, message: "You did not send an animal ID"});
	} else {
		Animal.findOne({ _id: req.params.id }, function(err, animal) {
			if(animal){
				verifyPermission(animal.managedBy, req.decoded.user._id, function(status) {
					if(status === true) {
						res.json({success: true, message: "Successfully sending animal", data: animal});
					} else {
						res.json({success: false, message: 'You do not have access to this animal.'});
					}
				});
				
			} else {
				res.json({success: false, message: 'Animal not found'});
			}
		});
	}
});

// Stop tracking or retire animal (given by id)
router.delete('/animal/:id', function(req, res) {
	
	if(!req.params.id) {
		res.json({success: false, message: "You did not send an animal ID"});
	} else {
		Animal.findOne({ id: req.params.id, managedBy: req.decoded.user._id }, function(err, animal) {
			if(animal) {
				if(req.query.retire && req.query.retire == 'true') {
					animal.active = false;
					animal.save(function(err) {
						if(err) {
							res.json({success: false, message: "An error occurred"});
						} else {
							res.json({success: true, message: "You retired this animal"});
						}
						
					});
					
				} else {
					animal.managedBy = "removed-" + req.decoded.user._id;
					animal.save(function(err) {
						if (err) {
							console.log(err);
							res.json({success: false, message: "An error occurred"});
						} else {
							var notification = req.decoded.user.first_name + ' ' + req.decoded.user.last_name + ' removed ' + animal.name;
							sendNotifications(notification, req.decoded.user._id);
							res.json({success: true, message: "You stopped tracking this animal"});
						}
					});					
					
				}
				
				

			} else {
				res.json({success: false, message: 'You do not have an animal with that ID'});
			}
		});
	}


});






//Update an animal given an id
router.put('/animal/:id', function(req, res) {


	if(!req.body.newName && !req.body.newType && !req.body.newBreed) {
		res.json({success: false, message: "No new info, animal not updated"});
	} else {


		if(!req.params.id) {

			res.json({success: false, message: "You did not send an animal ID"});
		} else {
			Animal.findOne({_id: req.params.id}, function(err, animal) {
				if(animal && animal.managedBy === req.decoded.user._id) {

					if(req.body.newName) {animal.name = req.body.newName;}
					if(req.body.newType) {animal.type = req.body.newType;}
					if(req.body.newBreed) {animal.breed = req.body.newBreed;}

					animal.save(function(err) {
						if(err) {
							console.log(err);
							res.json({success: false, message: "An error occurred"});
						} else {
							var notification = req.decoded.user.first_name + ' ' + req.decoded.user.last_name + ' updated an animal\'s information';
							sendNotifications(notification, req.decoded.user._id);
							res.json({success: true, message: "Animal updated successfully"});
						}

					});


				} else {
					res.json({success: false, message: "Animal not found or you don't have access to this animal"});
				}


			});
		}
	}



});


// Add animal for user
router.post('/animals', function(req, res) {

	//TODO: check if each field exists before creating and saving object
	if(!req.body.id) {
		res.json({success: false, message: "You did not send an ID"});
	} else {

		Animal.findOne({id: req.body.id, managedBy: req.decoded.user._id, active: true}, function(err, animal) {
			if(animal) {
				res.json({success: false, message: "You already have an active animal with this ID"});
			} else {
				if(!req.body.name || !req.body.type || !req.body.breed || !req.body.projectyear) {
					res.json({success: false, message: "You did not include all the required info"});
				} else {
					
					Animal({
						id: req.body.id,
						managedBy: req.decoded.user._id,
						name: req.body.name,
						projectYear: req.body.projectyear,
						type: req.body.type,
						breed: req.body.breed
					}).save(function(err) {
						if(err) {

							if(err && err.code !== 11000) {

								res.json({success: false, message: "An error occurred"});
							}
							if(err && err.code === 11000) {
								res.json({success: false, message: "Duplicate animal"});
							}
						} else {
							//console.log(req.body.name + ' saved successfully');
							var notification = req.decoded.user.first_name + ' ' + req.decoded.user.last_name + ' added a new animal';
							sendNotifications(notification, req.decoded.user._id);
							res.json({ success: true, message: "Animal has been added" });
						}
					});
				}
			}
		})
	}
});

// ==================
// Weights
// ==================
var sortByKey = function(array, key) {
	return array.sort(function(a, b) {
		var x = a[key]; var y = b[key];
		return ((x > y) ? -1 : ((x < y) ? 1 : 0));
	});

}

// View all the weights for a specific animal
router.get('/weights/:id', function(req, res) {
	if(!req.params.id) {
		res.json({success: false, message: "You did not send an animal ID"});
	} else {
		Animal.findOne({_id: req.params.id}, function(err, animal) {
			if(animal) {
				verifyPermission(animal.managedBy, req.decoded.user._id, function(status) {
					if(status === true) {
						console.log("Viewing weights for animal: " + req.params.id);
						var animal = Weight.find({ id: req.params.id }, function(err, weights) {
							res.json({success: true, message: "Sending weights", data: sortByKey(weights, 'date')});

						});
					} else {
						res.json({success: false, message: "You do not have access to this animal's weights"});
					}

				});
			}
		});
	}


});

// Deletes a weight
router.delete('/weight/:id', function(req, res) {

	if(!req.params.id) {
		res.json({success: false, message: "You did not send a weight ID"});
	} else {
		Weight.findOne({_id: req.params.id}, function(err, weight) {
			if(weight) {
				Animal.findOne({_id: weight.id}, function(err, animal) {
					if(animal.managedBy != req.decoded.user._id) {
						res.json({success: false, message: "You do not have access to remove weights from this animal"});
					} else {
						weight.remove(function(err) {
							if(err) {
								res.json({success: false, message: "Failed removing weight"});
							} else {
								var notification = req.decoded.user.first_name + ' ' + req.decoded.user.last_name + ' removed a weight for ' + animal.name;
								sendNotifications(notification, req.decoded.user._id);
								res.json({success: true, message: "Weight removed successfully"});
							}

						});
					}
				});
			} else {
				res.json({success: false, message: "No weight with that ID"});
			}

		});
	}
});

// Add a weight for a specific animal
router.post('/weights/:id', function(req, res) {
	if(!req.params.id) {
		res.json({success: false, message: "You did not send an animal ID"});
	} else {
		Animal.findOne({
			_id: req.params.id
		}, function(err, animal) {
			if (!animal) {
				res.json({success: false, message: "Animal "+req.params.id+" does not exist"});
			} else {
				if(!req.body.weight || !req.body.date) {
					res.json({success: false, message: "You did not send the required info"});
				} else {
					if(animal.managedBy !== req.decoded.user._id) {
						res.json({success: false, message: "You do not have permission to add a weight for this animal"});

					} else {
						var tempDate = new Date(req.body.date);
						var tempMonth = tempDate.getMonth();
						var tempDay = tempDate.getDate();
						var tempYear = tempDate.getFullYear();
						Weight.findOne({id: req.params.id, date: {$gt: new Date(tempYear, tempMonth, tempDay), $lt: new Date(tempYear, tempMonth, tempDay+1)}}, function(err, weight) {
							if(!weight) {
								Weight({
										id: req.params.id,
										weight: req.body.weight,
										date: req.body.date
									}).save(function(err, weight) {
										if(err) {
											if(err && err.code !== 11000) {
												console.log(err);
												res.json({success: false, message: "Another error occurred"});
											}
											if(err && err.code === 11000) { //TODO: shouldn't need this
												res.json({success: false, message: "Duplicate found?"});
											}
										} else if(weight){
											var notification = req.decoded.user.first_name + ' ' + req.decoded.user.last_name + ' added a weight for ' + animal.name;
											sendNotifications(notification, req.decoded.user._id);
											res.json({ success: true, message: "Weight added successfully", data: weight._id});
										}
									});
							} else {
								res.json({success: false, message: "There is already a weight for this date"});
							}
						});



					}
				}



			}
		});
	}
});

// ==================
// Breeds
// ==================

// Get all the animal types
router.get('/breeds', function(req, res) {
	//console.log("Sending types");
	AnimalType.find({}, function(err, types) {
		if(err) {
			console.log(err);
			res.json({success: false, message: "An error occurred"});
		} else {
			//console.log(types);
			res.json({ success: true, message: "Successfully sending types", data: types});
		}
	});
});

// Add a type and/or breed to the databse
router.post('/breeds', function(req, res) {

	// Finds and updates existing model in collection or creates one if it doesn't exist
	// Can have duplicate breeds in each animal type
	if(!req.body.type) {
		res.json({success: false, message: "You did not send a type"});
	} else {


		if(req.decoded.user.admin === true) {
			var update = {};
			if(req.body.breed) {
				update = {$addToSet: { breeds: {breed: req.body.breed}}};
			}

			AnimalType.findOneAndUpdate(
				{type: req.body.type},
				update,
				{safe: true, upsert: true, new : true},
				function(err, model) {
					if(err) {
						console.log(err);
						res.json({success: false, message: "An error occurred"});
					} else {
						res.json({ success: true, message: "Type/breed added successfully"});
					}

				}
			);
		} else {
			res.json({ success: false, message: "You are not an admin"});
		}
	}
});

router.delete('/breeds', function(req, res) {
	console.log(req.query.type);
	console.log(req.query.breed);
	if(!req.query.type && !req.query.breed) {
		res.json({success: false, message: "You did not send any information"});
	} else {
		if(req.decoded.user.admin === true) {
			if(req.query.type && !req.query.breed) {
				AnimalType.remove({type: req.query.type}, function(err) {
					if(err) {
						res.json({success: false, message: "Failed to remove type"});
					} else {
						res.json({success: true, message: "Successfully removed " + req.query.type});
					}
				});
			} else if(req.query.type && req.query.breed) {
				AnimalType.update({type: req.query.type}, { $pull: {breeds: {breed: req.query.breed}}}, function(err) {
					if(err) {
						res.json({success: false, message: "Failed to remove breed"});
					} else {
						res.json({success: true, message: "Successfully removed " + req.query.breed});
					}
					
				});
			} else {
				res.json({success: false, message: "Which values do you want to delete?"});
			}
			
			
		} else {
			res.json({success: false, message: "You are not an admin"});
		}
		
	}
	
	
});


// ==================
// Notifications
// ==================

// Gets notifications of token holder
router.get('/notifications', function(req, res) {

	var user = User.findOne({ _id: req.decoded.user._id }, function(err, user) {
		var notifications = [];

		var numNotifications = user.notifications.length;
		if(numNotifications == 0) {
			res.json([]);

		} else {

			var callback = function() {
				numNotifications -= 1;
				if(numNotifications <= 0) {
					res.json(notifications);
				}
			}

			for(var i = 0; i < user.notifications.length; i++) {
				//console.log(user);
				notifications.push(user.notifications[i]);
				callback();
			}
		}
	});
});

// Posts notification to user :id
router.post('/notifications/:id', function(req, res) {

	// TODO: Should we do some checking to make sure whoever is making the request is being observed by whoever is making the request?

	User.update(
		{ _id: req.params.id },
		{ $addToSet: { notifications: {
			date: new Date(),
			read: false,
			message: 'Test', // TODO: pull message from request
			sender: req.decoded.user._id }}},
		{ safe: true, upsert: true, new : true },
		function(err) {
			if(err) {
				console.log(err);
				res.json({success: false, message: "An error occurred"});
			} else {
				res.json({ success: true, message: "Notification posted" });
			}
		}
	);
});

// Mark all notifications as read
router.put('/notifications', function(req, res) {
	// Mark as read
	var user = User.findOne({'_id': req.decoded.user._id}, function(err, user) {
		if(user) {
			user.notifications.forEach(function(notification) {
				User.update({'_id': req.decoded.user._id, 'notifications.read': false},
					{'$set': { 'notifications.$.read': true }
				}, function(err) {
					if(err) {
						console.log(err);
					}
				});
			});
			res.json({ success: true, message: "Notifications marked as read" });
		} else {
			console.log(err);
			res.json({success: false, message: "An error occurred"});
		}
	})
});

// Mark notification with timestamp :id as read
router.put('/notifications/:id', function(req, res) {
	// Get timestamp for looking up notification
	timestamp = req.params.id;

	// Mark as read
	User.update({'_id': req.decoded.user._id, 'notifications.date': timestamp},
		{'$set': { 'notifications.$.read': true }
	}, function(err) {
		if(err) {
			console.log(err);
			res.json({success: false, message: "An error occurred"});
		} else {
			res.json({ success: true, message: "Notification marked as read" });
		}
	})
});

// Deletes all read notifications older than 2 days
router.delete('/notifications', function(req, res) {

	// Set purgeDate for two days ago
	var purgeDate = new Date();
	purgeDate.setDate(purgeDate.getDate() - 2);

	// Remove notifications
	User.update(
		{ _id: req.decoded.user._id },
		{ $pull: { notifications: { read: true, date: { "$lt": purgeDate } } } },
		function(err) {
			if(err) {
				res.json({ success: false, message: "An error occurred: " + err });
			} else {
				res.json({ success: true, message: "Deleted all read notifications" });
			}
		}
	);
});

// Deletes a single notification
router.delete('/notifications/:id', function(req, res) {
	var timestamp = req.params.id;
	// Remove notification
	User.update(
		{ _id: req.decoded.user._id },
		{ $pull: { notifications: { date: timestamp } } },
		function(err) {
			if(err) {
				res.json({ success: false, message: "An error occurred: " + err });
			} else {
				res.json({ success: true, message: "Deleted notification" });
			}
		}
	);
});

// Export for use in server.js
module.exports = router
