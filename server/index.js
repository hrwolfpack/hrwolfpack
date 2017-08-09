const express = require('express');
const path = require('path');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../db');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');

// Configure the local strategy for use by Passport.
//
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.
passport.use(new LocalStrategy(
	function(username, password, callback) {
		db.fakeDB.findByUsername(username, function(err, user) {
			if (err) {return callback(err);}
			if (!user) {return callback(null, false);}
			if (user.password !== password) {return callback(null, false);}
			return callback(null, user);
		});
	}
));
// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  db.fakeDB.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});


let app = express();
//Use middleware
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({secret: 'keyboard cat', resave: false,	saveUninitialized: false}));
// Initialize Passport and restore authentication state, if any, from the session.
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, '../client/dist')));
app.use('/login', express.static(path.join(__dirname, '../client/dist/login.html')));
app.use('/signup', express.static(path.join(__dirname, '../client/dist/signup.html')));

app.post('/login', 
	passport.authenticate('local', {failureRedirect: '/login'}),
	(req, res) => {
		res.redirect('/');
	}
);

app.post('/signup', (req, res) => {
	var {username, password} = req.body;
	db.fakeDB.addUser(req.body, (err, user) => {
		if (!user) {
			console.log('username already exists');
			res.redirect('/signup');
		}
		req.login(user, (err) => {
			// if (err) { return next(err); }
  			res.redirect('/');
		});
	});
})

app.get('/users', (req, res) => {
	res.send(db.fakeDB.getUsers());
})

let port = process.env.PORT || 3000;
app.listen(port, () => console.log('Listening on port ', port));
