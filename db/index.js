module.exports.fakeDB = require('./fakeDB.js');

var Sequelize = require('sequelize');
//create 'wolfpack' database
var db = new Sequelize('wolfpack', 'root', '', {
	host: 'localhost',
	dialect: 'mysql',
	define: {
        timestamps: false
    }
});

//test connection
db
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

//define schema here

var User = db.define('User', {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  username: Sequelize.STRING,
  password: Sequelize.STRING
}, {ignoreDuplicates: true });

var Listing = db.define('Listing', {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  name: Sequelize.STRING,
  initializer: Sequelize.INTEGER,
  price: Sequelize.DECIMAL(5, 2),
  complete: Sequelize.BOOLEAN,
  location: Sequelize.STRING,
  num_of_participants: Sequelize.INTEGER,
  created_dt: Sequelize.DATE
});

User.sync();
	// .then(function() {
 //    // Now instantiate an object and save it:
 //    return User.create({username: 'Jean Valjean', password: '123j'});
 //  })
Listing.sync();

exports.User = User;
exports.Listing = Listing;
