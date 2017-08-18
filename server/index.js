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
const parseString = require('xml2js').parseString;
const CryptoJS = require('crypto-js');
const aws_cred = require('../config');

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

app.get('/api', (req, res) => {

  const access_key_id = aws_cred.access_key_id;
  const secret_key = aws_cred.secret_key ;
  const endpoint = 'webservices.amazon.com';
  const uri = '/onca/xml';
  const associateTag = aws_cred.associate_tag;
  const searchTerm = req.query.product;
  const pairs = [];
  const product_list = [];
	const params = {
		'Service': 'AWSECommerceService',
		'Operation': 'ItemSearch',
		'AWSAccessKeyId': access_key_id,
		'AssociateTag': associateTag,
		'SearchIndex': 'All',
		'Keywords': searchTerm,
		'ResponseGroup': 'Images,ItemAttributes' //, OfferSummary
	};
	
  let keys, canonical_query_string, string_to_sign, hash, signature, request_url,
  productListings;



  if (!params.hasOwnProperty('Timestamp')) {
    params['Timestamp'] = new Date().toISOString();
  }

  keys = Object.keys(params).sort();

  keys.forEach(key =>
    pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(params[key]))
  );

  canonical_query_string = pairs.join('&');

  string_to_sign = `GET\n${endpoint}\n${uri}\n${canonical_query_string}`;

  hash = CryptoJS.HmacSHA256(string_to_sign, secret_key);

  signature = hash.toString(CryptoJS.enc.Base64);

  request_url = `http://${endpoint}${uri}?${canonical_query_string}&Signature=` + encodeURIComponent(signature);

  request.get({url: request_url}, function(err, response, body) {
    if(err) { console.log('Error:', err); return; }

    parseString(body, function (err, result) {
        productListings = result.ItemSearchResponse.Items[0].Item;

        productListings.forEach((product) => {
          product_list.push({
            'id': product.ASIN[0], // ASIN
            'small_image': product.SmallImage[0].URL[0],
            'medium_image': product.MediumImage[0].URL[0],
            'large_image': product.LargeImage[0].URL[0],
            'url': product.DetailPageURL[0],
            'description': product.ItemAttributes[0].Title[0],
            'list_price': product.ItemAttributes[0].ListPrice?product.ItemAttributes[0].ListPrice[0].FormattedPrice[0]:'NA',
            'long_description': product.ItemAttributes[0].Feature.join('; ')
          });
        });

        res.send(product_list)
    });

  });
});

app.use(router);

let port = process.env.PORT || 3000;
var server = app.listen(port, () => console.log('Listening on port ', port));



//socket setup
var io = socket(server);

io.on('connection', (socket) => {
	console.log('Make socket connection', socket.id);

	// socket.on('newListing', (data) => {
	// 	db.Listing.create(
	// 		{name: data.name,
	// 			price: parseInt(data.price),
	// 			location: data.location,
	// 			initializer: data.initializer})
	// 		.then(listing => {
	// 			return db.Listing.findAll();
	// 		})
	// 		.then(results => {
	// 			io.sockets.emit('newListing', results);
	// 		})
	// 		.catch(err => {
	// 			console.log('Error: ', err);
	// 		})
	// });

	socket.on('newListing', (data) => {
		db.Listing.create(
			{name: data.name,
				price: parseInt(data.price),
				location: data.location,
				initializer: data.initializer})
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
