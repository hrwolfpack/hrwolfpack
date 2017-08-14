const LocalStrategy = require('passport-local').Strategy;
const db = require('../db');

module.exports = (passport) => {
	// Configure the login local strategy for use by Passport.
	passport.use('local-login', new LocalStrategy(
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
	// Configure the signup local strategy for use by Passport.
	passport.use('local-signup', new LocalStrategy(
		function(username, password, callback) {
			db.User.findOne({where: {username: username}})
				.then(user => {
					if (user) {
						return callback(null, false);
					} else {
						db.User.create({username, password})
							.then(user => {
								return callback(null, user);
							})
							.catch(err => {
								console.log('Fail to create User: ', err);
							});
					}
				})
				.catch(err => {
					console.log('Fail to search for User: ', err);
				});
		}
	));

	// Configure Passport authenticated session persistence.
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
}
