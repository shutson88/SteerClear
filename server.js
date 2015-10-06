// =======================
// get the packages we need ============
// =======================
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose'); // MongoDB connection module

var config = require('./config'); // get our config file
var User   = require('./routes/user'); // get our mongoose model
var Animal = require('./routes/animal');

// =======================
// configuration =========
// =======================
var port = process.env.PORT || 8080; // used to create, sign, and verify tokens
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
//app.use(express.json());
//app.use(express.urlencoded());

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


// GET http://ec2-52-88-233-238.us-west-2.compute.amazonaws.com:8080/about
app.get('/about', function(req, res) {
    res.render('about.html');
});

// GET http://ec2-52-88-233-238.us-west-2.compute.amazonaws.com:8080/register
app.get('/register', function(req, res) {
    res.render('register.html'); 
});

app.get('/addanimal', function(req, res) {
    res.render('addanimal.html'); 
});

app.get('/viewanimals', function(req, res) {
    res.render('viewanimals.html'); 
});

// POST http://ec2-52-88-233-238.us-west-2.compute.amazonaws.com:8080/register
app.post('/register', function(req, res) {
    User({
		username: req.body.username,
		password: bcrypt.hashSync(req.body.password)
	}).save(function(err) {
		if(err) throw err;
		console.log(req.body.username + ' saved successfully');
		res.json({ success: true});
	});

});


// API ROUTES -------------------
// get an instance of the router for api routes
var apiRoutes = express.Router();

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
apiRoutes.post('/authenticate', function(req, res) {

  // find the user
  User.findOne({
    username: req.body.username
  }, function(err, user) {

    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {

      // check if password matches
      if (!bcrypt.compareSync(req.body.password, user.password)) { // Checks given password with stored encrypted ones
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
apiRoutes.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
		console.log("successful token auth");
        req.decoded = decoded;
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({
        success: false,
        message: 'No token provided.'
    });

  }
});

// route to show a random message (GET http://localhost:8080/api/)
apiRoutes.get('/', function(req, res) {
  res.json({ message: 'Welcome to the SteerClear API on earth!' });
});

// route to add an animal (GET http://localhost:8080/api/addanimal)
apiRoutes.post('/addanimal', function(req, res) {
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

// route to return all users (GET http://localhost:8080/api/users)
apiRoutes.post('/viewanimals', function(req, res) {
	var animals = Animal.find({ managedBy: req.decoded.username }, function(err, animals) {
		res.json(animals);
	});
  
});


// route to return all users (GET http://localhost:8080/api/users)
apiRoutes.get('/users', function(req, res) {
  User.find({}, function(err, users) {
    res.json(users);
  });
});


// address:port/api/*
var apiRoutes = require('./routes/apiRouter');
app.use('/api', apiRoutes);

// =======================
// start the server ======
// =======================
app.listen(port);
console.log('Server started');
