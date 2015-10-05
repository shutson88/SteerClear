// =======================
// get the packages we need ============
// =======================
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose'); // MongoDB connection module
var bcrypt      = require('bcrypt-nodejs'); // Encryption module

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
var User   = require('./routes/user'); // get our mongoose model

// =======================
// configuration =========
// =======================
var port = process.env.PORT || 8080; // used to create, sign, and verify tokens
app.use(express.static(__dirname + '/assets'));
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

mongoose.connect(config.database); // connect to database
app.set('superSecret', config.secret); // secret variable

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

var path    = require('path');
//Serve up public files
app.use(express.static('public'));

// =======================
// routes ================
// =======================
// basic route

// GET http://ec2-52-88-233-238.us-west-2.compute.amazonaws.com:8080/
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname+'/views/signin.html'));
});

// GET http://ec2-52-88-233-238.us-west-2.compute.amazonaws.com:8080/about
app.get('/about', function(req, res) {
    res.render('about.html');
});

// GET http://ec2-52-88-233-238.us-west-2.compute.amazonaws.com:8080/register
app.get('/register', function(req, res) {
    res.render('register.html'); // TODO: Add Register.html to views folder
});

// POST http://ec2-52-88-233-238.us-west-2.compute.amazonaws.com:8080/register
app.post('/register', function(req, res) {
    // TODO: Create user and add to database from what is passed back to the server
});

// app.get('/setup', function(req, res) {
//
//   // create a sample user
//   var jeremy = new User({
//     name: 'Jeremy Moorman',
//     password: bcrypt.hashSync('password'), // Encrypts password for storage in database
//     admin: true
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

// API ROUTES -------------------
// get an instance of the router for api routes
var apiRoutes = express.Router();

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
apiRoutes.post('/authenticate', function(req, res) {

  // find the user
  User.findOne({
    name: req.body.name
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
  res.json({ message: 'Welcome to the coolest API on earth!' });
});

// route to return all users (GET http://localhost:8080/api/users)
apiRoutes.get('/users', function(req, res) {
  User.find({}, function(err, users) {
    res.json(users);
  });
});

// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);

// =======================
// start the server ======
// =======================
app.listen(port);
console.log('Magic happens at http://localhost:' + port);
