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


//define schema
var User = db.define('User', {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  username: Sequelize.STRING,
  password: Sequelize.STRING
});

var Listing = db.define('Listing', {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  name: Sequelize.STRING,
  initializer: { type: Sequelize.INTEGER, defaultValue: 1},
  price: Sequelize.DECIMAL(5, 2),
  complete: { type: Sequelize.BOOLEAN, defaultValue: false},
  location: Sequelize.STRING,
  num_of_participants:{ type: Sequelize.INTEGER, defaultValue: 4},
  created_dt: Sequelize.DATE
});

var UserListings = db.define('UserListings', {
  received: { type: Sequelize.BOOLEAN, defaultValue: false}
});

User.belongsToMany(Listing, { through: UserListings});
Listing.belongsToMany(User, { through: UserListings});

//create Users and listings table
User.sync();
Listing.sync();
UserListings.sync();


exports.User = User;
exports.Listing = Listing;
exports.UserListings = UserListings;
