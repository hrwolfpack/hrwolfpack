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
		db.User.findOne({where: {username: username}})
			.then(user => {
				if (!user) {return callback(null, false);}
				if (user.password !== password) {return callback(null, false);}
				return callback(null, user);
			})
			.catch(err => {
				return callback(err);
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
  db.User.findOne({where: {id: id}})
  	.then(user => {
  		cb(null, user);
  	})
  	.catch(err => {
  		return cb(err);
  	})
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

var isLoggedIn = (req, res, next) => {
	if (!req.user) {
		res.redirect('/login');
	} else {
		next();
	}
};
app.get('/', isLoggedIn);
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
	db.User.findOne({where: {username: req.body.username}})
		.then(user => {
			if (user) {
				res.send('User ' + req.body.username + ' already exists!!!')
			} else {
				db.User.create(req.body).then(user => {
					req.login(user, function(err) {
						// if (err) { return next(err); }
						return res.redirect('/');
					});
				});
			}
		})
		.catch((err) => {
			console.log('Error: ', err);
		});
});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

app.post('/listings', (req,res) => {
	db.Listing.create({name: req.body.name, price: parseInt(req.body.price), location: req.body.location, initializer: req.user.id })
	.then(listing => {
		res.send('success');
	});
})

app.get('/listings', (req, res) => {
	db.Listing.findAll()
		.then(results => {
			res.send(results);
		})
		.catch(err => {
			console.log('Error: ', err);
		});
})

app.get('/user', (req, res) => {
	var {id, username} = req.user;
	res.send({id, username});
});

app.post('/join', (req, res) => {
	db.UserListings.create({listing_id: req.body.listingId, user_id: req.user.id})
		.then(results => {
			res.send(results);
		})
		.catch(err => {
			console.log('Error', err);
		});
});

app.post('/userListings', (req, res) => {
	db.UserListings.findAll({
		where: {
			listing_id: req.body.listingId,
			user_id: req.user.id
		}
	})
	.then(results => {
		res.send(results);
	})
	.catch(err => {
		console.log('Error: ', err);
	})
});

app.post('/packsize', (req, res) => {
	db.UserListings.findAndCountAll({
		where: {listing_id: req.body.listingId}
	})
	.then(results => {
		res.send(results);
	})
	.catch(err => {
		console.log('Error: ', err);
	});
});

app.post('/arrived', (req, res) => {
	// db.listings.
	db.Listing.update({
		arrived: true
	}, {
		where: {id: req.body.listingId}
	})
	.then(result => {
		res.send('Listing status updated');
	})
	.catch(err => {
		console.log('Error: ', err);
	});
});

let port = process.env.PORT || 3000;
app.listen(port, () => console.log('Listening on port ', port));
