const express = require('express');
const path = require('path');
const passport = require('passport');
const db = require('../db');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const passportConfig = require('./passport.js');

let app = express();
//Use middleware
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({secret: 'keyboard cat', resave: false,	saveUninitialized: false}));
//configure passport
passportConfig(passport);
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
	passport.authenticate('local-login', {
		successRedirect: '/',
		failureRedirect: '/login'})
);

app.post('/signup',
	passport.authenticate('local-signup', {
		successRedirect: '/',
		failureRedirect: '/login'})
);

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
	db.UserListings.create(
		{listing_id: req.body.listingId, 
			user_id: req.user.id})
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

app.post('/received', (req, res) => {
	db.UserListings.update({
		received: true
	}, {
		where: {
			listing_id: req.body.listingId,
			user_id: req.user.id
		}
	})
	.then(result => {
		res.send('Received!');
	})
	.catch(err => {
		console.log('Error: ', err);
	});
});

app.post('/receiveCount', (req, res) => {
	db.UserListings.findAndCountAll({
		where: {listing_id: req.body.listingId,
				received: true}
	})
	.then(result => {
		res.send(result);
	})
	.catch(err => {
		console.log('Error: ', err);
	});
});

let port = process.env.PORT || 3000;
app.listen(port, () => console.log('Listening on port ', port));
