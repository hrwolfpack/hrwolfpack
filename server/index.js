const express = require('express');
const path = require('path');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
	function(username, password, callback) {
		users.findBy({username: username}, function(err, user) {
			if (err) {
				return callback(err);
			}
			if (!user) {
				return callback(null, false, {message: 'Incorrect username.'});
			}
			if (user.password !== password) {
				return callback(null, false, {message: 'Incorrect password.'});
			}
			return callback(null, user);
		});
	}
));



let app = express();

app.use('/', express.static(path.join(__dirname, '../client/dist')));

app.get('/test', (req, res) => {
  res.send('hello world');
});

let port = process.env.PORT || 3000;

app.listen(port, () => console.log('Listening on port ', port));
