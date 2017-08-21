const express = require('express');
const path = require('path');
const passport = require('passport');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const passportConfig = require('./passport.js');
const router = require('./routes.js');
const socket = require('socket.io');
const db = require('../db');

let app = express();
//Use middleware
// app.use(morgan('dev'));
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
	// if (!req.user) {
	if (!req.isAuthenticated()) {
		res.redirect('/login');
	} else {
		next();
	}
};
app.get('/login', (req, res) => {
	res.sendFile(path.join(__dirname, '../client/dist/login.html'));
});
app.get('/signup', (req, res) => {
	res.sendFile(path.join(__dirname, '../client/dist/signup.html'));
});

app.get('/*', isLoggedIn);
app.use(express.static(path.join(__dirname, '../client/dist')));

app.post('/login',
	passport.authenticate('local-login', {
		successRedirect: '/new',
		failureRedirect: '/login'})
);

app.post('/signup',
	passport.authenticate('local-signup', {
		successRedirect: '/',
		failureRedirect: '/login'})
);

app.get('/logout', (req, res) => {
	console.log('request to logout received')
  req.logout();
  res.redirect('/login');
});


app.use(router);

let port = process.env.PORT || 3000;
var server = app.listen(port, () => console.log('Listening on port ', port));
// module.exports = app.listen(port, () => console.log('Listening on port ', port));


//socket setup
var io = socket(server);

io.on('connection', (socket) => {
	console.log('Make socket connection', socket.id);

	socket.on('newListing', (data) => {
		db.Listing.create({
			name: data.name,
			price: Number(data.price),
			location: data.location,
			lat: data.lat,
			lng: data.lng,
			initializer: data.initializer,
			description: data.description,
			image_url: data.image_url,
			url: data.url,
			num_of_participants: data.num_of_participants
			})
			.then(listing => {
				io.sockets.emit('newListing', listing);
			})
			.catch(err => {
				console.log('Error: ', err);
			})
	});

	socket.on('join', (data) => {
		db.UserListings.create(
			{listing_id: data.listingId,
				user_id: data.userId})
			.then(results => {
				return db.UserListings.findAndCountAll({
					where: {listing_id: data.listingId}});
			})
			.then(results => {
				io.sockets.emit('join', results);
				if (results.count === data.packSize) {
					db.Listing.update(
						{packed: true},
						{where: {id: data.listingId}});
				}
			})
			.catch(err => {
				console.log('Error', err);
			});
	});

	socket.on('arrived', (data) => {
		db.Listing.update(
			{arrived: true},
			{where: {id: data.listingId}})
			.then(result => {
				return db.Listing.findOne({
					where: {id: data.listingId}});
			})
			.then(result => {
				io.sockets.emit('arrived', result);
			})
			.catch(err => {
				console.log('Error: ', err);
			});
	});

	socket.on('received', (data) => {
		db.UserListings.update(
			{received: true},
			{where: {
				listing_id: data.listingId,
				user_id: data.userId}})
			.then(result => {
				return db.UserListings.findAndCountAll({
					where: {
						listing_id: data.listingId,
						received: true}});
			})
			.then(results => {
				io.sockets.emit('received', results);
				if (results.count === data.packSize) {
					db.Listing.update(
						{completed: true},
						{where: {id: data.listingId}});
				}
			})
			.catch(err => {
				console.log('Error: ', err);
			});
	})
});
