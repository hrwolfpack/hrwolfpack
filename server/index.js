const express = require('express');
const path = require('path');
const passport = require('passport');
// const db = require('../db');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const passportConfig = require('./passport.js');
const router = require('./routes.js');

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

app.get('/login', (req, res) => {
	res.sendFile(path.join(__dirname, '../client/dist/login.html'));
});

app.get('/signup', (req, res) => {
	res.sendFile(path.join(__dirname, '../client/dist/signup.html'));
});

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

app.use(router);

let port = process.env.PORT || 3000;
app.listen(port, () => console.log('Listening on port ', port));
